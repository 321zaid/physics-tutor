"use client"

import { useRef } from "react"
import { CoverflowSlider } from "@/components/ui/CoverflowSlider"
import { cn } from "@/lib/utils"

const topics = [
  { id: 1, title: "Mechanics", desc: "Forces, energy, momentum, kinematics" },
  { id: 2, title: "Waves", desc: "Superposition, diffraction, optics" },
  { id: 3, title: "Electricity", desc: "Current, circuits, capacitance" },
  { id: 4, title: "Materials", desc: "Stress, strain, elasticity" },
  { id: 5, title: "Thermal Physics", desc: "Heat transfer, ideal gases" },
  { id: 6, title: "Fields", desc: "Gravitational, electric, magnetic" },
  { id: 7, title: "Projectile Motion", desc: "Trajectories, vector analysis" },
]

const cardBase =
  "relative overflow-hidden"

const cardFocused =
  "bg-[rgba(16,20,28,0.78)] border-white/22"

const cardBlurred =
  "bg-[rgba(16,20,28,0.6)] border-white/6"

export function TopicsSlider() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      id="topics"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden bg-bg"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(199,255,61,0.015) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-16 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-text-muted mb-4">
            Curriculum
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[0.9]">
            What is taught.
          </h2>
        </div>

        <CoverflowSlider
          items={topics}
          initialIndex={0}
          renderSlide={(item, i, focused) => (
            <div
              className={cn(
                cardBase,
                focused ? "glass-card-active" : "glass-card",
              )}
              style={{
                background: focused
                  ? "rgba(20,26,36,0.82)"
                  : "rgba(14,18,26,0.65)",
                backdropFilter: focused ? "blur(28px)" : "blur(18px)",
                WebkitBackdropFilter: focused ? "blur(28px)" : "blur(18px)",
                border: focused
                  ? "1px solid rgba(255,255,255,0.22)"
                  : "1px solid rgba(255,255,255,0.06)",
                boxShadow: focused
                  ? "0 36px 100px rgba(0,0,0,0.65), 0 0 60px rgba(199,255,61,0.03)"
                  : "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: focused
                    ? "linear-gradient(135deg, rgba(199,255,61,0.06) 0%, transparent 50%)"
                    : "linear-gradient(135deg, rgba(199,255,61,0.02) 0%, transparent 50%)",
                  opacity: focused ? 1 : 0.4,
                  transition: "opacity 1s cubic-bezier(0.16,1,0.3,1)",
                }}
              />

              <div className="relative z-[1] p-8 md:p-10">
                <span
                  className="text-[10px] font-medium uppercase tracking-[0.2em] mb-4 block"
                  style={{
                    color: focused
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(255,255,255,0.25)",
                    transition: "color 0.8s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="text-2xl md:text-3xl font-bold mb-3 leading-[1.1]"
                  style={{
                    color: focused
                      ? "#F5F5F0"
                      : "rgba(245,245,240,0.55)",
                    transition: "color 0.8s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: focused
                      ? "rgba(245,245,240,0.7)"
                      : "rgba(245,245,240,0.3)",
                    transition: "color 0.8s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {item.desc}
                </p>
              </div>

              <div
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full pointer-events-none"
                style={{
                  background: focused
                    ? "radial-gradient(circle, rgba(199,255,61,0.06) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(199,255,61,0.02) 0%, transparent 70%)",
                  filter: "blur(20px)",
                  opacity: focused ? 1 : 0.3,
                  transition: "opacity 1s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            </div>
          )}
        />
      </div>
    </section>
  )
}
