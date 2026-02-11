import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ghorerbazar.com",
      },
      {
        protocol: "https",
        hostname: "fikmoemoatiuvvrdxwcm.supabase.co",
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;
