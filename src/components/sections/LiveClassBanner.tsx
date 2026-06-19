"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, type LiveClass } from "@/lib/supabase"

export function LiveClassBanner() {
  const [user, setUser] = useState<User | null>(null)
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null)
  const [access, setAccess] = useState<boolean | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) {
        const { data: p } = await supabase
          .from("profiles")
          .select("role, access, subject, curriculum")
          .eq("id", u.id)
          .single()
        if (!p) { setLoading(false); return }
        setRole(p.role)
        setAccess(p.access)
        if (u.email !== "zaid123was@gmail.com" && p.role !== "super_admin" && p.role !== "admin" && p.access) {
          let query = supabase
            .from("live_classes")
            .select("*")
            .eq("is_live", true)
            .not("join_link", "is", null)
          if (p.curriculum) {
            query = query.or(`curriculum.eq.${p.curriculum},curriculum.is.null`)
          }
          const { data: lc } = await query.limit(1).maybeSingle()
          if (lc) setLiveClass(lc)
        }
      }
      setLoading(false)
    })
  }, [])

  if (loading) return null
  if (!user) return null

  const isAdmin = role === "super_admin" || role === "admin" || user.email === "zaid123was@gmail.com"

  if (isAdmin) {
    return (
      <div className="bg-bg-alt border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-dim mb-1">Info</p>
              <p className="text-sm text-text-muted">
                You are logged in as an admin. Use the Admin dashboard to manage students, payments, access, and live classes.
              </p>
            </div>
            <a
              href="/admin"
              className="px-6 py-2.5 border border-border text-text-primary text-xs font-semibold uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-300 shrink-0"
            >
              Open Admin Dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (!access) {
    return (
      <div className="bg-bg-alt border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-yellow-400">
              Your access is pending. Please contact the teacher after payment.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!liveClass) {
    return (
      <div className="bg-bg-alt border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-text-muted">
              No live class is available for your curriculum right now.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-alt border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
            </span>
            <p className="text-sm text-text-primary font-medium">
              <span className="text-text-muted">Live now:</span> {liveClass.title}
            </p>
            <span className="text-[10px] uppercase tracking-wider text-text-dim">{liveClass.curriculum}</span>
          </div>
          <a
            href={liveClass.join_link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 border border-green-500 text-green-400 text-xs font-semibold uppercase tracking-wider rounded-none hover:bg-green-500/10 transition-all duration-300 shrink-0"
          >
            Join Live Class
          </a>
        </div>
      </div>
    </div>
  )
}
