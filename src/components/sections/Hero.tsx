"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const bgLayersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Immersive entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      tl.from(mediaRef.current, {
        scale: 1.15,
        duration: 2,
        ease: "power3.out",
        delay: 0.3,
      })

      tl.from(
        labelRef.current,
        { y: 30, opacity: 0, duration: 1 },
        "-=1.2",
      )

      const headlineEls = headlineRef.current?.querySelectorAll(".hero-line")
      if (headlineEls) {
        tl.from(
          headlineEls,
          { y: 80, opacity: 0, duration: 1.4, stagger: 0.15 },
          "-=0.6",
        )
      }

      tl.from(subtitleRef.current, { y: 30, opacity: 0, duration: 1 }, "-=0.8")

      const ctaChildren = ctaRef.current?.children
      if (ctaChildren) {
        tl.from(
          ctaChildren,
          { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 },
          "-=0.5",
        )
      }

      tl.from(scrollRef.current, { opacity: 0, duration: 0.6 }, "-=0.3")

      // Subtle parallax on scroll for the media layer
      gsap.to(mediaRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        scale: 1.05,
        y: 40,
        ease: "none",
      })

      // Foreground text moves slightly faster than background for depth
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
          y: -30,
          ease: "none",
        })
      }

      if (bgLayersRef.current) {
        gsap.to(bgLayersRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
          y: -10,
          ease: "none",
        })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-solid"
    >
      {/* Cinematic media panel with parallax */}
      <div
        ref={mediaRef}
        className="absolute inset-0 media-panel will-change-transform"
      >
        <div
          ref={bgLayersRef}
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "linear-gradient(135deg, #0A0F1A 0%, #070A0F 40%, #10141C 100%)",
            filter: "grayscale(1)",
          }}
        />
        <div className="noise-overlay" />
        <div className="absolute inset-0 cinema-overlay z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/80 z-[1]" />
      </div>

      {/* Accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-lime/30 to-transparent z-10" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p
          ref={labelRef}
          className="text-xs font-medium uppercase tracking-[0.3em] text-text-muted mb-6"
        >
          Physics Teacher
        </p>

        <h1
          ref={headlineRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-text-primary leading-[0.9] mb-6 will-change-transform"
        >
          <span className="hero-line block">Physics,</span>
          <span className="hero-line block text-text-primary">controlled.</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-base md:text-lg text-text-muted max-w-lg mx-auto leading-relaxed"
        >
          Turn confusion into clarity. Exam-focused. Visually taught. Clearly
          structured.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <a
            href="#enroll"
            className="inline-flex items-center gap-2 px-8 py-4 border border-border text-text-primary font-semibold text-sm uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-500"
          >
            Book Free Trial
          </a>
          <a
            href="#join"
            className="inline-flex items-center gap-2 px-8 py-4 border border-border text-text-primary font-semibold text-sm uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-500"
          >
            Join Live Class
          </a>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-text-dim uppercase tracking-[0.3em]">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-text-dim to-transparent" />
      </div>
    </section>
  )
}
