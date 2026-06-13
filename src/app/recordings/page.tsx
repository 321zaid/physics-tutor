"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, type Recording } from "@/lib/supabase"

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user
      setUser(u ?? null)
      if (u) {
        const { data: r } = await supabase.from("recordings").select("*").order("date", { ascending: false })
        if (r) setRecordings(r)
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center"><p className="text-text-muted">Loading...</p></div>
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Recordings</h1>
          <p className="text-text-muted mb-6">Please log in to view class recordings.</p>
          <a href="#join" className="inline-flex items-center justify-center px-8 py-3.5 border border-border text-text-primary font-semibold text-sm uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-500">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Class Recordings</h1>
        <p className="text-text-muted text-sm mb-10">Watch past classes at your own pace.</p>

        {recordings.length === 0 ? (
          <p className="text-text-muted">No recordings available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recordings.map((rec) => (
              <a
                key={rec.id}
                href={rec.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-bg-alt border border-border p-6 hover:bg-surface-hover transition-colors"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-2">
                  {rec.date}
                </p>
                <h3 className="text-lg font-semibold text-text-primary mb-1">{rec.title}</h3>
                {rec.topic && (
                  <p className="text-sm text-text-muted">{rec.topic}</p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
