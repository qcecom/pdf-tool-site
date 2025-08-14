/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
