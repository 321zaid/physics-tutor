"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "About", href: "#about" },
  { label: "Topics", href: "#topics" },
  { label: "Method", href: "#method" },
  { label: "Results", href: "#results" },
  { label: "Join", href: "#join" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          scrolled
            ? "bg-bg/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex flex-col">
              <span className="text-sm font-semibold text-text-primary tracking-super uppercase">
                Physics
              </span>
              <span className="text-[10px] text-text-muted tracking-extreme uppercase -mt-0.5">
                Teacher
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-text-muted hover:text-text-primary transition-colors duration-400"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex items-center gap-2 ml-6 pl-6 border-l border-border">
                <a
                  href="#join"
                  className="px-5 py-2.5 border border-border text-text-primary text-xs font-semibold uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-300"
                >
                  Join Live
                </a>
              </div>
            </nav>

            <div className="flex lg:hidden items-center gap-3">
              <a
                href="#join"
                className="px-4 py-2 border border-border text-text-primary text-[10px] font-semibold uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-300"
              >
                Join
              </a>
              <button
                onClick={() => setOpen(true)}
                className="text-text-muted p-2"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-bg/80 z-[60] lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm bg-bg-alt z-[70] lg:hidden flex flex-col border-l border-border"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <span className="text-sm font-semibold text-text-primary tracking-super uppercase">
                  Physics
                </span>
                <button onClick={() => setOpen(false)} className="text-text-muted p-1" aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-6">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-sm font-medium uppercase tracking-wider text-text-muted hover:text-text-primary transition-colors border-b border-border"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="mt-8 space-y-3">
                  <a
                    href="#join"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center w-full py-3.5 border border-border text-text-primary text-sm font-semibold uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all"
                  >
                    Join Live Class
                  </a>
                  <a
                    href="#enroll"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center w-full py-3.5 border border-border text-text-primary text-sm font-semibold uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all"
                  >
                    Book Free Trial
                  </a>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
