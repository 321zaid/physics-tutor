"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

export default function RecordingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [access, setAccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) {
        const { data: p } = await supabase.from("profiles").select("access").eq("id", u.id).single()
        setAccess(p?.access ?? null)
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center"><p className="text-text-muted animate-pulse">Loading...</p></div>
  }

  return (
    <div className="min-h-screen bg-bg pt-32 pb-16">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Class Recordings</h1>
        <div className="bg-bg-alt border border-border p-8">
          {!user ? (
            <div className="space-y-6">
              <p className="text-text-muted leading-relaxed">
                Need a class recording? Log in to request access.
              </p>
              <a href="#join" className="inline-flex items-center justify-center px-8 py-3.5 border border-border text-text-primary font-semibold text-sm uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-500">
                Log In
              </a>
            </div>
          ) : !access ? (
            <p className="text-yellow-400 leading-relaxed">
              Your access is pending. Please contact the teacher after payment.
            </p>
          ) : (
            <p className="text-text-muted leading-relaxed">
              Need a class recording? Email your payment receipt to{" "}
              <a href="mailto:abbadea81@gmail.com" className="text-text-primary underline hover:text-text-muted transition-colors">
                abbadea81@gmail.com
              </a>{" "}
              and request the recording.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
