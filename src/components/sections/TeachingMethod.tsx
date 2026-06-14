"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const steps = [
  { number: "01", title: "Concept", desc: "Understand what the formula means, not just how to use it." },
  { number: "02", title: "Diagram", desc: "Visualize with exam-style diagrams that make abstraction tangible." },
  { number: "03", title: "Worked Example", desc: "Step-by-step solutions that build problem-solving intuition." },
  { number: "04", title: "Past Paper", desc: "Apply knowledge to real exam questions. Pattern recognition." },
  { number: "05", title: "Exam Confidence", desc: "Repeated practice builds speed, accuracy, and control." },
]

const SECTION_VH = 150

// Each step: [enterStart, enterEnd, holdEnd]
// Step stays visible once entered; builds cumulatively
const stepPhases = steps.map((_, i) => ({
  enterStart: 0.12 + i * 0.14,
  enterEnd: 0.12 + i * 0.14 + 0.06,
  holdEnd: 0.96,
}))

const TITLE_END = 0.11
const SETTLE_START = 0.88
const EXIT_START = 0.94

export function TeachingMethod() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])
  const trackRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const settleGlowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const media = mediaRef.current
    const hero = document.getElementById("hero")
    if (!section || !pin || !media) return

    const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: hero || section,
        pin: pin,
        pinSpacing: false,
        start: "bottom bottom",
        endTrigger: section,
        end: "bottom top",
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress

          // ===== BACKGROUND MEDIA =====
          // Slow drift across full section; settles at the end
          const mediaScale = p < SETTLE_START
            ? 0.90 + p * 0.14
            : 1.03 - (p - SETTLE_START) * 0.04
          const mediaY = p < SETTLE_START
            ? -40 + p * 60
            : 15 - (p - SETTLE_START) * 20
          gsap.set(media, {
            scale: mediaScale,
            y: mediaY,
            rotateX: (p - 0.5) * 2.5,
          })

          // ===== TITLE REVEAL =====
          if (titleRef.current) {
            const titleP = Math.min(p / TITLE_END, 1)
            gsap.set(titleRef.current, {
              opacity: titleP,
              y: 20 - titleP * 20,
            })
          }

          // ===== STEP REVEALS (cumulative — once in, stays visible) =====
          stepsRef.current.forEach((el, i) => {
            if (!el) return
            const phase = stepPhases[i]

            let opacity = 0
            let y = 30

            if (p < phase.enterStart) {
              opacity = 0
              y = 30
            } else if (p >= phase.enterStart && p < phase.enterEnd) {
              const t = (p - phase.enterStart) / (phase.enterEnd - phase.enterStart)
              const eased = 1 - Math.pow(1 - t, 3)
              opacity = eased
              y = 30 - eased * 30
            } else if (p >= phase.enterEnd && p < EXIT_START) {
              opacity = 1
              y = 0
            } else if (p >= EXIT_START) {
              const t = (p - EXIT_START) / (1 - EXIT_START)
              opacity = 1 - t * 0.6
              y = -t * 12
            }

            gsap.set(el, {
              opacity,
              y,
              visibility: "visible",
            })
          })

          // ===== CARD 3D PERSPECTIVE =====
          cardRefs.current.forEach((el, i) => {
            if (!el) return
            const phase = stepPhases[i]

            if (p < phase.enterStart) {
              gsap.set(el, {
                rotateX: 10,
                rotateY: -4,
                scale: 0.9,
                opacity: 0,
                y: 30,
                transformPerspective: 1000,
              })
            } else if (p >= phase.enterStart && p < phase.enterEnd) {
              const t = (p - phase.enterStart) / (phase.enterEnd - phase.enterStart)
              const eased = 1 - Math.pow(1 - t, 3)
              gsap.set(el, {
                rotateX: 10 - eased * 10,
                rotateY: -4 + eased * 4,
                scale: 0.9 + eased * 0.1,
                opacity: eased,
                y: 30 - eased * 30,
                transformPerspective: 1000,
              })
            } else if (p >= phase.enterEnd && p < EXIT_START) {
              gsap.set(el, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                opacity: 1,
                y: 0,
                transformPerspective: 1000,
              })
            } else {
              const t = (p - EXIT_START) / (1 - EXIT_START)
              gsap.set(el, {
                rotateX: -t * 4,
                rotateY: t * 2,
                scale: 1 - t * 0.06,
                opacity: 1 - t * 0.6,
                y: -t * 12,
                transformPerspective: 1000,
              })
            }
          })

          // ===== PROGRESS TRACK =====
          if (trackRef.current) {
            const filled = Math.min(p / 0.92, 1)
            gsap.set(trackRef.current, { height: `${filled * 100}%` })
          }

          // ===== AMBIENT GLOW =====
          if (bgRef.current) {
            const glow = p < SETTLE_START
              ? 0.02 + p * 0.06
              : 0.075 + (p - SETTLE_START) * 0.15
            gsap.set(bgRef.current, { opacity: Math.min(glow, 0.15) })
          }

          // ===== SETTLE GLOW =====
          if (settleGlowRef.current) {
            if (p >= SETTLE_START && p < EXIT_START) {
              const t = (p - SETTLE_START) / (EXIT_START - SETTLE_START)
              const breathe = 0.5 + 0.5 * Math.sin(t * Math.PI * 2)
              gsap.set(settleGlowRef.current, {
                opacity: 0.04 + breathe * 0.06,
                scale: 0.9 + breathe * 0.1,
              })
            } else if (p >= EXIT_START) {
              const t = (p - EXIT_START) / (1 - EXIT_START)
              gsap.set(settleGlowRef.current, {
                opacity: 0.1 * (1 - t),
                scale: 1 - t * 0.2,
              })
            } else {
              gsap.set(settleGlowRef.current, { opacity: 0 })
            }
          }

          // ===== CONTENT 3D DEPTH =====
          if (contentRef.current) {
            const drift = p < SETTLE_START
              ? (p - 0.5) * 1.5
              : (0.92 - 0.5) * 1.5 * (1 - (p - SETTLE_START) / (1 - SETTLE_START))
            gsap.set(contentRef.current, {
              rotateY: drift,
              transformPerspective: 1200,
            })
          }
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="method"
      className="relative overflow-hidden bg-bg"
      style={{ height: `${SECTION_VH}vh` }}
    >
      <div
        ref={pinRef}
        className="sticky top-0 h-screen flex items-center overflow-hidden"
      >
        {/* Background media layer */}
        <div
          ref={mediaRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "linear-gradient(160deg, #0A0F1A 0%, #10141C 50%, #070A0F 100%)",
              filter: "grayscale(1)",
            }}
          />
          <div className="noise-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/60 via-transparent to-bg/60 z-[1]" />
          <div className="absolute inset-0 cinema-overlay z-[1]" />
        </div>

        {/* Ambient glow behind content */}
        <div
          ref={bgRef}
          className="absolute inset-0 opacity-0 pointer-events-none z-[2]"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(199,255,61,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Settle glow — pulses during final hold */}
        <div
          ref={settleGlowRef}
          className="absolute inset-0 pointer-events-none z-[2] opacity-0"
          style={{
            background:
              "radial-gradient(ellipse 40% 40% at 50% 50%, rgba(199,255,61,0.06) 0%, transparent 70%)",
            transform: "scale(0.9)",
          }}
        />

        <div
          ref={contentRef}
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              {/* Title */}
              <p
                ref={titleRef}
                className="text-[10px] font-medium uppercase tracking-[0.3em] text-text-muted mb-8"
                style={{ opacity: 0, y: 20 }}
              >
                The Method
              </p>

              {/* Steps */}
              {steps.map((step, i) => (
                <div
                  key={step.number}
                  ref={(el) => { stepsRef.current[i] = el }}
                  className="opacity-0 invisible"
                  style={{ visibility: "hidden" }}
                >
                  <div
                    ref={(el) => { cardRefs.current[i] = el }}
                    className="flex items-start gap-6 py-6"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.12)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <span className="text-[10px] font-semibold text-accent-lime tracking-wider shrink-0 mt-1">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-text-muted leading-relaxed max-w-md">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress track */}
            <div className="hidden lg:flex flex-col items-center justify-center">
              <div
                className="relative w-px h-64"
                style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              >
                <div
                  ref={trackRef}
                  className="absolute bottom-0 left-0 w-full"
                  style={{ backgroundColor: "#C7FF3D", height: "0%" }}
                />
                {steps.map((_, i) => {
                  const dotColor = i <= 0 ? "#C7FF3D" : "rgba(255,255,255,0.12)"
                  return (
                    <div
                      key={i}
                      className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: dotColor,
                        bottom: `${(i / (steps.length - 1)) * 100}%`,
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
