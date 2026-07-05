"use client";
import YardenLogo from "./YardenLogo";

// Em ordem das seções da página
const navLinks = [
  { label: "Método", href: "#method" },
  { label: "Produção", href: "#portfolio" },
  { label: "Inteligência IA", href: "#ai" },
  { label: "Planos", href: "#plans" },
  { label: "Quem Somos", href: "#manifesto" },
  { label: "Contato", href: "#contact" },
];

const services = [
  "Diagnóstico Yarden",
  "Plano Travessia",
  "Operação Corrente",
  "Operação Yarden 360",
  "Sprint Inteligência",
  "Sprint de Captação",
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--espresso)",
        borderTop: "1px solid rgba(243,235,226,0.06)",
      }}
    >
      {/* Main footer */}
      <div
        className="container footer-inner"
        style={{ padding: "80px 60px 60px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "60px",
            marginBottom: "72px",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ marginBottom: "24px" }}>
              <YardenLogo mode="light" size="sm" />
            </div>
            <p
              style={{
                color: "rgba(243,235,226,0.45)",
                fontSize: "14px",
                lineHeight: 1.7,
                maxWidth: "300px",
                fontWeight: 300,
                marginBottom: "32px",
              }}
            >
              Laboratório de marca que une estratégia criativa, tecnologia e
              inteligência artificial para construir presença real no mercado
              premium.
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                {
                  label: "Instagram",
                  handle: "@yardenlab_",
                  href: "https://instagram.com/yardenlab_",
                  icon: (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  handle: "Yarden Lab",
                  href: "https://www.linkedin.com/in/yarden-lab-10a17a410/",
                  icon: (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ),
                },
              ].map(({ label, handle, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={handle}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 14px 8px 10px",
                    border: "1px solid rgba(243,235,226,0.12)",
                    color: "rgba(243,235,226,0.5)",
                    fontSize: "11px",
                    letterSpacing: "0.05em",
                    fontWeight: 400,
                    transition: "all 0.25s ease",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--cream)";
                    e.currentTarget.style.color = "var(--cream)";
                    e.currentTarget.style.background =
                      "rgba(243, 235, 226,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(243,235,226,0.12)";
                    e.currentTarget.style.color = "rgba(243,235,226,0.5)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {icon}
                  <span>{handle}</span>
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ opacity: 0.4 }}
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h5
              style={{
                color: "var(--cream)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              Navegação
            </h5>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    style={{
                      color: "rgba(243,235,226,0.45)",
                      fontSize: "13px",
                      fontWeight: 300,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--cream)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(243,235,226,0.45)")
                    }
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5
              style={{
                color: "var(--cream)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              Soluções
            </h5>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {services.map((s) => (
                <li key={s}>
                  <a
                    href="#plans"
                    style={{
                      color: "rgba(243,235,226,0.45)",
                      fontSize: "13px",
                      fontWeight: 300,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--cream)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(243,235,226,0.45)")
                    }
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5
              style={{
                color: "var(--cream)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              Contato
            </h5>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <a
                href="mailto:contato@yardenlab.com"
                style={{
                  color: "rgba(243,235,226,0.45)",
                  fontSize: "13px",
                  fontWeight: 300,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--cream)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(243,235,226,0.45)")
                }
              >
                contato@yardenlab.com
              </a>
              <p
                style={{
                  color: "rgba(243,235,226,0.35)",
                  fontSize: "13px",
                  fontWeight: 300,
                  lineHeight: 1.5,
                }}
              >
                São Paulo, Brasil
              </p>
            </div>

            <div style={{ marginTop: "32px" }}>
              <a
                href="#contact"
                className="btn-outline-light"
                style={{ fontSize: "11px", padding: "12px 20px" }}
              >
                Fale Conosco
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(243,235,226,0.07)",
            paddingTop: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p
            style={{
              color: "rgba(243,235,226,0.25)",
              fontSize: "12px",
              fontWeight: 300,
            }}
          >
            © {new Date().getFullYear()} Yarden Lab®. Todos os direitos
            reservados.
          </p>
          <p
            style={{
              color: "rgba(243,235,226,0.2)",
              fontSize: "11px",
              fontFamily: "var(--font-serif)",
              fontStyle: "normal",
            }}
          >
            Marketing com inteligência de verdade.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 640px) {
          /* 2 colunas no mobile; a marca ocupa a linha inteira no topo */
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px 24px !important; }
          .footer-grid > *:first-child { grid-column: 1 / -1 !important; }
          .footer-inner { padding: 64px 24px 48px !important; }
        }
      `}</style>
    </footer>
  );
}
