"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const WA_NUMBER = "5511936239317";
const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Olá, vim pelo site da Yarden Lab e gostaria de conversar.",
)}`;

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export default function Contact() {
  const ref = useRef<any>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const contacts = [
    {
      label: "WhatsApp",
      value: "+55 11 93623-9317",
      href: waHref,
      icon: <WhatsAppIcon />,
      external: true,
    },
    {
      label: "E-mail",
      value: "contato@yardenlab.com",
      href: "mailto:contato@yardenlab.com",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      value: "@yardenlab_",
      href: "https://instagram.com/yardenlab_",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      external: true,
    },
    {
      label: "LinkedIn",
      value: "Yarden Lab",
      href: "https://www.linkedin.com/in/yarden-lab-10a17a410/",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      className="contact-section"
      style={{
        background: "var(--espresso)",
        padding: "84px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("https://durqlolzozhibydhetzy.supabase.co/storage/v1/object/public/YardenLabFiles/foto-7.jpg?w=1920&auto=format&fit=crop&q=60")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.5,
        }}
      />

      <div
        className="container"
        ref={ref}
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: "100px",
            alignItems: "center",
          }}
          className="contact-grid"
        >
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9 }}
          >
            <p className="section-label" style={{ color: "var(--cream)" }}>
              Contato
            </p>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 300,
                fontSize: "clamp(36px, 5vw, 68px)",
                lineHeight: 1.05,
                color: "var(--cream)",
                marginBottom: "32px",
              }}
            >
              Vamos construir
              <br />
              <em style={{ fontStyle: "normal", color: "var(--cream)" }}>
                juntos.
              </em>
            </h2>

            <p
              style={{
                color: "rgba(243,235,226,0.6)",
                fontSize: "clamp(14px, 1.4vw, 17px)",
                lineHeight: 1.7,
                marginBottom: "48px",
                fontWeight: 300,
              }}
            >
              Se sua marca está pronta para crescer com método, inteligência e
              estética, a Yarden Lab é o parceiro certo. Chame a gente no
              WhatsApp, conte sobre o seu momento e vamos juntos encontrar o
              caminho ideal.
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {contacts.map(({ label, value, href, icon, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      border: "1px solid rgba(243,235,226,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--cream)",
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div
                      style={{
                        color: "rgba(243,235,226,0.35)",
                        fontSize: "10px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        color: "var(--cream)",
                        fontSize: "15px",
                        fontWeight: 300,
                      }}
                    >
                      {value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — CTA WhatsApp */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="contact-form-box"
            style={{
              background: "rgba(12,3,5,0.5)",
              border: "1px solid rgba(243,235,226,0.08)",
              padding: "56px 48px",
              backdropFilter: "blur(10px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "26px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "58px",
                height: "58px",
                borderRadius: "50%",
                background: "rgba(243,235,226,0.08)",
                border: "1px solid rgba(243,235,226,0.15)",
                color: "var(--cream)",
              }}
            >
              <WhatsAppIcon size={26} />
            </span>

            <div>
              <p
                style={{
                  color: "var(--cream)",
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: "16px",
                }}
              >
                Fale com a gente
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 300,
                  fontStyle: "normal",
                  fontSize: "clamp(26px, 3vw, 38px)",
                  lineHeight: 1.12,
                  color: "var(--cream)",
                  marginBottom: "16px",
                }}
              >
                Atendimento direto, no WhatsApp.
              </h3>
              <p
                style={{
                  color: "rgba(243,235,226,0.6)",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                Sem formulário e sem burocracia. Manda uma mensagem, conta o seu
                momento e a gente te responde rápido para encontrar o melhor
                caminho.
              </p>
            </div>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "18px 28px",
                background: "var(--cream)",
                color: "var(--espresso)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: "8px",
                transition: "opacity 0.25s ease, transform 0.25s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <WhatsAppIcon size={18} />
              Falar no WhatsApp
            </a>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 768px) {
          .contact-section { padding: 48px 0 44px !important; }
          .contact-form-box { padding: 32px 24px !important; }
        }
      `}</style>
    </section>
  );
}
