"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { User } from "@supabase/supabase-js"
import { supabase, type Class, type LiveClass, ensureProfile, updateLastLogin } from "@/lib/supabase"

gsap.registerPlugin(ScrollTrigger)

export function ScheduleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bgGlowRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [nextClass, setNextClass] = useState<Class | null>(null)
  const [nextLiveClass, setNextLiveClass] = useState<LiveClass | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [classStatus, setClassStatus] = useState<"upcoming" | "live" | "ended" | null>(null)
  const [countdown, setCountdown] = useState("")

  function getClassStatus(start: Date, end: Date): "upcoming" | "live" | "ended" {
    const now = Date.now()
    if (now < start.getTime()) return "upcoming"
    if (now > end.getTime()) return "ended"
    return "live"
  }

  function formatCountdown(target: Date): string {
    const diff = target.getTime() - Date.now()
    if (diff <= 0) return ""
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
    return `${minutes}m ${seconds}s`
  }

  useEffect(() => {
    if (!nextClass?.start_time || !nextClass?.end_time) return
    const start = new Date(nextClass.start_time)
    const end = new Date(nextClass.end_time)
    const tick = () => {
      setCountdown(formatCountdown(start))
      setClassStatus(getClassStatus(start, end))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextClass])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setRole(data.role)
      })
    supabase
      .from("classes")
      .select("*")
      .eq("is_active", true)
      .order("start_time", { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setNextClass(data[0])
      })
    supabase
      .from("live_classes")
      .select("*")
      .eq("is_live", true)
      .not("join_link", "is", null)
      .limit(1)
      .then(({ data, error }) => {
        if (error) console.error("ScheduleSection live_classes error:", error)
        if (data && data.length > 0) setNextLiveClass(data[0])
      })
  }, [user])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
      tl.from(bgGlowRef.current, { opacity: 0, scale: 0.8, duration: 1.2, ease: "power3.out" })
      tl.from(titleRef.current, { y: 30, opacity: 0, duration: 0.9, ease: "power4.out" }, "-=0.6")
      tl.from(cardRef.current, { y: 60, opacity: 0, rotateX: -4, transformPerspective: 800, duration: 1.2, ease: "power4.out" }, "-=0.4")
      const innerEls = cardRef.current?.querySelectorAll(".schedule-line")
      if (innerEls) {
        tl.from(innerEls, { y: 15, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }, "-=0.3")
      }
    })
    return () => ctx.revert()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResendMessage("")

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      const msg = signInError.message.toLowerCase()
      if (msg.includes("email not confirmed")) {
        setError("This account is not confirmed yet. Please contact admin or confirm the user in Supabase.")
      } else if (msg.includes("invalid login credentials")) {
        setError("Invalid email or password.")
      } else {
        setError("Login failed. Please check that this email is registered, confirmed, and has admin access.")
      }
      setLoading(false)
      return
    }

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (currentUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("access")
        .eq("id", currentUser.id)
        .maybeSingle()

      if (!profile?.access && currentUser.email !== "phys@teach.com") {
        await supabase.auth.signOut()
        setError("Your account is pending approval. Please wait for the teacher to grant you access.")
        setLoading(false)
        return
      }

      await ensureProfile(currentUser.id, currentUser.email ?? undefined)
      await updateLastLogin(currentUser.id)
    }

    setLoading(false)
  }

  const handleResendConfirmation = async () => {
    if (!email) return
    setResending(true)
    setResendMessage("")
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    })
    if (resendError) {
      setResendMessage(resendError.message)
    } else {
      setResendMessage("Confirmation email sent. Please check your inbox/spam.")
    }
    setResending(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setNextClass(null)
  }

  const recordingRequestNotice = (
    <p className="text-text-muted text-xs">
      Need a class recording? Email your payment receipt to{" "}
      <a href="mailto:phys@teach.com" className="text-text-primary underline hover:text-text-muted transition-colors">
        phys@teach.com
      </a>{" "}
      and request the recording.
    </p>
  )

  return (
    <section id="join" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden bg-bg">
      <div
        ref={bgGlowRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(199, 255, 61, 0.025) 0%, transparent 70%)" }}
      />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-text-muted mb-4">
            Join Live
          </p>
          <h2 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[0.9] mb-12">
            {user ? "Next class." : "Student login."}
          </h2>

          <div ref={cardRef} className="bg-bg-alt border border-border p-8 md:p-10 text-left" style={{ transformStyle: "preserve-3d" }}>
            {!user ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-dim mb-1.5">Email *</label>
                  <input type="email" placeholder="amal@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim transition-colors placeholder:text-text-dim" required />
                </div>
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-dim mb-1.5">Password *</label>
                  <input type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim transition-colors placeholder:text-text-dim" required />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                {error && error.includes("email is not confirmed") && (
                  <button type="button" onClick={handleResendConfirmation} disabled={resending}
                    className="text-xs text-text-muted underline hover:text-text-primary transition-colors">
                    {resending ? "Sending..." : "Resend confirmation email"}
                  </button>
                )}
                {resendMessage && <p className="text-sm text-accent-lime">{resendMessage}</p>}
                <button type="submit" disabled={loading}
                  className="w-full inline-flex items-center justify-center px-8 py-4 border border-border text-text-primary font-semibold text-sm uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-500 disabled:opacity-50">
                  {loading ? "Logging in..." : "Log In"}
                </button>
                <p className="text-text-dim text-[10px] text-center uppercase tracking-[0.15em]">
                  Don&apos;t have an account? <a href="#enroll" className="underline">Sign up</a>
                </p>
              </form>
            ) : (() => {
              const isAdmin = user.email === "phys@teach.com" || role === "super_admin" || role === "admin"
              if (isAdmin && nextLiveClass) {
                return (
                <div className="space-y-4 mb-8">
                  <div className="schedule-line">
                    <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-accent-lime mb-1">Live Now</p>
                    <p className="text-lg md:text-xl font-semibold text-text-primary">{nextLiveClass.title}</p>
                  </div>
                  {nextLiveClass.notes && (
                    <div className="schedule-line">
                      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">Notes</p>
                      <p className="text-sm text-text-muted">{nextLiveClass.notes}</p>
                    </div>
                  )}
                  <div className="schedule-line">
                    <a href={nextLiveClass.join_link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-8 py-4 bg-primary text-white font-semibold text-sm uppercase tracking-wider rounded-none hover:opacity-90 transition-all duration-500">
                      Join Live Class
                    </a>
                  </div>
                </div>
                )
              }
              if (isAdmin) {
                return (
                <div className="schedule-line text-center py-8 space-y-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-dim mb-1">Info</p>
                  <p className="text-text-muted">
                    You are logged in as an admin. Use the Admin dashboard to manage students, payments, access, and live classes.
                  </p>
                  <div className="pt-4">
                    <a
                      href="/admin"
                      className="inline-flex items-center justify-center px-8 py-3 border border-border text-text-primary font-semibold text-xs uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-500"
                    >
                      Open Admin Dashboard
                    </a>
                  </div>
                </div>
                )
              }
              if (nextLiveClass) {
                return (
                <div className="space-y-4 mb-8">
                  <div className="schedule-line">
                    <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-accent-lime mb-1">Live Now</p>
                    <p className="text-lg md:text-xl font-semibold text-text-primary">{nextLiveClass.title}</p>
                  </div>
                  {nextLiveClass.notes && (
                    <div className="schedule-line">
                      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">Notes</p>
                      <p className="text-sm text-text-muted">{nextLiveClass.notes}</p>
                    </div>
                  )}
                  <div className="schedule-line">
                    <a href={nextLiveClass.join_link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-8 py-4 bg-primary text-white font-semibold text-sm uppercase tracking-wider rounded-none hover:opacity-90 transition-all duration-500">
                      Join Live Class
                    </a>
                  </div>
                  <div className="schedule-line pt-6 border-t border-border">
                    {recordingRequestNotice}
                  </div>
                </div>
                )
              }
              if (nextClass) {
                const start = nextClass.start_time ? new Date(nextClass.start_time) : null
                const end = nextClass.end_time ? new Date(nextClass.end_time) : null
                return (
              <div className="space-y-6 mb-8">
                <div className="schedule-line">
                  <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">Topic</p>
                  <p className="text-lg md:text-xl font-semibold text-text-primary">{nextClass.topic}</p>
                </div>
                {nextClass.curriculum && (
                  <div className="schedule-line">
                    <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">Curriculum</p>
                    <p className="text-sm text-text-muted">{nextClass.curriculum}</p>
                  </div>
                )}
                {start && (
                  <div className="schedule-line">
                    <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">Date</p>
                    <p className="text-sm text-text-muted">{start.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                )}
                <div className="schedule-line">
                  <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">Time</p>
                  <p className="text-sm text-text-muted">
                    {start?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}
                    {end ? ` — ${end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}` : ""}
                  </p>
                </div>
                <div className="schedule-line">
                  <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">Platform</p>
                  <p className="text-sm text-text-muted">Google Meet</p>
                </div>

                {classStatus === "upcoming" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="schedule-line text-center py-6 space-y-3"
                  >
                    <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-accent-lime">Starts in</p>
                    <p className="text-3xl md:text-4xl font-bold text-text-primary tabular-nums tracking-tight">
                      {countdown}
                    </p>
                    <p className="text-xs text-text-muted">
                      Class starts at{" "}
                      <span className="text-text-primary font-medium">
                        {start?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </p>
                    <div className="pt-4">
                      <a href={nextClass.meet_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-2.5 border border-border text-text-muted text-xs uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-300">
                        Open Meet Link Early
                      </a>
                    </div>
                  </motion.div>
                )}

                {classStatus === "live" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="schedule-line"
                  >
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-accent-lime/40 via-accent-lime/20 to-accent-lime/40 rounded-none blur-md opacity-75 group-hover:opacity-100 transition-all duration-500" />
                      <a href={nextClass.meet_link} target="_blank" rel="noopener noreferrer"
                        className="relative flex items-center justify-center gap-3 w-full px-8 py-5 bg-bg text-accent-lime font-bold text-lg uppercase tracking-wider rounded-none border border-accent-lime/30 group-hover:bg-accent-lime/10 transition-all duration-500">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-lime opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-lime" />
                        </span>
                        Join Google Meet
                      </a>
                    </div>
                  </motion.div>
                )}

                {classStatus === "ended" && (
                  <div className="schedule-line text-center py-6">
                    <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-2">Class ended</p>
                    <p className="text-sm text-text-muted">This class has already finished.</p>
                  </div>
                )}

                <div className="schedule-line pt-6 border-t border-border">
                  {recordingRequestNotice}
                </div>
                </div>
                )
              }
              return (
                <div className="schedule-line text-center py-8 space-y-4">
                  <p className="text-text-muted">No upcoming class scheduled.</p>
                  {recordingRequestNotice}
                </div>
              )
            })()}

            {user && (
              <div className="schedule-line mt-6 pt-6 border-t border-border">
                <button onClick={handleLogout}
                  className="w-full inline-flex items-center justify-center px-8 py-3 border border-border text-text-muted font-semibold text-xs uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-500">
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
