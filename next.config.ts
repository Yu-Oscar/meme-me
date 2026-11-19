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
    deviceSizes: [640, 828, 1200],
    imageSizes: [256, 384],
  },
};

export default nextConfig;
