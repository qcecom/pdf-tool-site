/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'pdfjs-dist'];
    return config;
  },
};

module.exports = nextConfig;
