import dns from "node:dns";
import https from "node:https";
import net from "node:net";
import {
  MEDIA_ALLOWED_TYPES,
  MEDIA_MAX_BYTES,
  sniffImageType,
  type MediaMimeType,
} from "@/lib/media";

/**
 * Downloads an image from a user-supplied link without letting that link reach
 * internal services (SSRF):
 *  - https on port 443 only, no embedded credentials
 *  - every address the host resolves to is checked, at connect time, so a
 *    hostname that switches to a private address after validation is refused
 *  - redirects are followed by hand (max 3) and each hop is checked again
 *  - 10 s per request / 20 s overall, size capped while streaming
 *  - the bytes themselves must be a real jpeg/png/webp/avif
 */

const MAX_REDIRECTS = 3;
const REQUEST_TIMEOUT_MS = 10_000;
const OVERALL_TIMEOUT_MS = 20_000;
const ALLOWED_TYPE_SET = new Set<string>(MEDIA_ALLOWED_TYPES);

/** An error whose message is safe to show to the admin. */
export class SafeFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SafeFetchError";
  }
}

function ipv4IsPrivate(ip: string): boolean {
  const [a, b, c] = ip.split(".").map(Number);
  return (
    a === 0 || // "this" network
    a === 10 ||
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    a === 127 || // loopback
    (a === 169 && b === 254) || // link-local, cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && c === 0) || // IETF protocol assignments
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) || // benchmarking
    a >= 224 // multicast and reserved
  );
}

/** True for any address that must never be fetched (private, loopback, link-local...). */
export function isPrivateAddress(ip: string): boolean {
  const family = net.isIP(ip);
  if (family === 4) return ipv4IsPrivate(ip);
  if (family === 6) {
    const lower = ip.toLowerCase();
    if (lower === "::" || lower === "::1") return true;
    // IPv4-mapped (::ffff:a.b.c.d) -> judge the embedded IPv4 address
    const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return ipv4IsPrivate(mapped[1]);
    if (lower.startsWith("::ffff:")) return true; // hex form of a mapped address
    const first = parseInt(lower.split(":")[0] || "0", 16);
    return (
      (first & 0xfe00) === 0xfc00 || // fc00::/7 unique local
      (first & 0xffc0) === 0xfe80 || // fe80::/10 link-local
      (first & 0xff00) === 0xff00 // multicast
    );
  }
  return true; // not an IP at all: refuse rather than guess
}

/** Syntax-level checks. Throws SafeFetchError; returns the parsed URL. */
export function validateRemoteUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new SafeFetchError("That doesn't look like a valid link.");
  }
  if (url.protocol !== "https:") {
    throw new SafeFetchError("Only https:// links are allowed.");
  }
  if (url.username || url.password) {
    throw new SafeFetchError("Links with a username or password aren't allowed.");
  }
  if (url.port && url.port !== "443") {
    throw new SafeFetchError("Only the standard https port is allowed.");
  }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (!host) throw new SafeFetchError("That link has no website name.");
  if (net.isIP(host) && isPrivateAddress(host)) {
    throw new SafeFetchError("That address isn't allowed.");
  }
  return url;
}

type LookupCallback = (
  err: NodeJS.ErrnoException | null,
  address: string | dns.LookupAddress[],
  family?: number,
) => void;

/** DNS lookup that refuses to return any private address. Used at connect time. */
function safeLookup(
  hostname: string,
  options: dns.LookupOptions,
  callback: LookupCallback,
) {
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err, "");
    const list = addresses as dns.LookupAddress[];
    if (list.length === 0 || list.some((a) => isPrivateAddress(a.address))) {
      return callback(
        new SafeFetchError("That address isn't allowed.") as NodeJS.ErrnoException,
        "",
      );
    }
    if (options.all) return callback(null, list);
    callback(null, list[0].address, list[0].family);
  });
}

export interface DownloadedImage {
  bytes: Buffer;
  contentType: MediaMimeType;
}

function requestOnce(
  url: URL,
  deadline: number,
): Promise<
  | { kind: "redirect"; location: string }
  | { kind: "image"; bytes: Buffer; declaredType: string }
> {
  return new Promise((resolve, reject) => {
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      return reject(new SafeFetchError("The link took too long to respond."));
    }

    const req = https.request(
      url,
      {
        method: "GET",
        lookup: safeLookup as unknown as net.LookupFunction,
        headers: {
          Accept: "image/jpeg,image/png,image/webp,image/avif",
          "User-Agent": "UmiyaToursImageFetcher/1.0",
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;

        if ([301, 302, 303, 307, 308].includes(status)) {
          res.resume();
          const location = res.headers.location;
          return location
            ? resolve({ kind: "redirect", location })
            : reject(new SafeFetchError("The link redirected nowhere."));
        }
        if (status !== 200) {
          res.resume();
          return reject(
            new SafeFetchError(`The website answered with an error (${status}).`),
          );
        }

        const declaredType = String(res.headers["content-type"] ?? "")
          .split(";")[0]
          .trim()
          .toLowerCase();
        if (!ALLOWED_TYPE_SET.has(declaredType)) {
          res.resume();
          return reject(
            new SafeFetchError("That link isn't a JPG, PNG, WebP or AVIF image."),
          );
        }
        const length = Number(res.headers["content-length"]);
        if (Number.isFinite(length) && length > MEDIA_MAX_BYTES) {
          res.resume();
          return reject(new SafeFetchError("That image is larger than 5 MB."));
        }

        const chunks: Buffer[] = [];
        let received = 0;
        res.on("data", (chunk: Buffer) => {
          received += chunk.length;
          if (received > MEDIA_MAX_BYTES) {
            req.destroy(new SafeFetchError("That image is larger than 5 MB."));
            return;
          }
          chunks.push(chunk);
        });
        res.on("end", () =>
          resolve({ kind: "image", bytes: Buffer.concat(chunks), declaredType }),
        );
        res.on("error", reject);
      },
    );

    req.setTimeout(Math.min(REQUEST_TIMEOUT_MS, remaining), () =>
      req.destroy(new SafeFetchError("The link took too long to respond.")),
    );
    req.on("error", (err) =>
      reject(
        err instanceof SafeFetchError
          ? err
          : new SafeFetchError("Couldn't reach that link."),
      ),
    );
    req.end();
  });
}

/** Downloads and verifies an image from a pasted link. Throws SafeFetchError. */
export async function downloadImage(rawUrl: string): Promise<DownloadedImage> {
  const deadline = Date.now() + OVERALL_TIMEOUT_MS;
  let url = validateRemoteUrl(rawUrl);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const result = await requestOnce(url, deadline);

    if (result.kind === "redirect") {
      if (hop === MAX_REDIRECTS) {
        throw new SafeFetchError("The link redirects too many times.");
      }
      url = validateRemoteUrl(new URL(result.location, url).toString());
      continue;
    }

    const realType = sniffImageType(result.bytes);
    if (!realType) {
      throw new SafeFetchError("That file isn't a valid image.");
    }
    if (result.bytes.length === 0) {
      throw new SafeFetchError("That image is empty.");
    }
    return { bytes: result.bytes, contentType: realType };
  }
  throw new SafeFetchError("The link redirects too many times.");
}
