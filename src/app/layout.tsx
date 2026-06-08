import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { LenisProvider } from "@/components/layout/LenisProvider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Physics Teacher — Physics, controlled.",
  description: "Premium physics tuition. Exam-focused, visually taught, clearly structured.",
  icons: [{ rel: "icon", type: "image/svg+xml", url: "/favicon.svg" }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LenisProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  )
}
