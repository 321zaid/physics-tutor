"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <h1 className="text-8xl md:text-9xl font-heading font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-heading font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for might have been moved or does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-8 py-3.5 bg-primary text-white font-heading font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-[#152d47] transition-colors duration-300"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  )
}
