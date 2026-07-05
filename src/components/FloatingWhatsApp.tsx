"use client";
/* Botão flutuante de WhatsApp — canto inferior direito, em todas as telas.
   Aponta para o mesmo link da seção "Vamos construir juntos". */
const WA_NUMBER = "5511936239317";
const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Olá, vim pelo site da Yarden Lab e gostaria de conversar.",
)}`;

export default function FloatingWhatsApp() {
  return (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="floating-wa"
    >
      <img src="/iconeWhatsVermelho.svg" alt="WhatsApp" />
      <style>{`
        .floating-wa {
          position: fixed;
          right: clamp(16px, 2.5vw, 28px);
          bottom: clamp(16px, 2.5vw, 28px);
          z-index: 990;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cream);
          border-radius: 50%;
          box-shadow: 0 8px 26px rgba(0,0,0,0.30);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .floating-wa:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
        }
        .floating-wa img {
          width: 64%;
          height: 64%;
          display: block;
          pointer-events: none;
        }
        @media (max-width: 600px) {
          .floating-wa { width: 54px; height: 54px; }
        }
      `}</style>
    </a>
  );
}
