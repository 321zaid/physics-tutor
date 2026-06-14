"use client"

import { useEffect, useRef, ReactNode } from "react"
import { usePathname } from "next/navigation"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { setLenis } from "@/lib/lenis-bridge"

gsap.registerPlugin(ScrollTrigger)

export function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const lenisRef = useRef<{ destroy: () => void } | null>(null)

  useEffect(() => {
    let mounted = true
    const init = async () => {
      const Lenis = (await import("lenis")).default
      const lenis = new Lenis({
        duration: 1.3,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      })

      if (!mounted) { lenis.destroy(); return }

      lenisRef.current = lenis
      setLenis(lenis)

      // Sync Lenis with ScrollTrigger — critical for pinned sections
      lenis.on("scroll", ScrollTrigger.update)

      // Refresh ScrollTrigger after layout settles to avoid blank gaps
      requestAnimationFrame(() => ScrollTrigger.refresh())
      setTimeout(() => ScrollTrigger.refresh(), 500)

      const raf = (time: number) => {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    }
    init()

    return () => {
      mounted = false
      setLenis(null)
      lenisRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return <>{children}</>
}
