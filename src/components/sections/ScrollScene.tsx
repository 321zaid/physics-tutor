"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const stages = [
  { text: "UNDERSTAND", start: 0.20, end: 0.35 },
  { text: "THE FORCE", start: 0.40, end: 0.55 },
  { text: "BEHIND", start: 0.60, end: 0.75 },
  { text: "EVERY FORMULA", start: 0.80, end: 0.95 },
]

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
  const stageRefs = useRef<(HTMLDivElement | null)[]>([])
  const stageTextRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const diagramRef = useRef<HTMLDivElement>(null)
  const gridOverlayRef = useRef<HTMLDivElement>(null)
  const equationsRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const completeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const media = mediaRef.current
    const bgWord = bgWordRef.current
    const diagram = diagramRef.current
    if (!section || !pin || !media || !bgWord || !diagram) return

    const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        pin: pin,
        pinSpacing: false,
        start: "top bottom",
        end: "+=300vh",
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress

          // =============================================
          // BACKGROUND LAYERS — active throughout
          // =============================================

          // Media: slow drift, subtle breathing
          gsap.set(media, {
            scale: 0.92 + p * 0.16,
            y: -20 + p * 40,
            rotate: (p - 0.5) * 0.8,
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
            y: -40 + p * 80,
            scale: 0.85 + p * 0.3,
            rotateY: (p - 0.5) * 4,
            rotateX: (p - 0.5) * 2,
          })

          // Diagram: slow reveal, subtle breathing
          gsap.set(diagram, {
            opacity: 0.15 + p * 0.35 * (p < 0.7 ? 1 : Math.max(0, 1 - (p - 0.7) * 2)),
            y: -15 + p * 30,
            scale: 0.95 + p * 0.1,
          })

          // Equations: fade in slowly, stay visible
          if (equationsRef.current) {
            const eqOpacity = Math.min(p * 0.6, 0.3)
            gsap.set(equationsRef.current, { opacity: eqOpacity })
          }

          // =============================================
          // STAGE REVEALS — each earns its moment
          // =============================================

          stageRefs.current.forEach((wrapper, i) => {
            if (!wrapper) return
            const s = stages[i]
            const inStart = s.start
            const inEnd = s.end
            const holdEnd = Math.min(inEnd + 0.12, 0.98)

            let opacity = 0
            let blurAmt = 10
            let scale = 1.08
            let yOff = 30

            if (p >= inStart && p < inEnd) {
              const t = (p - inStart) / (inEnd - inStart)
              const eased = 1 - Math.pow(1 - t, 3)
              opacity = eased
              blurAmt = 10 - eased * 10
              scale = 1.08 - eased * 0.08
              yOff = 30 - eased * 30
            } else if (p >= inEnd && p < holdEnd) {
              opacity = 1
              blurAmt = 0
              scale = 1
              yOff = 0
            } else if (p >= holdEnd) {
              const t = (p - holdEnd) / (1 - holdEnd)
              opacity = 1 - t * 0.3
              blurAmt = t * 3
              scale = 1 + t * 0.02
              yOff = -t * 10
            }

            gsap.set(wrapper, {
              opacity,
              filter: `blur(${blurAmt}px)`,
              scale,
              y: yOff,
            })
          })

          // =============================================
          // COMPLETE SENTENCE — visible at very end
          // =============================================
          if (completeRef.current) {
            const completeStart = 0.92
            let completeOpacity = 0
            let completeBlur = 8
            let completeScale = 1.06
            if (p >= completeStart) {
              const t = (p - completeStart) / (1 - completeStart)
              const eased = Math.min(1, t * 1.8)
              completeOpacity = eased * 0.7
              completeBlur = 8 - eased * 8
              completeScale = 1.06 - eased * 0.06
            }
            gsap.set(completeRef.current, {
              opacity: completeOpacity,
              filter: `blur(${completeBlur}px)`,
              scale: completeScale,
            })
          }

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
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
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

        {/* ===== STAGE TEXT OVERLAY ===== */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {stages.map((stage, i) => (
            <div
              key={i}
              ref={(el) => { stageRefs.current[i] = el }}
              style={{
                opacity: 0,
                filter: "blur(10px)",
                scale: 1.08,
                y: 40,
                willChange: "transform, opacity, filter",
              }}
            >
              <h3
                ref={(el) => { stageTextRefs.current[i] = el }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-text-primary leading-[1.15] tracking-tight"
              >
                {stage.text}
              </h3>
            </div>
          ))}

          {/* Complete sentence — subtle reveal at the end */}
          <div
            ref={completeRef}
            style={{
              opacity: 0,
              filter: "blur(8px)",
              scale: 1.06,
              willChange: "transform, opacity, filter",
            }}
          >
            <p className="text-sm md:text-base text-text-muted/60 mt-12 tracking-[0.15em] uppercase">
              Understand the force behind every formula.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
