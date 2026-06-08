"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { ChevronLeft, ChevronRight } from "lucide-react"

gsap.registerPlugin(CustomEase)
CustomEase.create("cinema", "0.16, 1, 0.3, 1")

export interface SlideItem {
  id: string | number
  [key: string]: any
}

interface CoverflowSliderProps {
  items: SlideItem[]
  renderSlide: (item: SlideItem, index: number, focused: boolean) => React.ReactNode
  className?: string
  initialIndex?: number
}

function calcPos(index: number, focus: number, mobile: boolean) {
  const diff = index - focus
  const abs = Math.abs(diff)
  const s = diff > 0 ? 1 : -1

  if (mobile) {
    return {
      x: diff * 120,
      z: diff === 0 ? 60 : -abs * 30,
      scale: diff === 0 ? 1.15 : Math.max(0.55, 1 - abs * 0.12),
      rotateY: s * Math.min(14, abs * 9),
      opacity: diff === 0 ? 1 : Math.max(0.03, 1 - abs * 0.38),
      blur: diff === 0 ? 0 : Math.min(4, abs * 1.8),
    }
  }

  if (diff === 0) {
    return { x: 0, z: 140, scale: 1.18, rotateY: 0, opacity: 1, blur: 0 }
  }
  if (abs === 1) {
    return {
      x: diff * 210 + s * 25,
      z: -60,
      scale: 0.85,
      rotateY: s * 8,
      opacity: 0.35,
      blur: 3.5,
    }
  }
  if (abs === 2) {
    return {
      x: diff * 190 + s * 60,
      z: -160,
      scale: 0.7,
      rotateY: s * 7,
      opacity: 0.1,
      blur: 6,
    }
  }
  return {
    x: diff * 180 + s * 80,
    z: -260,
    scale: Math.max(0.42, 0.6 - (abs - 2) * 0.05),
    rotateY: s * 5,
    opacity: Math.max(0.015, 0.05 - (abs - 2) * 0.01),
    blur: Math.min(10, 6 + (abs - 2) * 1.5),
  }
}

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v))
}

export function CoverflowSlider({
  items,
  renderSlide,
  className,
  initialIndex,
}: CoverflowSliderProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex ?? 0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const mobile = useRef(false)
  const reduceMotion = useRef(false)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])
  const dragging = useRef(false)
  const startX = useRef(0)
  const dragOff = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const initialDone = useRef(false)

  const focusIndex = hoveredIndex !== null ? hoveredIndex : activeIndex

  useEffect(() => {
    setMounted(true)
    const check = () => { mobile.current = window.innerWidth < 768 }
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)")
    reduceMotion.current = rm.matches
    check()
    window.addEventListener("resize", check)
    const handler = () => { reduceMotion.current = rm.matches }
    rm.addEventListener("change", handler)
    return () => {
      window.removeEventListener("resize", check)
      rm.removeEventListener("change", handler)
    }
  }, [])

  const animateTo = useCallback((refIndex: number, instant?: boolean) => {
    const dur = instant || !initialDone.current ? 0 : 1.6
    const rm = reduceMotion.current
    slidesRef.current.forEach((el, i) => {
      if (!el) return
      if (rm) {
        gsap.to(el, {
          opacity: i === refIndex ? 1 : 0.1,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        })
        return
      }
      const p = calcPos(i, refIndex, mobile.current)
      gsap.to(el, {
        x: p.x,
        z: p.z,
        scale: p.scale,
        rotateY: p.rotateY,
        opacity: p.opacity,
        filter: `blur(${p.blur}px) brightness(${i === refIndex ? 1.15 : 0.55})`,
        duration: dur,
        ease: "cinema",
        overwrite: "auto",
      })
    })
  }, [])

  // Container zoom when hovering — camera push effect
  useEffect(() => {
    if (!mounted || !trackRef.current || reduceMotion.current) return
    if (hoveredIndex !== null) {
      gsap.to(trackRef.current, {
        scale: 1.02,
        duration: 1.2,
        ease: "cinema",
        overwrite: "auto",
      })
    } else {
      gsap.to(trackRef.current, {
        scale: 1,
        duration: 1.2,
        ease: "cinema",
        overwrite: "auto",
      })
    }
  }, [hoveredIndex, mounted])

  useEffect(() => {
    if (!mounted) return
    initialDone.current = true
    if (hoveredIndex === null) animateTo(activeIndex)
  }, [activeIndex, mounted, animateTo, hoveredIndex])

  useEffect(() => {
    if (!mounted) return
    if (hoveredIndex !== null) {
      animateTo(hoveredIndex)
    } else {
      animateTo(activeIndex)
    }
  }, [hoveredIndex, mounted, animateTo, activeIndex])

  useEffect(() => {
    if (!mounted) return
    slidesRef.current.forEach((el, i) => {
      if (!el) return
      gsap.set(el, { opacity: 0, z: -150, scale: 0.85 })
    })
    gsap.to(slidesRef.current.filter(Boolean), {
      opacity: 1,
      scale: 1,
      z: (i: number) => calcPos(i, activeIndex, mobile.current).z,
      duration: 1.2,
      stagger: 0.06,
      ease: "power4.out",
      delay: 0.4,
      onComplete: () => { initialDone.current = true },
    })
  }, [mounted])

  const goTo = useCallback(
    (index: number) => setActiveIndex(clamp(index, 0, items.length - 1)),
    [items.length],
  )
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true
    startX.current = e.clientX
    dragOff.current = 0
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current || reduceMotion.current) return
    const dx = e.clientX - startX.current
    const offset = dx / (mobile.current ? 120 : 210)
    dragOff.current = offset
    slidesRef.current.forEach((el, i) => {
      if (!el) return
      const pos = calcPos(i, activeIndex - offset, mobile.current)
      gsap.set(el, {
        x: pos.x,
        z: pos.z,
        scale: pos.scale,
        rotateY: pos.rotateY,
        opacity: pos.opacity,
        filter: `blur(${pos.blur}px) brightness(${i === Math.round(activeIndex - offset) ? 1.15 : 0.55})`,
      })
    })
  }

  const onUp = () => {
    if (!dragging.current) return
    dragging.current = false
    const off = dragOff.current
    if (Math.abs(off) > 0.3) {
      goTo(activeIndex + (off > 0 ? -1 : 1))
    } else {
      animateTo(hoveredIndex !== null ? hoveredIndex : activeIndex, true)
    }
  }

  useEffect(() => {
    if (!mounted) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      else if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [mounted, goPrev, goNext])

  const handleEnter = useCallback((i: number) => {
    if (!dragging.current) setHoveredIndex(i)
  }, [])
  const handleLeave = useCallback(() => {
    setHoveredIndex(null)
  }, [])

  const isFirst = activeIndex === 0
  const isLast = activeIndex === items.length - 1

  return (
    <div
      ref={containerRef}
      className={`relative ${className || ""}`}
      style={{ perspective: !reduceMotion.current ? "1200px" : undefined }}
      onPointerLeave={handleLeave}
    >
      <div
        ref={trackRef}
        className="relative w-full select-none"
        style={{
          transformStyle: !reduceMotion.current ? "preserve-3d" : undefined,
          minHeight: mobile.current ? "360px" : "540px",
          willChange: reduceMotion.current ? undefined : "transform",
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            className="absolute top-0 left-1/2 h-full -translate-x-1/2"
            style={{
              transformStyle: !reduceMotion.current ? "preserve-3d" : undefined,
              zIndex: items.length - Math.abs(i - focusIndex),
              willChange: reduceMotion.current ? undefined : "transform, opacity, filter",
            }}
          >
            <div
              ref={(el) => { slidesRef.current[i] = el }}
              className="h-full flex items-center"
              style={{
                transformStyle: !reduceMotion.current ? "preserve-3d" : undefined,
                backfaceVisibility: reduceMotion.current ? undefined : "hidden",
                width: mobile.current ? "min(300px, 80vw)" : "min(460px, 72vw)",
                touchAction: "none",
              }}
              onPointerEnter={() => handleEnter(i)}
            >
              <div
                className="w-full"
                style={{
                  transition:
                    "border 1.2s cubic-bezier(0.16,1,0.3,1), box-shadow 1.2s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {renderSlide(item, i, i === focusIndex)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          onClick={goPrev}
          disabled={isFirst}
          className="p-2 text-text-muted hover:text-text-primary disabled:opacity-15 disabled:cursor-not-allowed transition-all duration-500"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-700 rounded-full ${
                i === focusIndex
                  ? "bg-accent-lime w-8 h-1.5"
                  : "bg-text-dim/20 hover:bg-text-dim/40 w-1.5 h-1.5"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={goNext}
          disabled={isLast}
          className="p-2 text-text-muted hover:text-text-primary disabled:opacity-15 disabled:cursor-not-allowed transition-all duration-500"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
