"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const nextClass = {
  topic: "A2 Physics — Oscillations & Waves",
  date: "Saturday, 7 June 2026",
  time: "4:00 PM – 6:00 PM (Sri Lanka Time)",
  platform: "Zoom",
}

export function ScheduleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bgGlowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      tl.from(bgGlowRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        ease: "power3.out",
      })

      tl.from(
        titleRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
        },
        "-=0.6",
      )

      tl.from(
        cardRef.current,
        {
          y: 60,
          opacity: 0,
          rotateX: -4,
          transformPerspective: 800,
          duration: 1.2,
          ease: "power4.out",
        },
        "-=0.4",
      )

      // Stagger inner elements
      const innerEls = cardRef.current?.querySelectorAll(".schedule-line")
      if (innerEls) {
        tl.from(innerEls, {
          y: 15,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        }, "-=0.3")
      }

      const ctaEls = cardRef.current?.querySelectorAll(".schedule-cta")
      if (ctaEls) {
        tl.from(ctaEls, {
          y: 15,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }, "-=0.2")
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="join"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden bg-bg"
    >
      <div
        ref={bgGlowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(199, 255, 61, 0.025) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-text-muted mb-4">
            Join Live
          </p>
          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[0.9] mb-12"
          >
            Next class.
          </h2>

          <div
            ref={cardRef}
            className="bg-bg-alt border border-border p-8 md:p-10 text-left"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="space-y-4 mb-8">
              <div className="schedule-line">
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">
                  Topic
                </p>
                <p className="text-lg md:text-xl font-semibold text-text-primary">
                  {nextClass.topic}
                </p>
              </div>
              <div className="schedule-line grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">
                    Date
                  </p>
                  <p className="text-sm text-text-muted">{nextClass.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">
                    Time
                  </p>
                  <p className="text-sm text-text-muted">{nextClass.time}</p>
                </div>
              </div>
              <div className="schedule-line">
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">
                  Platform
                </p>
                <p className="text-sm text-text-muted">{nextClass.platform}</p>
              </div>
            </div>

            <div className="schedule-cta flex flex-col sm:flex-row gap-3">
              <a
                href="#enroll"
                className="flex-1 inline-flex items-center justify-center px-8 py-4 border border-border text-text-primary font-semibold text-sm uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-500"
              >
                Join Live Class
              </a>
              <a
                href="#enroll"
                className="flex-1 inline-flex items-center justify-center px-8 py-4 border border-border text-text-primary font-semibold text-sm uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-500"
              >
                Sign Up / Enroll Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
