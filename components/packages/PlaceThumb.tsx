"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

/** Small square photo of a place; shows a map pin if there is none or it fails to load. */
export default function PlaceThumb({ src }: Readonly<{ src: string | null }>) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-blue-700/10 text-brand-blue-700">
      {src && !failed ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="64px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <MapPin className="h-6 w-6" aria-hidden />
      )}
    </span>
  );
}
