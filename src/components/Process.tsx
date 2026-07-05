"use client";
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'Imersão',
    subtitle: 'Entendemos a fundo',
    desc: 'Diagnóstico estratégico da sua marca, mercado e concorrentes. Identificamos gaps, oportunidades e o posicionamento ideal.',
    // duration: '1–2 semanas',
  },
  {
    num: '02',
    title: 'Arquitetura',
    subtitle: 'Construímos o plano',
    desc: 'Plano de marca completo, calendário editorial, diretrizes criativas e mapa de canais com investimento recomendado.',
    // duration: '1–2 semanas',
  },
  {
    num: '03',
    title: 'Execução',
    subtitle: 'Operamos com método',
    desc: 'Captação, produção de conteúdo, gestão de canais, automações com IA e gestão de tráfego tudo integrado.',
    // duration: 'Contínuo',
  },
  {
    num: '04',
    title: 'Inteligência',
    subtitle: 'Aprendemos e evoluímos',
    desc: 'Análise de dados mensal, relatórios com IA, ajuste de estratégia e evolução contínua das ferramentas e processos.',
    // duration: 'Mensal',
  },
]

// Rio (desktop): meandro largo na faixa central, âncoras (34,18)(66,43)(34,68)(66,93)
const RIVER_DESKTOP =
  'M 50,7 C 50,13 34,14 34,18 C 34,30 66,31 66,43 C 66,55 34,56 34,68 C 34,80 66,81 66,93 C 66,98 56,101 52,104'

// Rio mobile: mesmo estilo (meandro central) mas mais estreito (40↔60),
// deixando mais espaço para o texto nas bordas.
const RIVER_MOBILE =
  'M 50,6 C 50,12 40,13 40,18 C 40,30 60,31 60,43 C 60,55 40,56 40,68 C 40,80 60,81 60,93 C 60,98 54,101 51,104'

// y (vertical) e lado de cada marco — o x é definido no CSS (varia por breakpoint)
const ANCHORS = [
  { y: '13%', side: 'left' },
  { y: '38%', side: 'right' },
  { y: '63%', side: 'left' },
  { y: '88%', side: 'right' },
]

function River({ d, kind, inView }) {
  return (
    <svg
      className={`river-svg ${kind}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', zIndex: 0, pointerEvents: 'none' }}
    >
      <path d={d} fill="none" stroke="#682D1B" strokeOpacity="0.1" strokeWidth="11" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <motion.path
        d={d}
        fill="none"
        stroke="#682D1B"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 3, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export default function Process() {
  const ref = useRef<any>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="method" style={{ background: 'var(--cream)', padding: 'clamp(44px, 6vw, 80px) 0 clamp(48px, 6vw, 88px)', overflow: 'hidden' }}>
      <div className="container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '40px' }}
        >
          <p className="section-label" style={{ color: 'var(--sienna)' }}>
            Como Trabalhamos
          </p>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: 'clamp(19px, 5vw, 56px)',
            lineHeight: 1.05,
            color: 'var(--espresso)',
            whiteSpace: 'nowrap',
          }}>
            Método que gera
            <em style={{ fontStyle: 'normal' }}> resultado real.</em>
          </h2>
          {/* <p style={{ color: 'var(--sienna)', fontSize: '16px', fontStyle: 'normal', fontFamily: 'var(--font-serif)', marginTop: '16px', lineHeight: 1.5 }}>
            Como o rio Jordão, nosso método tem um curso — da nascente à foz.
          </p> */}
        </motion.div>

        {/* ── Curso do rio: os marcos seguem o traçado serpenteando ── */}
        <div className="river-flow">
          <River d={RIVER_DESKTOP} kind="desktop" inView={inView} />
          <River d={RIVER_MOBILE}  kind="mobile"  inView={inView} />

          {steps.map((step, i) => {
            const a = ANCHORS[i]
            const isLeft = a.side === 'left'
            return (
              <motion.div
                key={step.num}
                className={`river-step ${isLeft ? 'is-left' : 'is-right'}`}
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.4 }}
                style={{ '--y': a.y } as any}
              >
                {/* Bolha numerada — fica sobre o rio */}
                <div className="river-bubble">
                  <div className="river-bubble-box" style={{
                    width: '72px', height: '72px',
                    border: '1px solid var(--sienna)',
                    background: 'var(--cream)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', inset: '6px', background: i === 0 ? 'var(--espresso)' : 'transparent' }} />
                    <span style={{
                      fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 300,
                      color: i === 0 ? 'var(--cream)' : 'var(--espresso)', position: 'relative', zIndex: 1,
                    }}>
                      {step.num}
                    </span>
                  </div>
                </div>

                {/* Conteúdo no lado de FORA da bolha (longe do rio) */}
                <div className="river-text">
                  <div className="river-sub" style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sienna)', marginBottom: '12px', fontWeight: 600 }}>
                    {step.subtitle}
                  </div>
                  <h3 className="river-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--espresso)', marginBottom: '16px', lineHeight: 1.1 }}>
                    {step.title}
                  </h3>
                  <p className="river-desc" style={{ color: 'rgba(54,15,17,0.65)', fontSize: 'clamp(15px, 1.5vw, 18px)', lineHeight: 1.7, marginBottom: '18px', fontWeight: 300 }}>
                    {step.desc}
                  </p>
                  {/* <div className="river-duration" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: 'rgba(54,15,17,0.45)', fontSize: '12px', letterSpacing: '0.1em',
                  }}>
                    <span style={{ width: '16px', height: '1px', background: 'currentColor', display: 'inline-block' }} />
                    {step.duration}
                  </div> */}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        .river-flow {
          position: relative;
          height: clamp(820px, 68vw, 980px);
          margin-top: 24px;
        }
        .river-step {
          position: absolute;
          top: var(--y);
          left: 0; right: 0;
          height: 0;
          z-index: 1;
        }
        .river-bubble {
          position: absolute;
          top: 0;
          transform: translate(-50%, -50%);
        }
        .river-text {
          position: absolute;
          top: 0;
          transform: translateY(-50%);
          width: min(400px, 30%);
        }
        .river-duration { flex-direction: row; }

        /* Desktop/tablet: meandro largo na faixa central, texto nas bordas */
        .is-left  .river-bubble { left: 34%; }
        .is-right .river-bubble { left: 66%; }
        .is-left  .river-text { right: calc(66% + 60px); text-align: right; }
        .is-right .river-text { left:  calc(66% + 60px); text-align: left; }
        .is-left  .river-duration { flex-direction: row-reverse; }

        .river-svg.desktop { display: block; }
        .river-svg.mobile  { display: none; }

        /* ── Tablet: mesmo meandro do desktop (intercalado), texto mais estreito ── */
        @media (max-width: 1024px) {
          .river-text { width: min(300px, 32%); }
        }

        /* ── Phone: MESMO esquema do desktop (meandro central + texto nas bordas),
              só com rio mais estreito (40↔60), bolha e fontes menores ── */
        @media (max-width: 600px) {
          #method { padding-bottom: 18px !important; }
          .river-flow { height: clamp(860px, 235vw, 1150px); margin-top: 12px; }

          .river-svg.desktop { display: none; }
          .river-svg.mobile  { display: block; }

          .is-left  .river-bubble { left: 40%; }
          .is-right .river-bubble { left: 60%; }

          .river-bubble-box { width: 50px !important; height: 50px !important; }
          .river-bubble-box span { font-size: 17px !important; }

          .river-text { width: 30% !important; }
          .is-left  .river-text { right: calc(60% + 34px) !important; left: auto !important; text-align: right !important; }
          .is-right .river-text { left:  calc(60% + 34px) !important; right: auto !important; text-align: left !important; }

          .river-sub   { font-size: 9px !important; letter-spacing: 0.16em !important; margin-bottom: 6px !important; }
          .river-title { font-size: 18px !important; margin-bottom: 8px !important; }
          .river-desc  { font-size: 12px !important; line-height: 1.5 !important; margin-bottom: 8px !important; }
          .river-duration { font-size: 10px !important; }
        }
      `}</style>
    </section>
  )
}
