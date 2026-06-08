"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background glow emerges slowly
      gsap.from(bgRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        scale: 0.7,
        duration: 1.6,
        ease: "power3.out",
      })

      // Content staggers
      const ctaEls = contentRef.current?.querySelectorAll(".cta-line")
      if (ctaEls) {
        gsap.from(ctaEls, {
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: 0.18,
          ease: "power4.out",
        })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-solid"
    >
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 30% at 50% 50%, rgba(199, 255, 61, 0.035) 0%, transparent 70%)",
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-lime/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-lime/10 to-transparent" />

      <div
        ref={contentRef}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
      >
        <p className="cta-line text-[10px] font-medium uppercase tracking-[0.3em] text-text-muted mb-6">
          Start Today
        </p>

        <h2 className="cta-line text-4xl sm:text-5xl md:text-7xl font-bold text-text-primary leading-[0.9] mb-4">
          Physics, finally
        </h2>
        <h2 className="cta-line text-4xl sm:text-5xl md:text-7xl font-bold text-text-primary leading-[0.9] mb-10">
          under control.
        </h2>

        <p className="cta-line text-text-muted text-base max-w-md mx-auto mb-10">
          Book a free trial. Join a live class. Or just see what clear physics
          teaching looks like.
        </p>

        <div className="cta-line flex flex-col sm:flex-row items-center justify-center gap-3">
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
          <a
            href="#enroll"
            className="inline-flex items-center gap-2 px-8 py-4 border border-border text-text-muted font-medium text-sm uppercase tracking-wider rounded-none hover:text-text-primary hover:border-border-hover transition-all duration-500"
          >
            Sign Up Now
          </a>
        </div>

        <p className="cta-line text-text-dim text-xs mt-8">
          Or send a message on WhatsApp
        </p>
      </div>
    </section>
  )
}
