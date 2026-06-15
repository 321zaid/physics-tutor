"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function BgDiagram() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(245,245,240,0.03)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <line x1="100" y1="400" x2="1100" y2="400" stroke="rgba(199,255,61,0.04)" strokeWidth="1" />
      <polygon points="1095,395 1110,400 1095,405" fill="rgba(199,255,61,0.06)" />
      <line x1="600" y1="50" x2="600" y2="750" stroke="rgba(199,255,61,0.04)" strokeWidth="1" />
      <polygon points="595,55 600,40 605,55" fill="rgba(199,255,61,0.06)" />
      <line x1="350" y1="500" x2="650" y2="300" stroke="rgba(245,245,240,0.04)" strokeWidth="1.5" strokeDasharray="6 4" />
      <polygon points="645,305 660,290 650,315" fill="rgba(245,245,240,0.06)" />
      <path d="M 200 600 Q 350 500 500 600 T 800 600" fill="none" stroke="rgba(199,255,61,0.03)" strokeWidth="1" />
      <line x1="400" y1="560" x2="600" y2="520" stroke="rgba(245,245,240,0.025)" strokeWidth="0.8" />
    </svg>
  )
}

function EquationsLayer() {
  return (
    <div className="absolute inset-0 z-[2] pointer-events-none select-none flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-6xl mx-auto px-10">
        {/* Scattered equation fragments */}
        <span className="absolute text-[clamp(0.6rem,1.2vw,1rem)] text-text-primary/5 font-mono italic" style={{ top: "12%", left: "8%" }}>F = ma</span>
        <span className="absolute text-[clamp(0.5rem,1vw,0.85rem)] text-text-primary/5 font-mono italic" style={{ top: "18%", right: "12%" }}>E = mc²</span>
        <span className="absolute text-[clamp(0.5rem,1vw,0.85rem)] text-text-primary/4 font-mono italic" style={{ top: "28%", left: "5%" }}>∇ × E = −∂B/∂t</span>
        <span className="absolute text-[clamp(0.5rem,0.9vw,0.75rem)] text-text-primary/4 font-mono italic" style={{ top: "45%", right: "8%" }}>F = G(m₁m₂)/r²</span>
        <span className="absolute text-[clamp(0.5rem,1vw,0.85rem)] text-text-primary/5 font-mono italic" style={{ top: "55%", left: "10%" }}>v = fλ</span>
        <span className="absolute text-[clamp(0.4rem,0.8vw,0.7rem)] text-text-primary/3 font-mono italic" style={{ top: "65%", right: "15%" }}>Δp = FΔt</span>
        <span className="absolute text-[clamp(0.5rem,0.9vw,0.8rem)] text-text-primary/4 font-mono italic" style={{ top: "75%", left: "6%" }}>KE = ½mv²</span>
        <span className="absolute text-[clamp(0.4rem,0.8vw,0.7rem)] text-text-primary/3 font-mono italic" style={{ top: "82%", right: "6%" }}>W = Fd cos θ</span>
        <span className="absolute text-[clamp(0.4rem,0.8vw,0.7rem)] text-text-primary/3 font-mono italic" style={{ top: "35%", left: "20%" }}>∫ F · dr</span>
        <span className="absolute text-[clamp(0.4rem,0.8vw,0.7rem)] text-text-primary/3 font-mono italic" style={{ top: "60%", right: "20%" }}>∂ψ/∂t</span>
      </div>
    </div>
  )
}

export function ScrollScene() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const bgWordRef = useRef<HTMLHeadingElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const line3Ref = useRef<HTMLSpanElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)
  const gridOverlayRef = useRef<HTMLDivElement>(null)
  const equationsRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const media = mediaRef.current
    const bgWord = bgWordRef.current
    const diagram = diagramRef.current
    if (!section || !media || !bgWord || !diagram) return

    const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      if (line1Ref.current) gsap.set(line1Ref.current, { opacity: 1, y: 0, scale: 1 })
      if (line2Ref.current) gsap.set(line2Ref.current, { opacity: 1, y: 0, scale: 1 })
      if (line3Ref.current) gsap.set(line3Ref.current, { opacity: 1, y: 0, scale: 1 })
      return
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress

          // =============================================
          // BACKGROUND LAYERS — active throughout
          // =============================================

          // Media: slow drift, subtle breathing
          gsap.set(media, {
            scale: 0.95 + p * 0.1,
            y: -10 + p * 20,
            rotate: (p - 0.5) * 0.6,
          })

          // Grid overlay: slowly increases, then fades
          const gridOpacity = p < 0.8
            ? 0.02 + p * 0.05
            : Math.max(0, 0.06 - (p - 0.8) * 0.3)
          if (gridOverlayRef.current) {
            gsap.set(gridOverlayRef.current, {
              opacity: gridOpacity,
              y: -5 + p * 15,
            })
          }

          // Background word "FORCE": emerges, holds, then recedes
          const forceStart = 0
          const forcePeak = 0.50
          let wordOpacity = 0
          if (p < forcePeak) {
            wordOpacity = (p - forceStart) / (forcePeak - forceStart) * 0.08
          } else {
            wordOpacity = Math.max(0, 0.08 * (1 - (p - forcePeak) / (1 - forcePeak)))
          }
          gsap.set(bgWord, {
            opacity: wordOpacity,
            y: -25 + p * 50,
            scale: 0.92 + p * 0.16,
            rotateY: (p - 0.5) * 2,
            rotateX: (p - 0.5) * 1,
          })

          // Diagram: slow reveal, subtle breathing
          gsap.set(diagram, {
            opacity: 0.15 + p * 0.35 * (p < 0.7 ? 1 : Math.max(0, 1 - (p - 0.7) * 2)),
            y: -10 + p * 20,
            scale: 0.97 + p * 0.06,
          })

          // Equations: fade in slowly, stay visible
          if (equationsRef.current) {
            const eqOpacity = Math.min(p * 0.6, 0.3)
            gsap.set(equationsRef.current, { opacity: eqOpacity })
          }

          // =============================================
          // HEADLINE LINES — staggered scroll reveal
          // =============================================
          const lines: [HTMLSpanElement | null, number, number][] = [
            [line1Ref.current, 0.00, 0.20],
            [line2Ref.current, 0.15, 0.35],
            [line3Ref.current, 0.30, 0.55],
          ]
          lines.forEach(([el, start, end]) => {
            if (!el) return
            let opacity = 0
            let y = 12
            let scale = 0.98
            if (p >= start) {
              const t = Math.min(1, (p - start) / (end - start))
              opacity = t
              y = 12 - t * 12
              scale = 0.98 + t * 0.02
            }
            gsap.set(el, { opacity, y, scale })
          })

          // =============================================
          // SUBTLE PROGRESS INDICATOR
          // =============================================
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleX: p })
          }
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="scene"
      className="relative overflow-hidden bg-bg-solid"
      style={{ height: "130vh" }}
    >
      <div
        ref={pinRef}
        className="h-screen flex items-center justify-center overflow-hidden"
      >
        {/* ===== BACKGROUND MEDIA ===== */}
        <div
          ref={mediaRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: "linear-gradient(160deg, #0A0F1A 0%, #10141C 50%, #070A0F 100%)",
              filter: "grayscale(1) contrast(0.85)",
            }}
          />
          <div className="noise-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/70 z-[1]" />
          <div className="absolute inset-0 cinema-overlay z-[1]" />
        </div>

        {/* ===== GRID OVERLAY ===== */}
        <div
          ref={gridOverlayRef}
          className="absolute inset-0 z-[1] pointer-events-none opacity-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,245,240,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,240,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* ===== FLOATING EQUATIONS ===== */}
        <div ref={equationsRef} className="absolute inset-0 z-[2] opacity-0">
          <EquationsLayer />
        </div>

        {/* ===== FAINT DIAGRAM ===== */}
        <div ref={diagramRef} className="absolute inset-0 z-[3] opacity-15">
          <BgDiagram />
        </div>

        {/* ===== HUGE BACKGROUND WORD — 3D ===== */}
        <h2
          ref={bgWordRef}
          className="absolute inset-0 flex items-center justify-center z-[4] pointer-events-none select-none"
          style={{ opacity: 0, perspective: "1000px" }}
        >
          <span
            className="text-[20vw] sm:text-[18vw] md:text-[16vw] font-bold text-text-primary leading-none tracking-tight"
            style={{ transformStyle: "preserve-3d" }}
          >
            FORCE
          </span>
        </h2>

        {/* ===== PROGRESS BAR ===== */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] z-20 origin-left"
          style={{ transform: "scaleX(0)" }}
          ref={progressBarRef}
        >
          <div className="w-full h-full bg-gradient-to-r from-accent-lime/40 via-accent-lime/20 to-transparent" />
        </div>

        {/* ===== HEADLINE ===== */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center justify-center gap-4 md:gap-6 py-8">
            <span
              ref={line1Ref}
              className="block text-[clamp(1.5rem,4.5vw,4rem)] font-bold text-text-primary leading-[1.05] tracking-tight"
              style={{ opacity: 0, scale: 0.98, willChange: "transform, opacity" }}
            >
              UNDERSTAND
            </span>
            <span
              ref={line2Ref}
              className="block text-[clamp(1.5rem,4.5vw,4rem)] font-bold text-text-primary leading-[1.05] tracking-tight"
              style={{ opacity: 0, scale: 0.98, willChange: "transform, opacity" }}
            >
              THE FORCE
            </span>
            <span
              ref={line3Ref}
              className="block text-[clamp(1.5rem,4.5vw,4rem)] font-bold text-text-primary leading-[1.05] tracking-tight"
              style={{ opacity: 0, scale: 0.98, willChange: "transform, opacity" }}
            >
              BEHIND EVERY FORMULA
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
