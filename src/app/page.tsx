import IntroHero from "@/components/IntroHero";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Process from "@/components/Process";
import MediaReel from "@/components/MediaReel";
import AISection from "@/components/AISection";
import PlansSection from "@/components/PlansSection";
import Manifesto from "@/components/Manifesto";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

/* Dados estruturados (JSON-LD) — ajuda o Google a entender a marca */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Yarden Lab",
  url: "https://yardenlab.com",
  email: "contato@yardenlab.com",
  description:
    "Inteligência completa de marca para empresas premium — estratégia, branding, conteúdo, tráfego e IA como um organismo único.",
  sameAs: [
    "https://instagram.com/yardenlab_",
    "https://www.linkedin.com/in/yarden-lab-10a17a410/",
  ],
  areaServed: "BR",
  slogan: "A travessia começou.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Tela de abertura — fixa no fundo, revelada ao rolar */}
      <IntroHero />

      {/* Site real — desliza por cima do intro ao rolar */}
      <div className="site-shell">
        <Navbar />
        <main>
          <Hero />
          <Mission />
          <Process />
          <MediaReel />
          <AISection />
          <PlansSection />
          <Manifesto />
          <Contact />
        </main>
        <Footer />
      </div>

      {/* Botão flutuante de WhatsApp */}
      <FloatingWhatsApp />
    </>
  );
}
