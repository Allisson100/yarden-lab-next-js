import type { Metadata, Viewport } from "next";
import "./globals.css";

/* Domínio de produção — ajuste se o domínio final for outro */
const SITE_URL = "https://yardenlab.com";
const OG_IMAGE =
  "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/foto-1.webp";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yarden Lab — Inteligência de marca para empresas premium",
    template: "%s · Yarden Lab",
  },
  description:
    "Yarden Lab é a inteligência completa de marca para empresas premium — estratégia, branding, produção de conteúdo, tráfego e IA funcionando como um organismo único. A travessia começou.",
  keywords: [
    "Yarden Lab",
    "agência de marketing premium",
    "inteligência de marca",
    "branding",
    "estratégia de marca",
    "marketing com IA",
    "gestão de tráfego",
    "produção de conteúdo",
    "posicionamento de marca",
    "marketing estratégico",
  ],
  authors: [{ name: "Yarden Lab" }],
  creator: "Yarden Lab",
  publisher: "Yarden Lab",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Yarden Lab",
    title: "Yarden Lab — Inteligência de marca para empresas premium",
    description:
      "Estratégia, branding, conteúdo, tráfego e IA como um organismo único. A travessia começou.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Yarden Lab — Inteligência de marca",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarden Lab — Inteligência de marca para empresas premium",
    description:
      "Estratégia, branding, conteúdo, tráfego e IA como um organismo único. A travessia começou.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "business",
};

export const viewport: Viewport = {
  themeColor: "#360f11",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* preconnect ao storage das imagens/vídeos (LCP + grid) — economiza o handshake */}
        <link
          rel="preconnect"
          href="https://lipm23rsbosgzvrt.public.blob.vercel-storage.com"
          crossOrigin="anonymous"
        />
        {/* preload da fonte serif usada acima da dobra (hero) — reduz o flash */}
        <link
          rel="preload"
          href="/fonts/BigCaslonFB-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {children}
      </body>
    </html>
  );
}
