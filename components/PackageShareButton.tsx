"use client";

import { useState } from "react";
import Image from "next/image";
import { Share2, Copy, Check } from "lucide-react";
import { Badge, Button, Modal } from "@/components/ui";
import { CONTACT } from "@/lib/constants";
import { notify } from "@/lib/notifications";

interface PackageShareButtonProps {
  packageName: string;
  destination: string;
  durationLabel: string;
  priceLabel: string;
  image: string;
  url: string;
}

export default function PackageShareButton({
  packageName,
  destination,
  durationLabel,
  priceLabel,
  image,
  url,
}: Readonly<PackageShareButtonProps>) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      notify.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notify.error("Could not copy the link. Please copy it manually.");
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Check out this package - ${packageName}: ${url}`,
  );
  const whatsappUrl = `https://wa.me/${CONTACT.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label="Share this package"
        onClick={() => setOpen(true)}
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        title="Share This Package"
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-2xl border border-brand-blue-900/10 bg-brand-mist-200/40 p-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={image}
                alt={packageName}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="truncate text-sm font-semibold text-brand-ink-900">
                {packageName}
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="brand" size="sm">
                  {durationLabel}
                </Badge>
                <span className="text-xs text-brand-muted-600">
                  {destination}
                </span>
              </div>
              <p className="text-sm font-bold text-brand-ink-900">
                {priceLabel}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleCopyLink}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy Link"}
            </Button>

            <Button asChild variant="primary" size="md">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Share on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
