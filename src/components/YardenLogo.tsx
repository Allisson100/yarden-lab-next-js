"use client";
/**
 * YardenLogo — usa o PNG oficial da marca.
 * mode: 'light' (fundo escuro) | 'dark' (fundo claro)
 * size: 'sm' | 'md' | 'lg'
 */
export default function YardenLogo({ mode = 'light', size = 'md' }) {
  const heights = { sm: 28, md: 36, lg: 52 }
  const h = heights[size] ?? 36

  // No fundo claro (modo 'dark'), aplica um filtro para inverter para burgonha
  const filter = mode === 'dark'
    ? 'brightness(0) saturate(100%) invert(13%) sepia(40%) saturate(800%) hue-rotate(320deg) brightness(80%)'
    : 'none'

  return (
    <img
      src="/logos/logo-header.png"
      alt="Yarden Lab"
      style={{
        height: `${h}px`,
        width: 'auto',
        display: 'block',
        filter,
        objectFit: 'contain',
      }}
    />
  )
}
