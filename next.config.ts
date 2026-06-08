import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  experimental: {
    preloadEntriesOnStart: false,
  },
};

export default nextConfig;
