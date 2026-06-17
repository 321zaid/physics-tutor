"use client"

import { motion, type Transition } from "framer-motion"

type ToggleProps = {
  enabled: boolean
  onChange: () => void
  disabled?: boolean
  labelOn?: string
  labelOff?: string
  colorOn?: string
  colorOff?: string
}

const spring: Transition = {
  type: "spring",
  stiffness: 700,
  damping: 30,
}

export default function AnimatedToggle({
  enabled,
  onChange,
  disabled = false,
  labelOn = "On",
  labelOff = "Off",
  colorOn = "text-green-400",
  colorOff = "text-red-400",
}: ToggleProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onChange}
      className="flex items-center gap-2 group"
    >
      <motion.div
        layout
        transition={spring}
        className={`relative w-10 h-5 rounded-full cursor-pointer ${
          disabled ? "opacity-40 cursor-not-allowed" : ""
        }`}
        style={{
          backgroundColor: enabled ? "#22c55e" : "#5c5c5c",
        }}
        whileTap={disabled ? undefined : { scale: 0.95 }}
      >
        <motion.div
          layout
          transition={spring}
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white"
          animate={{
            x: enabled ? 20 : 0,
          }}
        />
      </motion.div>
      <motion.span
        key={enabled ? "on" : "off"}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className={`text-[10px] uppercase tracking-wider font-semibold ${
          enabled ? colorOn : colorOff
        } ${disabled ? "opacity-40" : ""}`}
      >
        {enabled ? labelOn : labelOff}
      </motion.span>
    </button>
  )
}
