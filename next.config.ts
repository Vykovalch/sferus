import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Фотографии объявлений лежат в Vercel Blob: `<store>.public.blob.vercel-storage.com`.
    // Без этого правила next/image откажется отдавать внешний адрес.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
