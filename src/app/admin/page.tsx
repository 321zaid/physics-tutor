"use client"

import { useEffect, useState, useCallback } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, type Profile, type Class, type Recording } from "@/lib/supabase"

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const [classes, setClasses] = useState<Class[]>([])
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [students, setStudents] = useState<Profile[]>([])

  const [topic, setTopic] = useState("")
  const [classDate, setClassDate] = useState("")
  const [classTime, setClassTime] = useState("")
  const [meetLink, setMeetLink] = useState("")

  const [recTitle, setRecTitle] = useState("")
  const [recDate, setRecDate] = useState("")
  const [recLink, setRecLink] = useState("")
  const [recTopic, setRecTopic] = useState("")

  const [payments, setPayments] = useState<Record<string, string>>({})

  const loadData = useCallback(async () => {
    const [c, r, s, p] = await Promise.all([
      supabase.from("classes").select("*").order("date", { ascending: false }),
      supabase.from("recordings").select("*").order("date", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("payments").select("*"),
    ])
    if (c.data) setClasses(c.data)
    if (r.data) setRecordings(r.data)
    if (s.data) setStudents(s.data)
    if (p.data) {
      const map: Record<string, string> = {}
      for (const pay of p.data) {
        map[pay.student_id] = pay.status
      }
      setPayments(map)
    }
  }, [])

  const toggleAccess = async (studentId: string, currentAccess: boolean | null) => {
    await supabase.from("profiles").update({ access: !currentAccess }).eq("id", studentId)
    loadData()
  }

  const updateRole = async (studentId: string, newRole: string) => {
    await supabase.from("profiles").update({ role: newRole }).eq("id", studentId)
    loadData()
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) {
        const { data: p } = await supabase.from("profiles").select("*").eq("id", u.id).single()
        setProfile(p)
        if (p?.role === "admin" || p?.role === "super_admin") {
          loadData()
        }
      }
      setLoading(false)
    })
  }, [loadData])

  const createClass = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from("classes").insert({
      topic, date: classDate, time: classTime, meet_link: meetLink, created_by: user!.id,
    })
    setTopic(""); setClassDate(""); setClassTime(""); setMeetLink("")
    loadData()
  }

  const deleteClass = async (id: string) => {
    await supabase.from("classes").delete().eq("id", id)
    loadData()
  }

  const createRecording = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from("recordings").insert({
      title: recTitle, date: recDate, link: recLink, topic: recTopic || null,
    })
    setRecTitle(""); setRecDate(""); setRecLink(""); setRecTopic("")
    loadData()
  }

  const deleteRecording = async (id: string) => {
    await supabase.from("recordings").delete().eq("id", id)
    loadData()
  }

  const togglePayment = async (studentId: string, currentStatus: string) => {
    const newStatus = currentStatus === "paid" ? "pending" : "paid"
    const { data: existing } = await supabase.from("payments").select("*").eq("student_id", studentId).maybeSingle()
    if (existing) {
      await supabase.from("payments").update({ status: newStatus }).eq("student_id", studentId)
    } else {
      await supabase.from("payments").insert({ student_id: studentId, status: newStatus, amount: 0 })
    }
    loadData()
  }

  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center"><p className="text-text-muted">Loading...</p></div>
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Access Denied</h1>
          <p className="text-text-muted">Please log in first.</p>
        </div>
      </div>
    )
  }

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Access Denied</h1>
          <p className="text-text-muted">Login succeeded, but this account does not have admin permission.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <section className="bg-bg-alt border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Create Class</h2>
            <form onSubmit={createClass} className="space-y-3">
              <input placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" required />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={classDate} onChange={(e) => setClassDate(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" required />
                <input type="time" value={classTime} onChange={(e) => setClassTime(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" required />
              </div>
              <input placeholder="Google Meet link" value={meetLink} onChange={(e) => setMeetLink(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" required />
              <button type="submit" className="w-full px-8 py-3 border border-border text-text-primary font-semibold text-sm uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-500">
                Publish Class
              </button>
            </form>

            <h3 className="text-sm font-semibold text-text-primary mt-6 mb-3">Existing Classes</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {classes.map((c) => (
                <div key={c.id} className="flex items-center justify-between bg-bg px-4 py-3 border border-border text-sm">
                  <div>
                    <p className="text-text-primary font-medium">{c.topic}</p>
                    <p className="text-text-muted text-xs">{c.date} at {c.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.is_active && <span className="text-[10px] uppercase tracking-wider text-green-400">Active</span>}
                    <button onClick={() => deleteClass(c.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-bg-alt border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Add Recording</h2>
            <form onSubmit={createRecording} className="space-y-3">
              <input placeholder="Recording title" value={recTitle} onChange={(e) => setRecTitle(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" required />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={recDate} onChange={(e) => setRecDate(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" required />
                <input placeholder="Topic" value={recTopic} onChange={(e) => setRecTopic(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" />
              </div>
              <input placeholder="Google Drive link" value={recLink} onChange={(e) => setRecLink(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" required />
              <button type="submit" className="w-full px-8 py-3 border border-border text-text-primary font-semibold text-sm uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-500">
                Add Recording
              </button>
            </form>

            <h3 className="text-sm font-semibold text-text-primary mt-6 mb-3">Existing Recordings</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {recordings.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-bg px-4 py-3 border border-border text-sm">
                  <div>
                    <p className="text-text-primary font-medium">{r.title}</p>
                    <p className="text-text-muted text-xs">{r.date}</p>
                  </div>
                  <button onClick={() => deleteRecording(r.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-bg-alt border border-border p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Students &amp; Payments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wider text-text-dim">
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Grade</th>
                  <th className="py-3 pr-4">Role</th>
                  <th className="py-3 pr-4">Access</th>
                  <th className="py-3 pr-4">Payment</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.filter((s) => s.role !== "super_admin").map((s) => (
                  <tr key={s.id} className="border-b border-border">
                    <td className="py-3 pr-4 text-text-primary">{s.name}</td>
                    <td className="py-3 pr-4 text-text-muted">{s.email}</td>
                    <td className="py-3 pr-4 text-text-muted">{s.grade_board || "-"}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] uppercase tracking-wider ${s.role === "admin" ? "text-blue-400" : "text-text-dim"}`}>
                        {s.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <button onClick={() => toggleAccess(s.id, s.access)}
                        className={`text-[10px] uppercase tracking-wider underline ${s.access ? "text-green-400" : "text-red-400"}`}>
                        {s.access ? "Enabled" : "Disabled"}
                      </button>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] uppercase tracking-wider ${payments[s.id] === "paid" ? "text-green-400" : "text-yellow-400"}`}>
                        {payments[s.id] === "paid" ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 flex flex-wrap gap-2">
                      <button onClick={() => togglePayment(s.id, payments[s.id] || "pending")}
                        className="text-xs text-text-primary hover:text-text-muted underline">
                        {payments[s.id] === "paid" ? "Unpaid" : "Paid"}
                      </button>
                      {profile?.role === "super_admin" && (
                        <>
                          {s.role === "admin" ? (
                            <button onClick={() => updateRole(s.id, "student")}
                              className="text-xs text-red-400 hover:text-red-300 underline">
                              Remove Admin
                            </button>
                          ) : (
                            <button onClick={() => updateRole(s.id, "admin")}
                              className="text-xs text-blue-400 hover:text-blue-300 underline">
                              Make Admin
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
