import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  name: string
  email: string
  phone: string | null
  grade_board: string | null
  role: "student" | "admin"
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
