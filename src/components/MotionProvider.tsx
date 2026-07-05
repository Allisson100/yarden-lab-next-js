"use client";
import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/* Carrega SÓ as features de animação do framer-motion (domAnimation, ~15KB),
   sem o sistema de "projection" (layout animations) que não usamos — corta
   ~100KB do bundle. Todos os componentes usam <m.*> (não <motion.*>). */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
