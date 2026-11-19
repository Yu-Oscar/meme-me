import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tacalrqmlktsmyvkleuf.supabase.co",
        pathname: "/storage/v1/object/public/templates/**",
      },
    ],
    // Vercel bills a transformation each time a cached variant expires.
    // Overwriting a file at the same URL can show the old one for up to 31 days,
    // so upload replacements under a new path.
    minimumCacheTTL: 2678400,
    // The Vercel image quota ran out on 2026-11-19, and variants that are not
    // already cached return 402 until it resets. 640 px is the only width
    // cached for a useful share of images, so it is the only one served.
    // This is safe to keep. For sharper hero images on large screens and
    // lighter small thumbnails, switch to this once the quota has reset:
    //   deviceSizes: [640, 828, 1200], imageSizes: [256, 384]
    deviceSizes: [640],
    imageSizes: [],
  },
};

export default nextConfig;
