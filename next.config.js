/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'maps.googleapis.com',
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
