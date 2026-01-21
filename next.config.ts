import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones para Vercel
  reactStrictMode: true,
  
  // Configuración de imágenes para dominios externos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'grainy-gradients.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
      },
    ],
    // Formatos modernos para mejor rendimiento
    formats: ['image/avif', 'image/webp'],
  },

  // Configuración de headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Optimización de paquetes para mejor rendimiento
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'motion'],
  },

  // Configuración de TypeScript para build
  typescript: {
    // Ignorar errores en producción si es necesario (cambiar a false para desarrollo estricto)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
