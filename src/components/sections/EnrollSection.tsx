"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { supabase } from "@/lib/supabase"

gsap.registerPlugin(ScrollTrigger)

const grades = [
  "Edexcel IGCSE (O/L)",
  "Cambridge IGCSE (O/L)",
  "Edexcel AS Level",
  "Cambridge AS Level",
  "Edexcel A2 Level",
  "Cambridge A2 Level",
  "Other",
]

export default function EnrollSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [grade, setGrade] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
    })
    return () => ctx.revert()
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError || !authData.user) {
      setMessage(authError?.message || "Sign up failed")
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      name,
      email,
      phone,
      grade_board: grade,
    })

    if (profileError) {
      setMessage(profileError.message)
      setLoading(false)
      return
    }

    if (!authData.session) {
      setMessage("Account created. Please confirm your email before logging in.")
    } else {
      setMessage("Account created! You can now log in.")
    }
    setName("")
    setEmail("")
    setPhone("")
    setGrade("")
    setPassword("")
    setLoading(false)
  }

  return (
    <section
      id="enroll"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden bg-bg-alt"
    >
      <div className="relative max-w-2xl mx-auto px-6">
        <div ref={contentRef} className="text-center mb-12">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-text-muted mb-4">
            Sign Up
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary leading-[0.9] mb-4">
            Book a free trial.
          </h2>
          <p className="text-text-muted text-sm max-w-sm mx-auto">
            Create an account. No pressure. See the method first.
          </p>
        </div>

        <form
          onSubmit={handleSignUp}
          className="bg-bg border border-border p-8 md:p-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-dim mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Amal Perera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-bg-alt border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim transition-colors placeholder:text-text-dim"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-dim mb-1.5">
                Email *
              </label>
              <input
                type="email"
                placeholder="amal@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-bg-alt border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim transition-colors placeholder:text-text-dim"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-dim mb-1.5">
                Phone *
              </label>
              <input
                type="tel"
                placeholder="+94 77 XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-bg-alt border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim transition-colors placeholder:text-text-dim"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-dim mb-1.5">
                Grade / Board *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 bg-bg-alt border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim transition-colors"
                required
              >
                <option value="">Select grade</option>
                {grades.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-dim mb-1.5">
              Password *
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-bg-alt border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim transition-colors placeholder:text-text-dim"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-8 py-4 border border-border text-text-primary font-semibold text-sm uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-500 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {message && (
            <p className="text-sm mt-4 text-center text-text-muted">
              {message}
            </p>
          )}

          <p className="text-text-dim text-[10px] mt-4 text-center uppercase tracking-[0.15em]">
            Free trial — no commitment
          </p>
        </form>
      </div>
    </section>
  )
}
