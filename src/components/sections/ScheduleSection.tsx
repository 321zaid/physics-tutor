"use client"

import { useEffect, useRef, useState } from "react"
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
      .then(({ data }) => {
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

      if (!profile?.access && currentUser.email !== "zaid123was@gmail.com") {
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
      <a href="mailto:abbadea81@gmail.com" className="text-text-primary underline hover:text-text-muted transition-colors">
        abbadea81@gmail.com
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
              const isAdmin = user.email === "zaid123was@gmail.com" || role === "super_admin" || role === "admin"
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
                return (
              <div className="space-y-4 mb-8">
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
                <div className="schedule-line grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">Start</p>
                    <p className="text-sm text-text-muted">{new Date(nextClass.start_time!).toLocaleString()}</p>
                  </div>
                  {nextClass.end_time && (
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">End</p>
                      <p className="text-sm text-text-muted">{new Date(nextClass.end_time).toLocaleString()}</p>
                    </div>
                  )}
                </div>
                <div className="schedule-line">
                  <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-1">Platform</p>
                  <p className="text-sm text-text-muted">Google Meet</p>
                </div>
                <div className="schedule-line">
                  <a href={nextClass.meet_link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-8 py-4 bg-primary text-white font-semibold text-sm uppercase tracking-wider rounded-none hover:opacity-90 transition-all duration-500">
                    Join Google Meet
                  </a>
                </div>
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
