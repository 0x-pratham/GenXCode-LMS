// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cosmolix.co.in', // User uploaded image source
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Fallback image source
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // Good to have for user profiles
      },
    ],
  },
};

export default nextConfig;