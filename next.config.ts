import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Debe ser >= MAX_IMAGE_BYTES en app/admin/actions.ts (subida de
      // fotos de subcategoría), si no Next.js rechaza el body antes de
      // que corra el chequeo de tamaño propio.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
