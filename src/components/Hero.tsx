"use client";
import { useRef, useState, useLayoutEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useTime,
  useInView,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";

/* ════════════════════════════════════════════════════════════════════
   SERVIÇOS — giram em órbita 360° ao redor da frase E pulsam (frente/trás).
   👉 Para trocar as palavras, edite SOMENTE este array.
      pulseSpeed/phase = ritmo do "respiro" de cada uma.
   ════════════════════════════════════════════════════════════════════ */
const SERVICES = [
  { label: "Estratégia", pulseSpeed: 0.55, phase: 0.0 },
  { label: "Branding", pulseSpeed: 0.42, phase: 1.4 },
  { label: "Social Media", pulseSpeed: 0.6, phase: 2.6 },
  { label: "Mídia Paga", pulseSpeed: 0.48, phase: 3.7 },
  { label: "Dados", pulseSpeed: 0.52, phase: 4.6 },
  { label: "Inteligência Artificial", pulseSpeed: 0.46, phase: 5.3 },
  { label: "E-commerce", pulseSpeed: 0.58, phase: 0.9 },
  { label: "Direção", pulseSpeed: 0.5, phase: 2.2 },
];

const BG_URL =
  "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/fundo_hero.jpeg";

const toRad = (d) => (d * Math.PI) / 180;

/* Palavra que ORBITA (gira) e PULSA (respira em profundidade). Texto sempre legível. */
function OrbitPulseWord({
  item,
  base,
  a,
  b,
  tilt,
  spin,
  time,
  reduce,
  pulseAmp,
}) {
  const cosT = Math.cos(toRad(tilt));
  const sinT = Math.sin(toRad(tilt));

  const phi = useTransform(spin, (v) => toRad(base + v)); // rotação
  const x = useTransform(
    phi,
    (p) => a * Math.cos(p) * cosT - b * Math.sin(p) * sinT,
  );
  const y = useTransform(
    phi,
    (p) => a * Math.cos(p) * sinT + b * Math.sin(p) * cosT,
  );
  const od = useTransform(phi, (p) => Math.sin(p)); // profundidade pela posição na órbita
  const pulse = useTransform(time, (t: number) =>
    reduce ? 0 : Math.sin((t / 1000) * item.pulseSpeed + item.phase),
  );

  const scale = useTransform(
    [od, pulse],
    ([o, pu]: number[]) => (0.72 + ((o + 1) / 2) * 0.5) * (1 + pu * pulseAmp),
  );
  const opacity = useTransform([od, pulse], ([o, pu]: number[]) =>
    Math.max(0.16, Math.min(1, 0.4 + ((o + 1) / 2) * 0.56 + pu * 0.06)),
  );
  const filter = useTransform(
    od,
    (o) => `blur(${Math.max(0, -o * 1.8).toFixed(2)}px)`,
  );
  const zIndex = useTransform(od, (o) => (o > 0 ? 30 : 5));

  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        x,
        y,
        scale,
        opacity,
        filter,
        zIndex,
      }}
    >
      <span
        style={{
          display: "block",
          transform: "translate(-50%,-50%)",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(9.5px, 1.05vw, 16px)",
          letterSpacing: "0.02em",
          color: "var(--cream)",
          textShadow: "0 2px 18px rgba(0,0,0,0.85)",
        }}
      >
        {item.label}
      </span>
    </motion.div>
  );
}

/* Frase que se auto-ajusta a uma única linha dentro de uma largura-alvo */
function FitPhrase({ show, maxWidth }) {
  const wrapRef = useRef<any>(null);
  const elRef = useRef<any>(null);
  const [fs, setFs] = useState(64);

  useLayoutEffect(() => {
    const wrap = wrapRef.current,
      el = elRef.current;
    if (!wrap || !el) return;
    const fit = () => {
      const prev = el.style.fontSize;
      el.style.fontSize = "100px";
      const natural = el.scrollWidth;
      el.style.fontSize = prev;
      if (!natural) return;
      setFs(Math.min(150, (100 * wrap.clientWidth * 0.97) / natural));
    };
    fit();
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(fit);
      ro.observe(wrap);
    }
    if (document.fonts?.ready) document.fonts.ready.then(fit);
    return () => ro?.disconnect();
  }, [maxWidth]);

  return (
    <div
      ref={wrapRef}
      style={{ width: `${maxWidth}px`, maxWidth: "94vw", textAlign: "center" }}
    >
      <motion.span
        ref={elRef}
        initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
        animate={show ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "inline-block",
          fontSize: `${fs}px`,
          whiteSpace: "nowrap",
          lineHeight: 1,
          fontFamily: "var(--font-serif)",
          fontWeight: 300,
          color: "var(--cream)",
          letterSpacing: "-0.015em",
          textShadow: "0 6px 40px rgba(0,0,0,0.7)",
        }}
      >
        A travessia{" "}
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}>
          começou
        </span>
      </motion.span>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const inView = useInView(heroRef, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();

  /* mede largura E altura do palco p/ a elipse caber e limpar a frase */
  const [dim, setDim] = useState({ w: 820, h: 560 });
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((e) => {
      const cr = e[0].contentRect;
      if (cr.width && cr.height) setDim({ w: cr.width, h: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w: W, h: H } = dim;
  const small = W < 460;
  const a = (small ? 0.4 : 0.46) * W; // semi-eixo horizontal
  const b = (small ? 0.46 : 0.42) * H; // semi-eixo vertical (mais cheio no mobile)
  const tilt = -10;
  const phraseW = Math.round((small ? 0.48 : 0.6) * W);
  const pulseAmp = small ? 0.07 : 0.12;

  const time = useTime();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const spin = useTransform([time, scrollYProgress], ([t, p]: number[]) =>
    reduce ? 0 : (t / 1000) * 11 + p * 90,
  );
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.05, reduce ? 1.05 : 1.16],
  );

  const n = SERVICES.length;

  return (
    <section
      ref={heroRef}
      className="hero-orbit"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "var(--espresso)",
      }}
    >
      {/* imagem de fundo (LCP) — next/image com priority = preload, avif/webp, cache longo */}
      <motion.div
        aria-hidden
        style={{ position: "absolute", inset: 0, scale: bgScale, zIndex: 0 }}
      >
        <Image
          src={BG_URL}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={70}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </motion.div>
      {/* scrim espresso */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(72% 60% at 50% 50%, rgba(31,8,7,0.24) 0%, rgba(31,8,7,0.58) 56%, rgba(20,6,6,0.85) 100%), linear-gradient(180deg, rgba(31,8,7,0.45) 0%, rgba(31,8,7,0.28) 40%, rgba(20,6,6,0.7) 100%)",
          zIndex: 1,
        }}
      />

      {/* CONTEÚDO — só a animação, centralizada */}
      <div
        className="hero-inner"
        style={{
          position: "relative",
          zIndex: 3,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding:
            "clamp(90px, 12vh, 120px) clamp(16px, 4vw, 48px) clamp(60px, 8vh, 90px)",
        }}
      >
        {/* PALCO — frase + palavras orbitando e pulsando */}
        <div
          ref={stageRef}
          className="hero-stage"
          style={{
            position: "relative",
            width: "min(92vw, 900px)",
            height: "min(72vh, 720px)",
          }}
        >
          {/* glow atrás da frase */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "62%",
              height: "38%",
              transform: "translate(-50%,-50%)",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(104,45,27,0.5) 0%, transparent 70%)",
              filter: "blur(40px)",
              zIndex: 2,
            }}
          />

          {/* PALAVRAS (orbitam + pulsam) */}
          {SERVICES.map((item, i) => (
            <OrbitPulseWord
              key={item.label}
              item={item}
              base={(360 / n) * i}
              a={a}
              b={b}
              tilt={tilt}
              spin={spin}
              time={time}
              reduce={reduce}
              pulseAmp={pulseAmp}
            />
          ))}

          {/* FRASE (núcleo) */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 20,
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(10px, 1.05vw, 13px)",
                fontWeight: 600,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                color: "rgba(243,235,226,0.62)",
                marginBottom: "clamp(12px, 1.6vw, 20px)",
                textShadow: "0 2px 14px rgba(0,0,0,0.7)",
              }}
            >
              Uma estratégia 360°
            </motion.p>
            <FitPhrase show={inView} maxWidth={phraseW} />
          </div>
        </div>
      </div>

      <style>{`
        /* Mobile: Hero mais compacto — menos espaço em cima/baixo e menos scroll */
        @media (max-width: 600px) {
          .hero-orbit { min-height: 86vh !important; }
          .hero-inner { min-height: 86vh !important; padding: 80px 16px 24px !important; }
          .hero-stage { height: 66vh !important; }
        }
      `}</style>
    </section>
  );
}
