"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, MessageCircle } from "lucide-react"

export function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/94XXXXXXXXX"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 border border-border text-text-primary flex items-center justify-center bg-bg-alt hover:bg-surface-hover transition-colors"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
    </motion.a>
  )
}

export function ScrollTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 w-10 h-10 border border-border text-text-muted flex items-center justify-center bg-bg-alt hover:bg-surface-hover transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted")
    if (!accepted) {
      Promise.resolve().then(() => setVisible(true))
    }
  }, [])

  const accept = () => {
    localStorage.setItem("cookiesAccepted", "true")
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-bg-alt border-t border-border text-text-primary px-4 py-3 flex items-center justify-center gap-4 text-sm flex-wrap"
        >
          <span className="text-text-muted">This website uses cookies to ensure you get the best experience.</span>
          <button
            onClick={accept}
            className="px-5 py-2 border border-border text-text-primary font-semibold text-xs uppercase tracking-wider hover:bg-surface-hover transition-colors"
          >
            Accept
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
