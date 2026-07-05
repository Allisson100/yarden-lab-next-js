"use client";
import { useRef, useState, useEffect } from "react";
import { m, useInView } from "framer-motion";

const WA = "5511936239317";
const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

/* ── 3 caminhos ──────────────────────────────────────────────────────
   category casa com PLAN_CATEGORIES do AISection (Entrada/Projetos/Recorrente),
   então o botão "Ver detalhes do plano" da IA destaca o card certo. */
// const CARDS = [
//   {
//     num: '01', kicker: 'Comece aqui', category: 'Entrada',
//     name: 'Diagnóstico',
//     desc: 'Para entender onde sua marca está antes do próximo passo.',
//     tags: ['Diagnóstico Yarden'],
//     features: ['Posicionamento + manifesto', 'Tom de voz e diretrizes', 'Entrega em 1 semana'],
//     cta: 'Ver Diagnóstico',
//     wa: 'Olá! Vim pelo site da Yarden Lab e quero começar pelo Diagnóstico.',
//     featured: false,
//   },
//   {
//     num: '02', kicker: 'Projetos', category: 'Projetos',
//     name: 'Projetos com prazo',
//     desc: 'Para um trabalho com começo, meio e fim definidos.',
//     tags: ['Plano Travessia', 'Sprint de Captação', 'Sprint Inteligência'],
//     features: ['Estratégia ou produção em volume', 'Escopo e entrega fechados', 'Ideal pra lançamento ou virada'],
//     cta: 'Ver Projetos',
//     wa: 'Olá! Vim pelo site da Yarden Lab e quero saber mais sobre os Projetos com prazo.',
//     featured: false,
//   },
//   {
//     num: '03', kicker: 'Operação', category: 'Recorrente',
//     name: 'A Yarden rodando',
//     desc: 'Para ter a Yarden cuidando da sua marca todo mês.',
//     tags: ['Corrente Light', 'Corrente Standard', 'Yarden 360'],
//     features: ['Conteúdo + gestão mensal', 'Tráfego pago e relatórios', 'Operação contínua com IA'],
//     cta: 'Ver Operação',
//     wa: 'Olá! Vim pelo site da Yarden Lab e quero a Yarden cuidando da minha marca todo mês.',
//     featured: true,
//   },
// ]

const CARDS = [
  {
    num: "01",
    kicker: "Comece aqui",
    category: "Entrada",
    name: "Diagnóstico",
    desc: "Antes de produzir qualquer coisa, sua marca precisa saber o que é. Você sai com posicionamento, tom de voz e direção.",
    tags: ["Diagnóstico Yarden"],
    features: [
      "Imersão estratégica com a fundadora",
      "Posicionamento e manifesto de marca",
      "Tom de voz e pilares de comunicação",
      "Diretrizes visuais (paleta, tipografia, mood)",
      "Documento estratégico de entrega",
      "Análise da comunicação atual com IA",
    ],
    cta: "Quero meu diagnóstico",
    wa: "Olá! Vim pelo site da Yarden Lab e quero começar pelo Diagnóstico.",
    featured: false,
  },
  {
    num: "02",
    kicker: "Projetos",
    category: "Projetos",
    name: "Projetos com prazo",
    desc: "Pra um momento que pede ação concentrada: estruturar a marca, desenvolver o calendário com conteúdo premium ou colocar IA pra rodar na operação. Escopo fechado, com começo, meio e fim.",
    tags: ["Plano Travessia", "Sprint de Captação", "Sprint Inteligência"],
    features: [
      "Plano de marca completo + execução real",
      "Captação intensiva de conteúdo premium",
      "IA, automações e integrações na operação",
      "Calendário editorial e funil mapeados",
      "Direção criativa e diretrizes de marca",
      "Escopo definido e entrega organizada",
    ],
    cta: "Ver Projetos",
    wa: "Olá! Vim pelo site da Yarden Lab e quero saber mais sobre os Projetos com prazo.",
    featured: false,
  },
  {
    num: "03",
    kicker: "Operação",
    category: "Recorrente",
    name: "A Yarden rodando",
    desc: "Pra quem quer parar de apagar incêndio e ter a Yarden como inteligência de marca fixa: conteúdo, tráfego, dados e direção criativa rodando todo mês, sob um só método.",
    tags: ["Corrente Light", "Corrente Standard", "Yarden 360"],
    features: [
      "Feed + reels mensais com direção criativa",
      "Stories direcionados e curadoria editorial",
      "Captação de conteúdo mensal inclusa",
      "Gestão de tráfego pago (Standard e 360)",
      "Dashboard e análise de dados com IA",
      "Inteligência de mercado e automações (360)",
    ],
    cta: "Ver Operação",
    wa: "Olá! Vim pelo site da Yarden Lab e quero a Yarden cuidando da minha marca todo mês.",
    featured: true,
  },
];

const Check = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--sienna)"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: "2px" }}
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/* ── Card ────────────────────────────────────────────────────────────── */
function PlanCard({ card, index, inView, highlighted }) {
  const feat = card.featured;
  return (
    <m.div
      id={`plan-card-${card.category.toLowerCase()}`}
      className="plan3-card"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: Math.min(index * 0.12, 0.4) }}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateRows: "subgrid",
        gridRow: "span 6",
        background: "#fff",
        borderRadius: "18px",
        border: feat
          ? "2px solid var(--espresso)"
          : "1px solid rgba(54,15,17,0.08)",
        padding: "clamp(28px,3vw,40px) clamp(24px,2.6vw,34px)",
        boxShadow: highlighted
          ? "0 0 0 3px var(--sienna), 0 16px 50px rgba(104,45,27,0.22)"
          : feat
            ? "0 14px 44px rgba(54,15,17,0.10)"
            : "0 6px 26px rgba(54,15,17,0.05)",
        transition: "box-shadow 0.5s ease",
      }}
    >
      {/* Selo "Mais Escolhido" */}
      {feat && (
        <span
          style={{
            position: "absolute",
            top: "-13px",
            left: "28px",
            background: "var(--espresso)",
            color: "var(--cream)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "6px 14px",
            borderRadius: "999px",
            whiteSpace: "nowrap",
          }}
        >
          Mais Escolhido
        </span>
      )}

      {/* Kicker */}
      <p
        style={{
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--sienna)",
          marginBottom: "16px",
        }}
      >
        {card.num} · {card.kicker}
      </p>

      {/* Nome */}
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontStyle: "normal",
          fontSize: "clamp(26px,2.4vw,32px)",
          color: "var(--espresso)",
          lineHeight: 1.1,
          marginBottom: "14px",
        }}
      >
        {card.name}
      </h3>

      {/* Descrição */}
      <p
        style={{
          color: "rgba(54,15,17,0.72)",
          fontSize: "16px",
          lineHeight: 1.5,
          marginBottom: "22px",
          fontWeight: 400,
        }}
      >
        {card.desc}
      </p>

      {/* Tags */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "9px",
          marginBottom: "26px",
          alignSelf: "start",
          alignItems: "flex-start",
          alignContent: "flex-start",
        }}
      >
        {card.tags.map((t) => (
          <span
            key={t}
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "rgba(104,45,27,0.09)",
              color: "var(--sienna)",
              fontSize: "13px",
              fontWeight: 600,
              lineHeight: 1,
              whiteSpace: "nowrap",
              padding: "8px 15px",
              borderRadius: "999px",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Features */}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          marginBottom: "30px",
        }}
      >
        {card.features.map((f) => (
          <li
            key={f}
            style={{
              display: "flex",
              gap: "11px",
              marginBottom: "13px",
              color: "rgba(54,15,17,0.86)",
              fontSize: "16px",
              lineHeight: 1.4,
            }}
          >
            <Check />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA — empurrado para a base p/ alinhar entre os cards */}
      <a
        href={waLink(card.wa)}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          textAlign: "center",
          padding: "17px 24px",
          borderRadius: "8px",
          background: "var(--espresso)",
          color: "var(--cream)",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          textDecoration: "none",
          transition: "background 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--sienna)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--espresso)")
        }
      >
        {card.cta}
      </a>
    </m.div>
  );
}

/* ── Seção ──────────────────────────────────────────────────────────── */
export default function PlansSection() {
  const ref = useRef<any>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [highlighted, setHighlighted] = useState(null);

  /* Deeplink da IA: rola até o card da categoria recomendada e o destaca */
  useEffect(() => {
    const handler = (e) => {
      const slug = (e.detail?.category || "").toLowerCase();
      if (!slug) return;
      document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        setHighlighted(slug);
        document
          .getElementById(`plan-card-${slug}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => setHighlighted(null), 2600);
      }, 550);
    };
    window.addEventListener("openPricingPlan", handler);
    return () => window.removeEventListener("openPricingPlan", handler);
  }, []);

  return (
    <section
      id="plans"
      style={{
        background: "var(--cream)",
        padding: "clamp(44px, 6vw, 84px) 0 clamp(40px, 5vw, 70px)",
      }}
    >
      <div className="container" ref={ref}>
        {/* Cabeçalho */}
        <m.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
          style={{ marginBottom: "clamp(40px,5vw,64px)", maxWidth: "720px" }}
        >
          <p className="section-label" style={{ color: "var(--sienna)" }}>
            Nossas Soluções
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontStyle: "normal",
              fontSize: "clamp(21px,5.6vw,58px)",
              lineHeight: 1.05,
              color: "var(--espresso)",
              marginBottom: "18px",
              whiteSpace: "nowrap",
            }}
          >
            Escolha por onde começar.
          </h2>
          <p
            style={{
              color: "rgba(54,15,17,0.6)",
              fontSize: "clamp(15px,1.5vw,18px)",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            3 caminhos. Comece pelo ponto certo para o momento da sua marca.
          </p>
        </m.div>

        {/* Grade de 3 cards — subgrid p/ alinhar descrição, tags, checklist e botão */}
        <div
          className="plans3-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(6, auto)",
            columnGap: "clamp(16px,2vw,28px)",
            rowGap: 0,
            alignItems: "stretch",
          }}
        >
          {CARDS.map((card, i) => (
            <PlanCard
              key={card.name}
              card={card}
              index={i}
              inView={inView}
              highlighted={highlighted === card.category.toLowerCase()}
            />
          ))}
        </div>
      </div>

      <style>{`
        /* Mobile: empilha em coluna (sem subgrid — alinhamento entre colunas não se aplica) */
        @media (max-width: 860px) {
          .plans3-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .plan3-card {
            display: flex !important;
            flex-direction: column !important;
            grid-row: auto !important;
            grid-template-rows: none !important;
          }
        }
      `}</style>
    </section>
  );
}
