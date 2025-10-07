import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Default-Einstellungen genügen; App Router ist aktiv, da /app existiert
  }
};

export default nextConfig;
