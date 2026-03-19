/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  transpilePackages: ["fuse.js"],
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
