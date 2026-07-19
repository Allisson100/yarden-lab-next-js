import type { CSSProperties } from "react";

/* Banner de abertura — TESTE: carregando o SVG direto de public/bannerInicialDois.svg
   via <img>. Se ficar borrado no zoom, voltamos para a versão INLINE (vetor
   embutido no HTML), que é a que redesenha nítido em qualquer escala. */
export default function IntroBanner({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/bannerInicialDois.svg"
      alt="Yarden Lab — Marketing strategy, Branding & AI"
      className={className}
      style={style}
    />
  );
}
