"use client"

import { useRef } from "react"
import { CoverflowSlider } from "@/components/ui/CoverflowSlider"

const testimonials = [
  {
    id: 1,
    quote: "Finally, physics makes sense. The method is clear, visual, and exam-ready.",
    name: "Amal P.",
    result: "Island Top — Cambridge A-Level 2025",
  },
  {
    id: 2,
    quote: "I went from failing to an A*. The worked examples changed everything.",
    name: "Samantha W.",
    result: "A* — Edexcel A-Level 2025",
  },
  {
    id: 3,
    quote: "The diagram-based approach made concepts click that I had been struggling with for months.",
    name: "Kavinda S.",
    result: "100% — Edexcel A2 Physics 2024",
  },
]

export function TestimonialsSlider() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      id="results"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden bg-bg"
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 40% at 50% 60%, rgba(199,255,61,0.015) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-16 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-text-muted mb-4">
            Results
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[0.9]">
            What students say.
          </h2>
        </div>

        <CoverflowSlider
          items={testimonials}
          renderSlide={(item, _i, isActive) => (
            <div
              className={`relative overflow-hidden transition-all duration-500 flex flex-col h-full`}
              style={{
                background: "rgba(16,20,28,0.75)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: isActive
                  ? "1px solid rgba(255,255,255,0.15)"
                  : "1px solid rgba(255,255,255,0.06)",
                boxShadow: isActive
                  ? "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)"
                  : "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
                borderRadius: "0px",
                minHeight: "300px",
              }}
            >
              <div className="relative z-[1] p-8 md:p-10 flex flex-col flex-1">
                <span className="text-5xl font-serif text-accent-lime/20 leading-none mb-4 select-none">
                  &ldquo;
                </span>
                <p className="text-lg md:text-xl text-text-primary leading-relaxed mb-8 flex-1">
                  {item.quote}
                </p>
                <div className="pt-6 border-t border-border">
                  <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                  <p className="text-xs text-text-muted mt-1">{item.result}</p>
                </div>
              </div>

              <div
                className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-[0.03] pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(199,255,61,0.4) 0%, transparent 70%)",
                  filter: "blur(30px)",
                }}
              />
            </div>
          )}
        />
      </div>
    </section>
  )
}
