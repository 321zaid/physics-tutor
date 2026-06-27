"use client"

import { useEffect, useState, useCallback, useMemo, type Dispatch, type SetStateAction } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { supabase, type Profile, type LiveClass, type Class } from "@/lib/supabase"
import AnimatedToggle from "@/components/AnimatedToggle"

const CURRICULA = ["IGCSE", "A-Level", "IB", "AP", "CBSE", "ICSE", "GCSE", "Other", "Edexcel IGCSE (O/L)", "Cambridge IGCSE (O/L)", "Edexcel AS Level", "Cambridge AS Level", "Edexcel A2 Level", "Cambridge A2 Level"]
const INPUT_CLASS = "w-full px-3 py-2 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim"
const CELL_CLASS = "py-2.5 px-3 text-sm"
const ZAID_EMAIL = "phys@teach.com"

function formatDate(d: string | null | undefined) {
  if (!d) return "-"
  try { return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) } catch { return "-" }
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const [students, setStudents] = useState<Profile[]>([])
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([])
  const [classes, setClasses] = useState<Class[]>([])

  const [search, setSearch] = useState("")
  const [filterCurriculum, setFilterCurriculum] = useState("")
  const [filterFeePaid, setFilterFeePaid] = useState("")
  const [filterAccess, setFilterAccess] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Profile>>({})
  const [dbError, setDbError] = useState("")

  const [liveForm, setLiveForm] = useState({
    title: "", curriculum: "", join_link: "", is_live: false,
    notes: "",
  })
  const [editingLiveId, setEditingLiveId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setDbError("")
    const [s, l, c] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("live_classes").select("*").order("created_at", { ascending: false }),
      supabase.from("classes").select("*").order("start_time", { ascending: false }),
    ])
    if (s.error) setDbError((prev) => prev + "Profiles error: " + s.error.message + "\n")
    if (l.error) setDbError((prev) => prev + "Live classes error: " + l.error.message + "\n")
    if (c.error) setDbError((prev) => prev + "Classes error: " + c.error.message + "\n")
    if (s.data) setStudents(s.data)
    if (l.data) setLiveClasses(l.data)
    if (c.data) setClasses(c.data)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) {
        const { data: p } = await supabase.from("profiles").select("*").eq("id", u.id).single()
        setProfile(p)
        if (u?.email === ZAID_EMAIL || p?.role === "admin" || p?.role === "super_admin") loadData()
      }
      setLoading(false)
    })
  }, [loadData])

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (search) {
        const q = search.toLowerCase()
        if (!s.name.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q)) return false
      }
      if (filterCurriculum && s.curriculum !== filterCurriculum) return false
      if (filterFeePaid === "yes" && !s.fee_paid) return false
      if (filterFeePaid === "no" && s.fee_paid) return false
      if (filterAccess === "yes" && !s.access) return false
      if (filterAccess === "no" && s.access) return false
      return true
    })
  }, [students, search, filterCurriculum, filterFeePaid, filterAccess])

  const isSuperAdmin = profile?.role === "super_admin"
  const isZaid = profile?.email === ZAID_EMAIL
  const isAdmin = profile?.role === "admin" || isSuperAdmin

  const startEdit = (s: Profile) => {
    if (s.email === ZAID_EMAIL && !isZaid) return
    setEditingId(s.id)
    setEditForm({
      name: s.name, curriculum: s.curriculum,
      fee_paid: s.fee_paid, access: s.access, notes: s.notes,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEdit = async (id: string) => {
    const updates: Record<string, unknown> = {}
    if (isZaid && editForm.name !== undefined) updates.name = editForm.name
    if (editForm.curriculum !== undefined) updates.curriculum = editForm.curriculum
    if (editForm.fee_paid !== undefined) updates.fee_paid = editForm.fee_paid
    if (editForm.access !== undefined) updates.access = editForm.access
    if (editForm.notes !== undefined) updates.notes = editForm.notes
    await supabase.from("profiles").update(updates).eq("id", id)
    cancelEdit()
    loadData()
  }

  const handleInlineToggle = async (id: string, field: string, value: boolean) => {
    const { error } = await supabase.from("profiles").update({ [field]: value }).eq("id", id)
    if (error) setDbError(`Failed to update ${field}: ${error.message}`)
    loadData()
  }

  const handleRoleToggle = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "student" : "admin"
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", id)
    if (error) setDbError(`Failed to update role: ${error.message}`)
    loadData()
  }

  const updateRole = async (id: string, role: string) => {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id)
    if (error) setDbError(`Failed to update role: ${error.message}`)
    loadData()
  }

  const createLive = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from("live_classes").insert({
      title: liveForm.title, curriculum: liveForm.curriculum || null,
      join_link: liveForm.join_link || null, is_live: liveForm.is_live,
      notes: liveForm.notes || null, created_by: user!.id,
    })
    if (error) { setDbError((prev) => prev + "Failed to create live class: " + error.message + "\n"); return }
    setLiveForm({ title: "", curriculum: "", join_link: "", is_live: false, notes: "" })
    loadData()
  }

  const updateLive = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLiveId) return
    const { error } = await supabase.from("live_classes").update({
      title: liveForm.title, curriculum: liveForm.curriculum || null,
      join_link: liveForm.join_link || null, is_live: liveForm.is_live,
      notes: liveForm.notes || null,
    }).eq("id", editingLiveId)
    if (error) { setDbError((prev) => prev + "Failed to update live class: " + error.message + "\n"); return }
    setEditingLiveId(null)
    setLiveForm({ title: "", curriculum: "", join_link: "", is_live: false, notes: "" })
    loadData()
  }

  const editLive = (lc: LiveClass) => {
    setEditingLiveId(lc.id)
    setLiveForm({
      title: lc.title, curriculum: lc.curriculum,
      join_link: lc.join_link, is_live: lc.is_live ?? false,
      notes: lc.notes ?? "",
    })
  }

  const deleteLive = async (id: string) => {
    const { error } = await supabase.from("live_classes").delete().eq("id", id)
    if (error) setDbError((prev) => prev + "Failed to delete live class: " + error.message + "\n")
    loadData()
  }

  const toggleLive = async (id: string, current: boolean | null) => {
    const { error } = await supabase.from("live_classes").update({ is_live: !current }).eq("id", id)
    if (error) setDbError((prev) => prev + "Failed to toggle live class: " + error.message + "\n")
    loadData()
  }

  const downloadCSV = () => {
    const headers = ["Name", "Email", "Signup Date", "Last Login", "Curriculum", "Fee Paid", "Access", "Admin", "Notes"]
    const rows = filteredStudents.map((s) => [
      s.name, s.email, formatDate(s.created_at), formatDate(s.last_login),
      s.curriculum || s.grade_board || "", s.fee_paid ? "Yes" : "No",
      s.access ? "Yes" : "No",
      s.email === ZAID_EMAIL ? "Permanent Super Admin" : s.role === "admin" || s.role === "super_admin" ? "Yes" : "No",
      s.notes ?? "",
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `students_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center"><p className="text-text-muted animate-pulse">Loading...</p></div>
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Access Denied</h1>
          <p className="text-text-muted">Please log in first.</p>
        </div>
      </div>
    )
  }

  if (user?.email !== ZAID_EMAIL && profile?.role !== "admin" && profile?.role !== "super_admin") {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Access Denied</h1>
          <p className="text-text-muted">Login succeeded, but this account does not have admin permission.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
            <p className="text-text-muted text-xs mt-1 tracking-wider uppercase">
              {profile?.email} &middot; {profile?.role}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/"
              className="px-5 py-2.5 border border-border text-text-primary text-xs font-semibold uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-300">
              ← Back to Site
            </Link>
            {isAdmin && (
              <button onClick={downloadCSV}
                className="px-5 py-2.5 border border-border text-text-primary text-xs font-semibold uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-300">
                Export CSV
              </button>
            )}
          </div>
        </div>

          {dbError && (
            <div className="mb-6 p-4 border border-red-400/50 bg-red-400/5 text-red-400 text-xs">
              <pre className="whitespace-pre-wrap">{dbError}</pre>
            </div>
          )}

          {/* STUDENT TABLE */}
        <section className="bg-bg-alt border border-border mb-8">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Students</h2>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-border flex flex-wrap gap-3">
            <input placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 px-3 py-2 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" />
            <select value={filterCurriculum} onChange={(e) => setFilterCurriculum(e.target.value)}
              className="px-3 py-2 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim">
              <option value="">All Curricula</option>
              {CURRICULA.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterFeePaid} onChange={(e) => setFilterFeePaid(e.target.value)}
              className="px-3 py-2 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim">
              <option value="">Fee: All</option>
              <option value="yes">Paid</option>
              <option value="no">Pending</option>
            </select>
            <select value={filterAccess} onChange={(e) => setFilterAccess(e.target.value)}
              className="px-3 py-2 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim">
              <option value="">Access: All</option>
              <option value="yes">Enabled</option>
              <option value="no">Disabled</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wider text-text-dim">
                  <th className={CELL_CLASS}>Name</th>
                  <th className={CELL_CLASS}>Email</th>
                  <th className={CELL_CLASS}>Signed Up</th>
                  <th className={CELL_CLASS}>Last Login</th>
                  <th className={CELL_CLASS}>Curriculum</th>
                  <th className={CELL_CLASS}>Fee</th>
                  <th className={CELL_CLASS}>Access</th>
                  <th className={CELL_CLASS}>Admin</th>
                  <th className={CELL_CLASS}>Notes</th>
                  <th className={CELL_CLASS}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-text-muted text-sm">No students found.</td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const isEditing = editingId === s.id
                    return (
                      <tr key={s.id} className="border-b border-border hover:bg-bg/50 transition-colors">
                        {isEditing ? (
                          <>
                            <td className={CELL_CLASS}>
                              {isZaid ? (
                                <input value={editForm.name ?? ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className={INPUT_CLASS} />
                              ) : (
                                <span className="text-text-muted">{s.name}</span>
                              )}
                            </td>
                            <td className={CELL_CLASS + " text-text-muted"}>{s.email}</td>
                            <td className={CELL_CLASS + " text-text-muted"}>{formatDate(s.created_at)}</td>
                            <td className={CELL_CLASS + " text-text-muted"}>{formatDate(s.last_login)}</td>
                            <td className={CELL_CLASS}>
                              {isZaid ? (
                                <select value={editForm.curriculum ?? ""} onChange={(e) => setEditForm({ ...editForm, curriculum: e.target.value })}
                                  className={INPUT_CLASS}>
                                  <option value="">-</option>
                                  {CURRICULA.map((cur) => <option key={cur} value={cur}>{cur}</option>)}
                                </select>
                              ) : (
                                <span className="text-text-muted">{s.curriculum || "-"}</span>
                              )}
                            </td>
                            <td className={CELL_CLASS}>
                              <AnimatedToggle
                                enabled={!!editForm.fee_paid}
                                onChange={() => setEditForm({ ...editForm, fee_paid: !editForm.fee_paid })}
                                labelOn="Paid"
                                labelOff="Pending"
                                colorOn="text-green-400"
                                colorOff="text-yellow-400"
                              />
                            </td>
                            <td className={CELL_CLASS}>
                              <AnimatedToggle
                                enabled={!!editForm.access}
                                onChange={() => setEditForm({ ...editForm, access: !editForm.access })}
                                disabled={s.email === ZAID_EMAIL}
                                labelOn="Enabled"
                                labelOff="Disabled"
                                colorOn="text-green-400"
                                colorOff="text-red-400"
                              />
                            </td>
                            <td className={CELL_CLASS + " text-text-dim"}>{s.email === ZAID_EMAIL ? "Permanent" : s.role}</td>
                            <td className={CELL_CLASS}>
                              <input value={editForm.notes ?? ""} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                className={INPUT_CLASS} placeholder="Notes..." />
                            </td>
                            <td className={CELL_CLASS}>
                              <div className="flex gap-2">
                                <button onClick={() => saveEdit(s.id)} className="text-xs text-green-400 hover:text-green-300 underline">Save</button>
                                <button onClick={cancelEdit} className="text-xs text-text-muted hover:text-text-primary underline">Cancel</button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className={CELL_CLASS + " text-text-primary font-medium"}>{s.name}</td>
                            <td className={CELL_CLASS + " text-text-muted"}>{s.email}</td>
                            <td className={CELL_CLASS + " text-text-muted"}>{formatDate(s.created_at)}</td>
                            <td className={CELL_CLASS + " text-text-muted"}>{formatDate(s.last_login)}</td>
                            <td className={CELL_CLASS + " text-text-muted"}>{s.curriculum || s.grade_board || "-"}</td>
                            <td className={CELL_CLASS}>
                              <AnimatedToggle
                                enabled={!!s.fee_paid}
                                onChange={() => handleInlineToggle(s.id, "fee_paid", !s.fee_paid)}
                                disabled={!isZaid}
                                labelOn="Paid"
                                labelOff="Pending"
                                colorOn="text-green-400"
                                colorOff="text-yellow-400"
                              />
                            </td>
                            <td className={CELL_CLASS}>
                              <AnimatedToggle
                                enabled={!!s.access}
                                onChange={() => handleInlineToggle(s.id, "access", !s.access)}
                                disabled={!isZaid || s.email === ZAID_EMAIL}
                                labelOn="Enabled"
                                labelOff="Disabled"
                                colorOn="text-green-400"
                                colorOff="text-red-400"
                              />
                            </td>
                            <td className={CELL_CLASS}>
                              {s.email === ZAID_EMAIL ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                                  Permanent Super Admin
                                </span>
                              ) : (
                                <AnimatedToggle
                                  enabled={s.role === "admin" || s.role === "super_admin"}
                                  onChange={() => handleRoleToggle(s.id, s.role)}
                                  disabled={!isZaid}
                                  labelOn="Admin"
                                  labelOff="Student"
                                  colorOn="text-blue-400"
                                  colorOff="text-text-dim"
                                />
                              )}
                            </td>
                            <td className={CELL_CLASS + " text-text-muted max-w-[120px] truncate"} title={s.notes ?? ""}>{s.notes || "-"}</td>
                            <td className={CELL_CLASS}>
                              {s.email === ZAID_EMAIL ? (
                                <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400">Permanent Super Admin</span>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  <button onClick={() => startEdit(s)} className="text-xs text-text-primary hover:text-text-muted underline">Edit</button>
                                  {isZaid && s.role !== "super_admin" && (
                                    s.role === "admin"
                                      ? <button onClick={() => updateRole(s.id, "student")} className="text-xs text-red-400 hover:text-red-300 underline">Demote</button>
                                      : <button onClick={() => updateRole(s.id, "admin")} className="text-xs text-blue-400 hover:text-blue-300 underline">Promote</button>
                                  )}
                                </div>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-border text-[10px] text-text-dim tracking-wider uppercase">
            {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""}
          </div>
        </section>

        {/* LIVE CLASSES */}
        <section className="bg-bg-alt border border-border mb-8">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Live Classes</h2>
          </div>

          <form onSubmit={editingLiveId ? updateLive : createLive} className="p-5 border-b border-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-dim mb-1">Title</label>
              <input value={liveForm.title} onChange={(e) => setLiveForm({ ...liveForm, title: e.target.value })} required
                className={INPUT_CLASS} placeholder="e.g. Forces & Motion Review" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-dim mb-1">Curriculum</label>
              <select value={liveForm.curriculum} onChange={(e) => setLiveForm({ ...liveForm, curriculum: e.target.value })} required
                className={INPUT_CLASS}>
                <option value="">Select...</option>
                {CURRICULA.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-dim mb-1">Join Link</label>
              <input value={liveForm.join_link} onChange={(e) => setLiveForm({ ...liveForm, join_link: e.target.value })} required
                className={INPUT_CLASS} placeholder="Google Meet link" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-dim mb-1">Notes</label>
              <input value={liveForm.notes} onChange={(e) => setLiveForm({ ...liveForm, notes: e.target.value })}
                className={INPUT_CLASS} placeholder="Optional notes..." />
            </div>
            <div className="flex items-end gap-3">
              <AnimatedToggle
                enabled={liveForm.is_live}
                onChange={() => setLiveForm({ ...liveForm, is_live: !liveForm.is_live })}
                labelOn="Live"
                labelOff="Offline"
                colorOn="text-green-400"
                colorOff="text-text-dim"
              />
              <button type="submit" className="px-5 py-2 border border-border text-text-primary text-xs font-semibold uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-300">
                {editingLiveId ? "Update" : "Create"}
              </button>
              {editingLiveId && (
                <button type="button" onClick={() => { setEditingLiveId(null); setLiveForm({ title: "", curriculum: "", join_link: "", is_live: false, notes: "" }) }}
                  className="px-5 py-2 border border-border text-text-muted text-xs font-semibold uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-300">
                  Cancel
                </button>
              )}
            </div>
          </form>

          {liveClasses.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">No live classes yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {liveClasses.map((lc) => (
                <div key={lc.id} className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${lc.is_live ? "bg-green-400" : "bg-text-dim"}`} />
                      <span className="text-sm font-medium text-text-primary">{lc.title}</span>
                      <span className="text-[10px] uppercase tracking-wider text-text-dim">{lc.curriculum}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      {lc.join_link}
                      {lc.notes && <> &middot; {lc.notes}</>}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => toggleLive(lc.id, lc.is_live)}
                      className={`text-[10px] uppercase tracking-wider underline ${lc.is_live ? "text-green-400" : "text-text-dim"}`}>
                      {lc.is_live ? "LIVE" : "Offline"}
                    </button>
                    <button onClick={() => editLive(lc)} className="text-xs text-text-primary hover:text-text-muted underline">Edit</button>
                    <button onClick={() => deleteLive(lc.id)} className="text-xs text-red-400 hover:text-red-300 underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CLASS MANAGEMENT */}
        <ClassesSection loadData={loadData} classes={classes} setDbError={setDbError} user={user} />

      </div>
    </div>
  )
}

function ClassesSection({ loadData: parentLoad, classes, setDbError, user }: { loadData: () => void; classes: Class[]; setDbError: Dispatch<SetStateAction<string>>; user: User | null }) {
  const [topic, setTopic] = useState("")
  const [curriculum, setCurriculum] = useState("")
  const [classDate, setClassDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [meetLink, setMeetLink] = useState("")
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  function formatDateInput(value: string) {
    const digits = value.replace(/\D/g, "")
    let out = ""
    if (digits.length > 0) out = digits.slice(0, 4)
    if (digits.length > 4) out += "/" + digits.slice(4, 6)
    if (digits.length > 6) out += "/" + digits.slice(6, 8)
    return out
  }

  function formatTimeInput(value: string) {
    const digits = value.replace(/\D/g, "")
    let out = ""
    if (digits.length > 0) out = digits.slice(0, 2)
    if (digits.length > 2) out += ":" + digits.slice(2, 4)
    return out
  }

  function validateClassForm() {
    const timeRe = /^\d{2}:\d{2}$/
    if (!timeRe.test(startTime)) return "Start time must be in 24h format (e.g. 14:30)"
    if (!timeRe.test(endTime)) return "End time must be in 24h format (e.g. 15:30)"
    const st = startTime.split(":").map(Number)
    const et = endTime.split(":").map(Number)
    if (st[0] > 23 || st[1] > 59) return "Start time is invalid"
    if (et[0] > 23 || et[1] > 59) return "End time is invalid"
    if (st[0] === et[0] && st[1] >= et[1]) return "Start time must be before end time"
    return ""
  }

  function toDbTime(date: string, time: string) {
    if (!date || !time) return null
    const d = date.replace(/\//g, "-")
    return `${d}T${time}:00+05:30`
  }

  function toEndDbTime(startDate: string, startTime: string, endTime: string) {
    if (!startDate || !startTime || !endTime) return null
    const st = startTime.split(":").map(Number)
    const et = endTime.split(":").map(Number)
    const stMinutes = st[0] * 60 + st[1]
    const etMinutes = et[0] * 60 + et[1]
    const dayOffset = etMinutes <= stMinutes ? 1 : 0
    const base = new Date(startDate.replace(/\//g, "-") + "T" + endTime + ":00+05:30")
    base.setDate(base.getDate() + dayOffset)
    return base.toISOString()
  }

  const createClass = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(""); setFormSuccess("")
    const v = validateClassForm()
    if (v) { setFormError(v); return }
    setSubmitting(true)
    const { error } = await supabase.from("classes").insert({
      topic, curriculum: curriculum || null,
      start_time: toDbTime(classDate, startTime),
      end_time: toEndDbTime(classDate, startTime, endTime),
      meet_link: meetLink, is_active: true,
      created_by: user?.id ?? null,
    })
    setSubmitting(false)
    if (error) { setFormError("Failed to create class: " + error.message); parentLoad(); return }
    setTopic(""); setCurriculum(""); setClassDate(""); setStartTime(""); setEndTime(""); setMeetLink("")
    setFormSuccess("Class published successfully!")
    parentLoad()
  }

  const deleteClass = async (id: string) => {
    const { error } = await supabase.from("classes").delete().eq("id", id)
    if (error) setDbError((prev) => prev + "Failed to delete class: " + error.message + "\n")
    parentLoad()
  }

  function formatClassTime(d: string | null) {
    if (!d) return "-"
    try {
      const dt = new Date(d)
      const y = dt.getFullYear()
      const m = String(dt.getMonth() + 1).padStart(2, "0")
      const day = String(dt.getDate()).padStart(2, "0")
      let h = dt.getHours()
      const ampm = h >= 12 ? "PM" : "AM"
      h = h % 12 || 12
      return `${y}/${m}/${day} ${String(h).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")} ${ampm}`
    } catch { return d }
  }

  return (
    <section className="bg-bg-alt border border-border p-5 mb-8">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Create Class</h2>
      {formError && (
        <div className="mb-4 p-3 border border-red-400/50 bg-red-400/5 text-red-400 text-xs">
          <pre className="whitespace-pre-wrap">{formError}</pre>
        </div>
      )}
      {formSuccess && (
        <div className="mb-4 p-3 border border-green-400/50 bg-green-400/5 text-green-400 text-xs">
          <pre className="whitespace-pre-wrap">{formSuccess}</pre>
        </div>
      )}
      <form onSubmit={createClass} className="space-y-3">
        <input placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)}
          className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" required />
        <select value={curriculum} onChange={(e) => setCurriculum(e.target.value)}
          className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim">
          <option value="">Select curriculum</option>
          {CURRICULA.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-text-dim mb-1">Date</label>
          <input type="text" placeholder="YYYY/MM/DD" value={classDate} onChange={(e) => setClassDate(formatDateInput(e.target.value))}
            className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-text-dim mb-1">Start Time (24h)</label>
            <input type="text" placeholder="e.g. 14:30" value={startTime} onChange={(e) => setStartTime(formatTimeInput(e.target.value))}
              className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-text-dim mb-1">End Time (24h)</label>
            <input type="text" placeholder="e.g. 15:30" value={endTime} onChange={(e) => setEndTime(formatTimeInput(e.target.value))}
              className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" />
          </div>
        </div>

        <input placeholder="Google Meet link" value={meetLink} onChange={(e) => setMeetLink(e.target.value)}
          className="w-full px-4 py-3 bg-bg border border-border text-text-primary text-sm rounded-none focus:outline-none focus:border-text-dim" required />
        <button type="submit" disabled={submitting}
          className="w-full px-8 py-3 border border-border text-text-primary font-semibold text-sm uppercase tracking-wider rounded-none hover:bg-surface-hover transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? "Publishing..." : "Publish Class"}
        </button>
      </form>

      <h3 className="text-sm font-semibold text-text-primary mt-6 mb-3">Existing Classes</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {classes.length === 0 ? <p className="text-text-muted text-sm py-4">No classes yet.</p> : (
          classes.map((c) => (
            <div key={c.id} className="flex items-center justify-between bg-bg px-4 py-3 border border-border text-sm">
              <div>
                <p className="text-text-primary font-medium">{c.topic}</p>
                <p className="text-text-muted text-xs">
                  {c.curriculum && <>{c.curriculum} &middot; </>}
                  {formatClassTime(c.start_time)}{c.end_time ? <> - {formatClassTime(c.end_time)}</> : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {c.is_active && <span className="text-[10px] uppercase tracking-wider text-green-400">Active</span>}
                <button onClick={() => deleteClass(c.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
