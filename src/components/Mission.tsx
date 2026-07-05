"use client";
import { useRef, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";

/* Seção logo abaixo do Hero — o manifesto/missão, com respiro próprio.
   Texto centralizado e justificado. */
export default function Mission() {
  const ref = useRef<any>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const bodyStyle: CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize: "clamp(15px, 1.5vw, 19px)",
    lineHeight: 1.85,
    fontWeight: 300,
    color: "rgba(243,235,226,0.82)",
    textAlign: "justify",
    textJustify: "inter-word",
    margin: 0,
  };

  return (
    <section
      style={{
        background: "var(--espresso)",
        padding: "clamp(44px, 7vh, 84px) 0",
      }}
    >
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(18px, 2.2vw, 26px)",
          }}
        >
          <p style={bodyStyle}>
            Esqueça o conceito tradicional de agência. Entramos como parte do
            seu próprio time, funcionando na prática como o seu departamento de
            marca, imersos nos seus objetivos de negócio e moldando o nosso
            método ao jeito que a sua empresa já opera.
          </p>
          <p style={bodyStyle}>
            De um lado, estratégia guiada por inteligência artificial e análise
            de dados para orientar cada decisão; do outro, um trabalho de marca
            que deixa a sua empresa forte e bem posicionada no mercado.
          </p>
          <p style={bodyStyle}>
            No fim, o que nos move é simples: dar à sua marca o valor que ela
            merece e trazer mais clientes qualificados para perto.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
