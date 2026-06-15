import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? ""

if (typeof window !== "undefined") {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Check that both env vars are set on Render and a fresh deploy was triggered after adding them."
    )
  }
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder"
)

export type Profile = {
  id: string
  name: string
  email: string
  phone: string | null
  grade_board: string | null
  role: "student" | "admin" | "super_admin"
  access: boolean | null
  created_at: string
  last_login: string | null
  subject: string | null
  curriculum: string | null
  fee_paid: boolean | null
  notes: string | null
}

export type Class = {
  id: string
  topic: string
  date: string
  time: string
  meet_link: string
  is_active: boolean
  created_by: string
  created_at: string
}

export type LiveClass = {
  id: string
  title: string
  subject: string
  curriculum: string
  join_link: string
  is_live: boolean | null
  start_time: string | null
  end_time: string | null
  notes: string | null
  created_by: string | null
  created_at: string | null
}

export type Payment = {
  id: string
  student_id: string
  status: "pending" | "paid"
  amount: number | null
  method: string | null
  notes: string | null
  created_at: string
}

export async function ensureProfile(userId: string, userEmail: string | undefined) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle()
  if (!existing) {
    await supabase.from("profiles").insert({
      id: userId,
      email: userEmail,
      name: userEmail?.split("@")[0] || "Student",
    })
  }
}

export async function updateLastLogin(userId: string) {
  await supabase.from("profiles").update({ last_login: new Date().toISOString() }).eq("id", userId)
}
