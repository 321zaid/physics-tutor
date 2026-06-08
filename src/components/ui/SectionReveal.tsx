"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { fadeUp, scaleFade, clipReveal, perspectiveUp, ease } from "@/lib/animation-variants"

type RevealVariant = "fadeUp" | "scaleFade" | "clipReveal" | "perspectiveUp"

interface SectionRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  once?: boolean
  variant?: RevealVariant
}

const variants = {
  fadeUp,
  scaleFade,
  clipReveal,
  perspectiveUp,
}

export function SectionReveal({
  children,
  className,
  delay = 0,
  once = true,
  variant = "fadeUp",
}: SectionRevealProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: "-80px" })

  if (variant === "clipReveal") {
    return (
      <motion.div
        ref={ref}
        variants={clipReveal}
        initial="initial"
        animate={inView ? "animate" : "initial"}
        className={cn("overflow-hidden", className)}
        transition={{ duration: 1.2, ease, delay }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      variants={variants[variant]}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      className={cn(className)}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  )
}
