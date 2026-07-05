import type { NextConfig } from "next";

// Headers de segurança aplicados a todas as rotas
const securityHeaders = [
  // Força HTTPS por 2 anos (inclui subdomínios)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Impede o browser de "adivinhar" o tipo do conteúdo
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Anti-clickjacking (não deixa embutir o site em iframe de terceiros)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Controla o quanto do referrer é enviado
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desliga APIs sensíveis que o site não usa
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Esconde o header "X-Powered-By: Next.js"
  poweredByHeader: false,
  // Otimização de imagem (webp/avif, responsivo, cache longo na CDN da Vercel)
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "durqlolzozhibydhetzy.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
