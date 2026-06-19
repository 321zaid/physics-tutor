"use client"

import { motion } from "framer-motion"

type ToggleProps = {
  enabled: boolean
  onChange: () => void
  disabled?: boolean
  labelOn?: string
  labelOff?: string
  colorOn?: string
  colorOff?: string
}

const spring = { type: "spring" as const, stiffness: 700, damping: 30 }

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
      <div className="relative">
        {/* glass track */}
        <motion.div
          layout
          transition={spring}
          className="relative w-[44px] h-[24px] rounded-full overflow-hidden"
          style={{
            background: enabled
              ? "linear-gradient(135deg, rgba(34,197,94,0.85), rgba(74,222,128,0.7))"
              : "linear-gradient(135deg, rgba(100,100,100,0.4), rgba(80,80,80,0.3))",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid",
            borderColor: enabled ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.08)",
            boxShadow: enabled
              ? "inset 0 1px 2px rgba(255,255,255,0.15), 0 0 8px rgba(34,197,94,0.2)"
              : "inset 0 1px 2px rgba(0,0,0,0.2)",
          }}
          whileTap={disabled ? undefined : { scale: 0.95 }}
        >
          {/* shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          {/* knob */}
          <motion.div
            layout
            transition={spring}
            className="absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full z-10"
            style={{
              background: "linear-gradient(145deg, #ffffff, #e8e8e8)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.8)",
              x: enabled ? 22 : 0,
            }}
          />
        </motion.div>
      </div>
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
