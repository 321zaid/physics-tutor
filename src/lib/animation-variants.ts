import { Variants, Transition } from "framer-motion"

export const ease: Transition["ease"] = [0.16, 1, 0.3, 1]

export const fadeUp: Variants = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.9, ease } },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8, ease } },
}

export const scaleFade: Variants = {
  initial: { scale: 0.92, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 1.1, ease } },
}

export const clipReveal: Variants = {
  initial: { clipPath: "inset(0 0 100% 0)", y: 20 },
  animate: {
    clipPath: "inset(0 0 0% 0)",
    y: 0,
    transition: { duration: 1.2, ease },
  },
}

export const perspectiveUp: Variants = {
  initial: { y: 60, opacity: 0, rotateX: 8, transformPerspective: 800 },
  animate: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: { duration: 1, ease },
  },
}

export const wordReveal: Variants = {
  initial: { y: "100%" },
  animate: { y: "0%", transition: { duration: 0.9, ease } },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.4, ease } },
  tap: { scale: 0.97, transition: { duration: 0.15 } },
}
