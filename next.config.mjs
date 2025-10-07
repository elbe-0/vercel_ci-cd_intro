// Mirrors next.config.ts so the CLI can run without TypeScript config support.
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Default-Einstellungen genügen; App Router ist aktiv, da /app existiert
  }
};

export default nextConfig;
