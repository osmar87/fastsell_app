/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Desativa no dev
});

const nextConfig = withPWA({
  reactStrictMode: true,
});

module.exports = nextConfig;
