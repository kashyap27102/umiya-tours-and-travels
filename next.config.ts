import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "default",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
    ],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
