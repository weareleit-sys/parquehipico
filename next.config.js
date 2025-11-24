/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Esto ayuda a que las imágenes no fallen en local
  },
};

module.exports = nextConfig;
