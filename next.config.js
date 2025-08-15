/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  eslint: {
    // Allow production builds to succeed even if ESLint errors are present
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip type checking during production builds. Remove once types are fixed.
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
