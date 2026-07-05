"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/**
 * MediaReel — grade mista de fotos e vídeos.
 * Combina "Estética que converte e posiciona." + "Por dentro do laboratório."
 * Fotos: /public/carousel/foto-X.jpg
 * Vídeos: /public/videos/video-0X.mp4
 *
 * Layout:
 *   ┌────────────────┬──────────┐
 *   │  01 (feat 1×1) │    02    │
 *   │                ├──────────┤
 *   │                │    03    │
 *   ├────────┬───────┴───┬──────┤
 *   │   04   │    05     │  06  │
 *   └────────┴───────────┴──────┘
 */

/*
 * Layout — grade 3 colunas, 6 itens (2 vídeos + 4 fotos) com tamanhos variados.
 * Sequência embaralhada: vídeo, foto, foto, foto, foto, vídeo.
 *
 *  col:  1            2            3
 *  r1: [V01 ][P02 ─────────────]    ← vídeo vertical grande + foto larga
 *  r2: [tall][P03 ][P04 ]           ← vídeo cont. + 2 fotos
 *  r3: [P05 ──────────][V06 ]       ← foto larga + vídeo
 */

const MEDIA = [
  // ── Bloco 1 (linhas 1-3) ──
  // 0 — vídeo grande VERTICAL (1 col × 2 linhas)
  {
    id: "01",
    type: "video",
    src: "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/video-02.mp4",
    title: "Manifesto",
    category: "Manifesto",
    quote: "Yarden Lab.",
    description: "A primeira impressão que posiciona.",
  },
  // 1 — foto LARGA horizontal (2 cols)
  {
    id: "02",
    type: "photo",
    src: "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/foto-3.jpg",
    objPos: "center 50%",
    title: "Branding Editorial",
    category: "Branding",
    quote: "Sua marca, com método.",
    description: "Identidade construída com critério, nunca com fórmula.",
  },
  // 2 — foto quadrada
  {
    id: "03",
    type: "photo",
    src: "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/foto-6.jpg",
    objPos: "center 22%",
    title: "Posicionamento",
    category: "Posicionamento",
    quote: "A imagem que o mercado reconhece.",
    description: "Sua marca passa a ocupar um lugar com mais precisão.",
  },
  // 3 — foto quadrada
  {
    id: "04",
    type: "photo",
    src: "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/foto-1.jpg",
    objPos: "center 22%",
    title: "Autenticidade",
    category: "Autenticidade",
    quote: "O que é real, permanece.",
    description: "Percepção construída na verdade, não na aparência.",
  },
  // 4 — foto LARGA horizontal (2 cols)
  {
    id: "06",
    type: "photo",
    src: "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/foto-4.jpg",
    title: "Tecnologia",
    category: "Inteligência",
    quote: "Onde o dado vira direção.",
    description: "Dados e IA por trás de cada decisão.",
  },
  // 5 — vídeo quadrado
  {
    id: "05",
    type: "video",
    src: "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/video-01.mp4",
    title: "O Laboratório",
    objPos: "center 25%",
    category: "Método",
    quote: "Marca não se faz no improviso.",
    description: "Processo, método e resultado, no mesmo lugar.",
  },

  // ── Bloco 2 (linhas 4-6) — espelha o padrão ──
  // 6 — foto LARGA horizontal (2 cols)
  {
    id: "07",
    type: "photo",
    src: "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/foto-2.jpg",
    objPos: "center 25%", // ← ajuste aqui: menor % sobe o enquadramento, maior % desce
    title: "Presença Digital",
    category: "Conteúdo",
    quote: "Conteúdo que nasce de estratégia.",
    description: "Do conceito à captação, tudo conectado.",
  },
  // 7 — vídeo grande VERTICAL (1 col × 2 linhas, lado direito)
  {
    id: "08",
    type: "video",
    src: "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/video-03.mp4",
    title: "Teaser",
    category: "Estratégia",
    quote: "Não somos uma agência.",
    description: "A inteligência de marca que a sua empresa merece ter.",
  },
  // 8 — foto quadrada
  {
    id: "09",
    type: "photo",
    src: "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/foto-5.jpg",
    objPos: "center 22%",
    title: "Editorial",
    category: "Editorial",
    quote: "Identidade que se reconhece à distância.",
    description: "O padrão editorial das marcas que viram referência.",
  },
  // 9 — foto quadrada
  {
    id: "10",
    type: "photo",
    src: "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/foto-7.jpg",
    title: "Direção de Arte",
    category: "Direção de Arte",
    quote: "Cada frame, uma intenção.",
    description: "Composição pensada até o último detalhe.",
  },
  // 10 — foto LARGA horizontal (2 cols)
  {
    id: "11",
    type: "photo",
    src: "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/foto-8.jpg",
    title: "Narrativa Visual",
    category: "Storytelling",
    quote: "Sua história, bem contada.",
    description: "Imagens que constroem percepção de marca.",
  },
  // 11 — vídeo quadrado
  {
    id: "12",
    type: "video",
    src: "https://lipm23rsbosgzvrt.public.blob.vercel-storage.com/video-04.mp4",
    title: "A Virada",
    category: "Estética",
    quote: "Marca premium vai além da estética.",
    description: "Método, tecnologia e estética, como um só organismo. ",
  },
];

/* Posições na grade 3×6 — cada item ocupa um col/row span definido */
const GRID_POS = [
  // Bloco 1
  { col: "1 / 2", row: "1 / 3" }, // 0: V01 — vídeo vertical grande
  { col: "2 / 4", row: "1 / 2" }, // 1: P02 — foto larga (2 cols)
  { col: "2 / 3", row: "2 / 3" }, // 2: P03 — foto quadrada
  { col: "3 / 4", row: "2 / 3" }, // 3: P04 — foto quadrada
  { col: "2 / 4", row: "3 / 4" }, // 4: P05 — foto larga (2 cols) — agora à DIREITA
  { col: "1 / 2", row: "3 / 4" }, // 5: V06 — vídeo quadrado — agora à ESQUERDA
  // Bloco 2 (espelhado)
  { col: "1 / 3", row: "4 / 5" }, // 6: P07 — foto larga (2 cols)
  { col: "3 / 4", row: "4 / 6" }, // 7: V08 — vídeo vertical grande (direita)
  { col: "1 / 2", row: "5 / 6" }, // 8: P09 — foto quadrada
  { col: "2 / 3", row: "5 / 6" }, // 9: P10 — foto quadrada
  { col: "1 / 3", row: "6 / 7" }, // 10: P11 — foto larga (2 cols)
  { col: "3 / 4", row: "6 / 7" }, // 11: V12 — vídeo quadrado
];

// ── Ícone placeholder ─────────────────────────────────────────────────────────
function Placeholder({ isVideo, featured }) {
  const sz = featured ? 48 : 32;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #0c0204 0%, #160508 100%)",
      }}
    >
      <div style={{ marginBottom: 14, opacity: 0.18 }}>
        {isVideo ? (
          <svg
            width={sz}
            height={sz}
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(243,235,226,0.8)"
            strokeWidth="1.2"
            strokeLinecap="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="2" />
            <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5" />
          </svg>
        ) : (
          <svg
            width={sz}
            height={sz}
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(243,235,226,0.8)"
            strokeWidth="1.2"
            strokeLinecap="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
      </div>
      <span
        style={{
          color: "rgba(243,235,226,0.18)",
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontFamily: "var(--font-serif)",
          fontStyle: "normal",
        }}
      >
        {isVideo ? "Vídeo em breve" : "Foto em breve"}
      </span>
    </div>
  );
}

// ── Botão de controle ─────────────────────────────────────────────────────────
function Btn({ onClick, title, active, children }: any) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "5px 9px",
        display: "flex",
        alignItems: "center",
        color: active ? "var(--cream)" : "rgba(243,235,226,0.6)",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cream)")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = active
          ? "var(--cream)"
          : "rgba(243,235,226,0.6)")
      }
    >
      {children}
    </button>
  );
}

// ── Card unificado (foto ou vídeo) ────────────────────────────────────────────
function MediaCard({
  item,
  refCallback,
  paused,
  hasSound,
  featured,
  cardHeight,
  onTogglePlay,
  onToggleSound,
  onFullscreen,
  onOpen,
}: any) {
  const [hovered, setHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const isVideo = item.type === "video";

  // No Next (SSR + hidratação) a mídia pode terminar de carregar ANTES do React
  // anexar o onLoad/onLoadedData — então checamos no mount se ela já está pronta.
  const mediaRef = useRef<any>(null);
  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    if (isVideo) {
      if (el.readyState >= 2) setLoaded(true);
    } else if (el.complete && el.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [isVideo]);

  return (
    <div
      style={{
        position: "relative",
        height: cardHeight ?? "100%",
        background: "#090104",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Placeholder */}
      {(!loaded || hasError) && (
        <Placeholder isVideo={isVideo} featured={featured} />
      )}

      {/* ── Foto ── */}
      {!isVideo && !hasError && (
        <img
          ref={mediaRef}
          src={item.src}
          alt={item.title}
          loading="lazy"
          decoding="async"
          fetchPriority={featured ? "high" : "low"}
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: item.objPos || "center",
            transition: "transform 0.6s ease",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            opacity: loaded ? 1 : 0,
          }}
        />
      )}

      {/* ── Vídeo ── streaming (metadata) p/ não baixar o arquivo inteiro de cara ── */}
      {isVideo && !hasError && (
        <video
          ref={(el) => {
            mediaRef.current = el;
            if (typeof refCallback === "function") refCallback(el);
          }}
          src={item.src}
          loop
          muted
          playsInline
          preload="metadata"
          onError={() => setHasError(true)}
          onLoadedData={() => setLoaded(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            // objectPosition: "center center",
            objectPosition: item.objPos || "center",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s",
          }}
        />
      )}

      {/* Gradiente sobre a mídia */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to top, rgba(6,0,2,0.92) 0%, rgba(6,0,2,0.12) 55%, rgba(6,0,2,0.38) 100%)",
        }}
      />

      {/* Linha diagonal decorativa */}
      {/* <div
        style={{
          position: "absolute",
          top: 0,
          right: featured ? "38%" : "22%",
          width: "1px",
          height: "100%",
          background:
            "linear-gradient(to bottom, transparent, rgba(243, 235, 226,0.08), transparent)",
          pointerEvents: "none",
        }}
      /> */}

      {/* Topo: número + categoria */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 20,
          right: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "rgba(243, 235, 226,0.85)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.3em",
            fontFamily: "var(--font-serif)",
          }}
        >
          {item.id}
        </span>
        <span
          className="mr-cat"
          style={{
            color: "var(--cream)",
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            border: "1px solid rgba(243,235,226,0.45)",
            padding: "3px 8px",
          }}
        >
          {item.category}
        </span>
      </div>

      {/* Rodapé: título + quote + desc hover */}
      <div
        className="mr-cardtext"
        style={{
          position: "absolute",
          bottom: isVideo ? 40 : 22,
          left: 20,
          right: 20,
        }}
      >
        <motion.div
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ duration: 0.28 }}
        >
          {/* <p
            style={{
              color: "var(--cream)",
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "7px",
            }}
          >
            {item.title}
          </p> */}
          <p
            style={{
              color: "var(--cream)",
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "7px",
            }}
          >
            {item.quote}
          </p>
          <AnimatePresence>
            {hovered && (
              <motion.p
                key="desc"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  color: "rgba(243,235,226,0.42)",
                  fontSize: "12px",
                  lineHeight: 1.6,
                  marginTop: "8px",
                  fontWeight: 300,
                  maxWidth: "320px",
                }}
              >
                {item.description}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Controles (só para vídeos carregados) */}
      {isVideo && loaded && !hasError && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            padding: "2px 8px",
            background: "rgba(4,0,1,0.72)",
            backdropFilter: "blur(6px)",
            opacity: hovered ? 1 : 0.35,
            transition: "opacity 0.3s",
          }}
        >
          <Btn onClick={onTogglePlay} title={paused ? "Reproduzir" : "Pausar"}>
            {paused ? (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="6,3 20,12 6,21" />
              </svg>
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="5" y="3" width="4" height="18" />
                <rect x="15" y="3" width="4" height="18" />
              </svg>
            )}
          </Btn>
          <Btn
            onClick={onToggleSound}
            title={hasSound ? "Silenciar" : "Ativar som"}
            active={hasSound}
          >
            {hasSound ? (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </Btn>
          <div style={{ flex: 1 }} />
          <Btn onClick={onFullscreen} title="Tela cheia">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          </Btn>
        </div>
      )}
    </div>
  );
}

// ── Lightbox — tela cheia ao clicar em foto/vídeo ─────────────────────────────
function Lightbox({ items, initialIdx, onClose }) {
  const [idx, setIdx] = useState(initialIdx);
  const videoRef = useRef<any>(null);
  const item = items[idx];

  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (item.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [idx]);

  const goNativeFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    (
      v.requestFullscreen ||
      v.webkitRequestFullscreen ||
      v.webkitEnterFullscreen ||
      (() => {})
    ).call(v);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4000,
        background: "rgba(9,1,4,0.97)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "100vw",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            {item.type === "photo" ? (
              <img
                src={item.src}
                alt={item.title}
                style={{
                  maxWidth: "94vw",
                  maxHeight: "86vh",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              <video
                ref={videoRef}
                src={item.src}
                controls
                autoPlay
                playsInline
                style={{
                  maxWidth: "94vw",
                  maxHeight: "86vh",
                  display: "block",
                  background: "#000",
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Barra inferior */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "12px 2px 0",
            gap: "16px",
          }}
        >
          <span
            style={{
              color: "rgba(243,235,226,0.4)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {item.title}
          </span>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "rgba(243,235,226,0.25)", fontSize: "10px" }}>
              {idx + 1} / {items.length}
            </span>
            {item.type === "video" && (
              <button
                onClick={goNativeFullscreen}
                style={{
                  background: "none",
                  border: "1px solid rgba(243,235,226,0.2)",
                  color: "rgba(243,235,226,0.5)",
                  padding: "5px 12px",
                  cursor: "pointer",
                  fontSize: "9px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Tela cheia
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Setas */}
      {[
        { dir: "prev", pos: "left", action: prev },
        { dir: "next", pos: "right", action: next },
      ].map(({ dir, pos, action }) => (
        <button
          key={dir}
          onClick={(e) => {
            e.stopPropagation();
            action();
          }}
          style={{
            position: "fixed",
            [pos]: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(9,1,4,0.65)",
            border: "1px solid rgba(243,235,226,0.1)",
            color: "rgba(243,235,226,0.65)",
            width: 46,
            height: 46,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {dir === "prev" ? (
              <path d="M15 18l-6-6 6-6" />
            ) : (
              <path d="M9 18l6-6-6-6" />
            )}
          </svg>
        </button>
      ))}

      {/* Fechar */}
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          background: "rgba(9,1,4,0.65)",
          border: "1px solid rgba(243,235,226,0.12)",
          color: "rgba(243,235,226,0.65)",
          width: 42,
          height: 42,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}

// ── Seção principal ───────────────────────────────────────────────────────────
export default function MediaReel() {
  const sectionRef = useRef<any>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const domRefs = useRef<any[]>([]);

  const setRef = (idx) => (el) => {
    domRefs.current[idx] = el;
  };

  // apenas os índices de vídeo precisam de estado de play
  const videoIndices = MEDIA.map((m, i) =>
    m.type === "video" ? i : -1,
  ).filter((i) => i >= 0);

  const [paused, setPaused] = useState(MEDIA.map(() => false));
  const [soundIdx, setSoundIdx] = useState(null);
  const [lightbox, setLightbox] = useState(null); // idx aberto no lightbox | null

  // Toca os vídeos quando a seção entra na tela (eles já carregaram com a página)
  useEffect(() => {
    if (!inView) return;
    videoIndices.forEach((i) => {
      const v = domRefs.current[i];
      if (v) v.play().catch(() => {});
    });
  }, [inView]);

  // Som: só um vídeo tem áudio por vez (os demais ficam mudos)
  useEffect(() => {
    videoIndices.forEach((i) => {
      const v = domRefs.current[i];
      if (v) v.muted = i !== soundIdx;
    });
  }, [soundIdx]);

  const togglePlay = useCallback((idx) => {
    const v = domRefs.current[idx];
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused((p) => p.map((x, i) => (i === idx ? false : x)));
    } else {
      v.pause();
      setPaused((p) => p.map((x, i) => (i === idx ? true : x)));
    }
  }, []);

  const toggleSound = useCallback(
    (idx) => setSoundIdx((prev) => (prev === idx ? null : idx)),
    [],
  );
  const goFullscreen = useCallback((idx) => {
    const v = domRefs.current[idx];
    if (!v) return;
    (v.requestFullscreen || v.webkitRequestFullscreen || (() => {})).call(v);
  }, []);

  const cardProps = (idx, extra = {}) => {
    const item = MEDIA[idx];
    return {
      item,
      refCallback: item.type === "video" ? setRef(idx) : undefined,
      paused: paused[idx],
      hasSound: soundIdx === idx,
      onTogglePlay: () => togglePlay(idx),
      onToggleSound: () => toggleSound(idx),
      onFullscreen: () => goFullscreen(idx),
      onOpen: () => setLightbox(idx),
      ...extra,
    };
  };

  return (
    <section
      id="portfolio"
      style={{
        background: "var(--cream)",
        padding: "clamp(44px, 6vw, 80px) 0 clamp(34px, 4vw, 52px)",
        position: "relative",
      }}
      ref={sectionRef}
    >
      {/* Linha superior decorativa */}
      {/* <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(243, 235, 226,0.25), transparent)",
        }}
      /> */}

      <div className="container">
        {/* ── Header ────────────────────────────────────────────── */}
        <motion.div
          className="mr-header"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            marginBottom: "56px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "32px",
          }}
        >
          <div>
            <p className="section-label" style={{ color: "var(--espresso)" }}>
              Nossa Produção
            </p>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 300,
                fontSize: "clamp(18px,4.8vw,54px)",
                lineHeight: 1.05,
                color: "var(--espresso)",
                whiteSpace: "nowrap",
              }}
            >
              Estética que converte{" "}
              <em style={{ fontStyle: "normal" }}>e posiciona.</em>
            </h2>
          </div>
        </motion.div>
      </div>

      {/* ── Grid (fora do container: full-bleed no mobile) ───────── */}
      <div className="mr-grid-wrap">
        <div className="mr-grid">
          {MEDIA.map((item, idx) => (
            <motion.div
              key={item.id}
              className="mr-cell"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + idx * 0.08 }}
              style={{
                gridColumn: GRID_POS[idx].col,
                gridRow: GRID_POS[idx].row,
              }}
            >
              <MediaCard {...cardProps(idx, { featured: idx === 0 })} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox — tela cheia */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            items={MEDIA}
            initialIdx={lightbox}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>

      {/* Linha inferior decorativa */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(243, 235, 226,0.12), transparent)",
        }}
      />

      <style>{`
        /* Wrapper do grid: alinhado ao container no desktop, full-bleed no mobile */
        .mr-grid-wrap {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 60px;
        }
        @media (max-width: 1024px) { .mr-grid-wrap { padding: 0 40px; } }
        @media (max-width: 768px)  { .mr-grid-wrap { padding: 0; } }  /* sem padding lateral no mobile */

        .mr-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-auto-rows: 290px;   /* altura base de cada linha; vídeo grande = 2× */
          gap: 2px;
        }
        .mr-cell { min-height: 0; min-width: 0; }
        .mr-cell > * { height: 100%; }

        /* Tablet/mobile: mantém o MESMO grid 3 colunas, só reduz a altura das linhas */
        @media (max-width: 900px) {
          .mr-grid { grid-auto-rows: 200px; }
        }
        @media (max-width: 600px) {
          .mr-grid { grid-auto-rows: 150px; gap: 1.5px; }
        }
        @media (max-width: 400px) {
          .mr-grid { grid-auto-rows: 124px; }
        }

        /* Mobile: células pequenas — esconde textos sobrepostos (ficavam
           ilegíveis/confusos). Mantém só o número e os controles do vídeo;
           o conteúdo completo aparece ao tocar (lightbox). */
        @media (max-width: 600px) {
          .mr-cat { display: none !important; }
          .mr-cardtext { display: none !important; }
        }

        /* Mobile: espaço enxuto (igual ao desktop) entre o título e o grid */
        @media (max-width: 600px) {
          #portfolio { padding-top: 22px !important; }
          .mr-header { margin-bottom: 20px !important; }
        }
      `}</style>
    </section>
  );
}
