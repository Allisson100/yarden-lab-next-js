"use client";
import { useEffect, useRef } from 'react'
import IntroBanner from './IntroBanner'

/**
 * IntroHero — tela de abertura (splash) da v3.
 *
 * Fica FIXA no fundo (z-index 0). O site real desliza por cima ao rolar
 * (ver App.jsx — container .site-shell com margin-top: 100vh).
 *
 * - Navbar espresso, só com o símbolo (intro-symbol.png)
 * - Fundo cream com o wordmark (intro-wordmark.png) centralizado
 * - Transição de filme: ao rolar, o wordmark CRESCE bem grande (voa pra
 *   frente) e some — recortado pelo overflow:hidden.
 * - Ao voltar ao topo, volta ao estado inicial automaticamente.
 *
 * O efeito é controlado por um listener de scroll (rAF-throttled) que aplica
 * o transform direto no DOM — sem depender de re-render do React.
 */
export default function IntroHero() {
  const rootRef  = useRef<any>(null)   // o splash fixo
  const stageRef = useRef<any>(null)   // container central que cresce
  const hintRef  = useRef<any>(null)   // dica "scroll"

  useEffect(() => {
    // Aplica direto no handler (sem rAF) — o transform é barato e assim o
    // efeito acompanha o scroll em qualquer ambiente/dispositivo, sem depender
    // do requestAnimationFrame (que o navegador pausa em abas não visíveis).
    const apply = () => {
      const vh = window.innerHeight || 800
      const y  = window.scrollY
      const p  = Math.min(Math.max(y / vh, 0), 1)         // 0 → 1 na 1ª tela

      // cresce de 1 até 7×; fade na segunda metade
      const scale = 1 + p * 6
      const fade  = p <= 0.25 ? 1 : Math.max(0, 1 - (p - 0.25) / 0.65)
      const hint  = Math.max(0, 1 - p / 0.18)

      if (stageRef.current) {
        stageRef.current.style.transform = `scale(${scale})`
        stageRef.current.style.opacity   = String(fade)
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(hint)
      }
    }

    // Fixa a largura do splash igual à do conteúdo (clientWidth, SEM a scrollbar).
    // Evita que o intro (fixed, largura = viewport) vaze como uma linha na direita
    // atrás do site quando a scrollbar reserva espaço.
    const syncWidth = () => {
      if (rootRef.current) {
        rootRef.current.style.width = document.documentElement.clientWidth + 'px'
      }
    }

    const onResize = () => { apply(); syncWidth() }

    apply()      // estado inicial
    syncWidth()
    window.addEventListener('scroll', apply, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', apply)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      style={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        width: '100%',
        zIndex: 0,
        background: 'var(--cream)',
        overflow: 'hidden',
      }}
    >
      {/* ── Navbar espresso (só o símbolo) ── */}
      <div
        className="intro-navbar"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '72px',
          background: 'var(--espresso)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 60px',
          zIndex: 2,
        }}
      >
        <img
          src="/logos/intro-symbol.png"
          alt="Yarden Lab"
          style={{ height: '40px', width: 'auto', display: 'block' }}
        />
      </div>

      {/* ── Conteúdo central: wordmark (cresce no scroll) ── */}
      <div
        ref={stageRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 32px',
          transformOrigin: 'center center',
        }}
      >
        <IntroBanner
          className="intro-wordmark"
          style={{ width: 'min(480px, 78vw)', display: 'block' }}
        />
      </div>

      {/* ── Dica de scroll ── */}
      <div
        ref={hintRef}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--sienna)',
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600, textAlign: 'center' }}>
          Scroll para começar sua nova jornada
        </span>
        <div className="intro-hint-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      <style>{`
        .intro-wordmark {
          animation: introWordmarkIn 1.1s cubic-bezier(0.25,0.46,0.45,0.94) both;
        }
        /* fade puro (sem transform) — evita layer cacheado que borraria no zoom */
        @keyframes introWordmarkIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .intro-hint-arrow {
          animation: introHintBounce 1.8s ease-in-out infinite;
        }
        @keyframes introHintBounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(7px); }
        }
        @media (max-width: 768px) {
          .intro-navbar { padding: 0 20px !important; }
        }
      `}</style>
    </div>
  )
}
