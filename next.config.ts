import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'img.teknosa.com' },
      { hostname: 'cdn.teknosa.com' },
      { hostname: 'images.teknosa.com' },
      { hostname: 'm.media-amazon.com' },
      { hostname: 'press.asus.com' },
      { hostname: '*.teknosa.com' },
    ],
  },
};

export default nextConfig;
