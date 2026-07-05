"use client";
import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import YardenLogo from "./YardenLogo";

// Em ordem das seções da página
const links = [
  { label: "Método", href: "#method" },
  { label: "Produção", href: "#portfolio" },
  { label: "Inteligência", href: "#ai" },
  { label: "Planos", href: "#plans" },
  { label: "Quem Somos", href: "#manifesto" },
  { label: "Contato", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Esconde a navbar do site enquanto o IntroHero (1ª tela) está visível
  const [pastIntro, setPastIntro] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setPastIntro(window.scrollY > window.innerHeight * 0.72);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <m.nav
        className="navbar-yarden"
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: pastIntro ? 0 : -80,
          opacity: pastIntro ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: "0 60px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(28, 6, 8, 0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(243,235,226,0.08)" : "none",
          pointerEvents: pastIntro ? "auto" : "none",
          transition:
            "background 0.5s ease, backdrop-filter 0.5s ease, border-color 0.5s ease",
        }}
      >
        <a href="#" aria-label="Yarden Lab Home">
          <YardenLogo mode="light" size="sm" />
        </a>

        {/* Desktop */}
        <div
          className="desktop-nav"
          style={{ display: "flex", alignItems: "center", gap: "30px" }}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: "var(--cream)",
                fontSize: "12px",
                fontWeight: 400,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.75,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`https://wa.me/5511936239317?text=${encodeURIComponent("Olá! Vim pelo site da Yarden Lab e gostaria de conversar.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: "12px 28px", fontSize: "11px" }}
          >
            Fale Conosco
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "8px",
          }}
        >
          {[24, menuOpen ? 0 : 18, 24].map((w, i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: `${w}px`,
                height: "1.5px",
                background: "var(--cream)",
                transition: "all 0.3s ease",
                transform:
                  menuOpen && i === 0
                    ? "rotate(45deg) translate(4px, 5px)"
                    : menuOpen && i === 2
                      ? "rotate(-45deg) translate(4px, -5px)"
                      : "none",
              }}
            />
          ))}
        </button>
      </m.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <m.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
              background: "var(--espresso)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "80px 40px 60px",
              gap: "40px",
            }}
          >
            {links.map((link, i) => (
              <m.a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 + 0.1 }}
                style={{
                  color: "var(--cream)",
                  fontSize: "clamp(36px, 8vw, 64px)",
                  fontFamily: "var(--font-serif)",
                  fontWeight: 300,
                  fontStyle: "normal",
                  lineHeight: 1.1,
                }}
              >
                {link.label}
              </m.a>
            ))}
            <m.a
              href={`https://wa.me/5511936239317?text=${encodeURIComponent("Olá! Vim pelo site da Yarden Lab e gostaria de conversar.")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="btn-primary"
              style={{ marginTop: "16px" }}
            >
              Fale Conosco
            </m.a>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
