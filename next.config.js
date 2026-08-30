/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false; // Disable disk caching in dev mode to prevent Webpack ENOENT white screen crashes on Windows
    }
    return config;
  },
};

module.exports = nextConfig;
