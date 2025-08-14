import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
