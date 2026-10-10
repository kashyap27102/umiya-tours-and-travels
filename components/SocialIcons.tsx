import type { ReactElement } from "react";

export type SocialKey = "instagram" | "facebook" | "youtube" | "google";

/** A point on a circle, angle in degrees clockwise from the right. */
const point = (cx: number, cy: number, r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return `${(cx + r * Math.cos(rad)).toFixed(2)} ${(cy + r * Math.sin(rad)).toFixed(2)}`;
};

/** An arc of a circle from one angle to another, clockwise. */
const arc = (r: number, from: number, to: number) =>
  `M${point(12, 12, r, from)}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${point(12, 12, r, to)}`;

/** Brand marks drawn as small coloured SVGs (the icon set has no brand logos). */
const ICONS: Record<SocialKey, ReactElement> = {
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
      <defs>
        <linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FEDA77" />
          <stop offset="0.35" stopColor="#F58529" />
          <stop offset="0.6" stopColor="#DD2A7B" />
          <stop offset="1" stopColor="#515BD4" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="6.5" fill="url(#ig-grad)" />
      <rect
        x="6.2"
        y="6.2"
        width="11.6"
        height="11.6"
        rx="3.6"
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="2.9" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="16.1" cy="7.9" r="1" fill="#fff" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.4 22v-7.6h2.5l.4-3h-2.9V9.5c0-.9.3-1.5 1.5-1.5h1.5V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v1.4H8v3h2.5V22h2.9z"
      />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
      <rect x="1" y="4.5" width="22" height="15" rx="4.5" fill="#FF0000" />
      <path fill="#fff" d="M9.8 8.9v6.2l5.4-3.1z" />
    </svg>
  ),
  google: (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6" fill="none">
      <path d={arc(8, 200, 320)} stroke="#EA4335" strokeWidth="3.4" />
      <path d={arc(8, 140, 200)} stroke="#FBBC05" strokeWidth="3.4" />
      <path d={arc(8, 40, 140)} stroke="#34A853" strokeWidth="3.4" />
      <path d={arc(8, 340, 400)} stroke="#4285F4" strokeWidth="3.4" />
      <path d="M12 12h8.2" stroke="#4285F4" strokeWidth="3.4" />
    </svg>
  ),
};

/** A round white button with a brand logo, linking to a social profile. */
export default function SocialLink({
  kind,
  label,
  href,
}: Readonly<{ kind: SocialKey; label: string; href: string }>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer me"
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue-900"
    >
      {ICONS[kind]}
    </a>
  );
}
