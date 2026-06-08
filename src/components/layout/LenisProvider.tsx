"use client"

import { useEffect, useRef, ReactNode } from "react"
import { usePathname } from "next/navigation"
import { setLenis } from "@/lib/lenis-bridge"

export function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null)

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
