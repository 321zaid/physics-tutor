"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, type LiveClass } from "@/lib/supabase"

export function LiveClassBanner() {
  const [user, setUser] = useState<User | null>(null)
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null)
  const [access, setAccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) {
        const { data: p } = await supabase.from("profiles").select("access, subject, curriculum").eq("id", u.id).single()
        if (!p) { setLoading(false); return }
        setAccess(p.access)
        if (p.access && p.subject && p.curriculum) {
          const { data: lc } = await supabase
            .from("live_classes")
            .select("*")
            .eq("subject", p.subject)
            .eq("curriculum", p.curriculum)
            .eq("is_live", true)
            .not("join_link", "is", null)
            .limit(1)
            .maybeSingle()
          if (lc) setLiveClass(lc)
        }
      }
      setLoading(false)
    })
  }, [])

  if (loading) return null
  if (!user) return null

  if (access === false) {
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

  if (!liveClass) return null

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
            <span className="text-[10px] uppercase tracking-wider text-text-dim">{liveClass.subject} &middot; {liveClass.curriculum}</span>
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
