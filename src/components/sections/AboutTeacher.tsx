"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const words = ["CLARITY", "CONTROL", "METHOD"]

export function AboutTeacher() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const contentRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const profileInnerRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Profile panel slides in with 3D perspective
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      tl.from(profileRef.current, {
        scale: 0.92,
        opacity: 0,
        rotateY: -6,
        transformPerspective: 1000,
        duration: 1.4,
        ease: "power4.out",
      })

      tl.from(
        badgeRef.current,
        {
          opacity: 0,
          x: -20,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4",
      )

      // Words reveal with stagger and perspective
      wordRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 80,
          opacity: 0,
          rotateX: 12,
          transformPerspective: 800,
          duration: 1,
          delay: i * 0.18,
          ease: "power4.out",
        })
      })

      // Content text reveals
      const textEls = contentRef.current?.querySelectorAll(".about-text")
      if (textEls) {
        gsap.from(textEls, {
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power4.out",
        })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden bg-bg"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(199, 255, 61, 0.02) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Profile / Media panel */}
          <div
            ref={profileRef}
            className="relative"
            style={{ perspective: "1000px" }}
          >
            <div className="relative w-full aspect-[3/4] max-w-md mx-auto">
              <div className="absolute inset-0 bg-bg-alt border border-border rounded-none" />
              <div
                ref={profileInnerRef}
                className="absolute inset-3 bg-bg-alt border border-border flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-accent-dim flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-accent-lime">
                      PT
                    </span>
                  </div>
                  <p className="text-text-dim text-xs tracking-extreme uppercase">
                    [Teacher Portrait]
                  </p>
                </div>
              </div>
              <div
                ref={badgeRef}
                className="absolute -bottom-3 -right-3 px-5 py-3 border border-border text-text-primary text-xs font-semibold uppercase tracking-wider bg-bg-alt"
              >
                20+ Years
              </div>
            </div>
          </div>

          <div ref={contentRef}>
            <p className="about-text text-[10px] font-medium uppercase tracking-[0.3em] text-text-muted mb-8">
              About
            </p>

            <div className="space-y-1 mb-10">
              {words.map((word, i) => (
                <h2
                  key={word}
                  ref={(el) => {
                    wordRefs.current[i] = el
                  }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-text-primary leading-[0.85] tracking-tight"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {word}
                </h2>
              ))}
            </div>

            <p className="about-text text-text-muted text-base leading-relaxed max-w-lg mb-6">
              With over twenty years of experience, this is not quick coaching.
              It is a disciplined, visual, and exam-focused method built for
              students who want physics to finally make sense.
            </p>

            <p className="about-text text-text-dim text-sm leading-relaxed max-w-lg">
              BSc (Hons) Physics, MSc, PGCE. World Prize and Island Top
              producers across Edexcel and Cambridge examinations.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
