import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["https://wcjbahrowkksqpsavauy.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wcjbahrowkksqpsavauy.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
