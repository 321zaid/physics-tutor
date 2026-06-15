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

export type Recording = {
  id: string
  title: string
  date: string
  link: string
  topic: string | null
  created_at: string
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
