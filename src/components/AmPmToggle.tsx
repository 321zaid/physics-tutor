"use client"

import { motion } from "framer-motion"

type AmPmToggleProps = {
  value: "AM" | "PM"
  onChange: (v: "AM" | "PM") => void
}

export default function AmPmToggle({ value, onChange }: AmPmToggleProps) {
  return (
    <div
      className="relative flex rounded-lg overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(80,80,80,0.3), rgba(60,60,60,0.2))",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
      }}
    >
      <div className="relative flex">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-[2px] bottom-[2px] rounded-md z-0"
          style={{
            width: "calc(50% - 2px)",
            background: "linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1)",
            x: value === "AM" ? 2 : "calc(100% + 2px)",
          }}
        />
        <button
          type="button"
          onClick={() => onChange("AM")}
          className="relative z-10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-150"
          style={{ color: value === "AM" ? "#fff" : "rgba(255,255,255,0.4)" }}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => onChange("PM")}
          className="relative z-10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-150"
          style={{ color: value === "PM" ? "#fff" : "rgba(255,255,255,0.4)" }}
        >
          PM
        </button>
      </div>
    </div>
  )
}
