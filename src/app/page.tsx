"use client"

import dynamic from "next/dynamic"
import { Hero } from "@/components/sections/Hero"
import { ScrollScene } from "@/components/sections/ScrollScene"
import { AboutTeacher } from "@/components/sections/AboutTeacher"
import { TopicsSlider } from "@/components/sections/TopicsSlider"
import { TeachingMethod } from "@/components/sections/TeachingMethod"
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider"
import { ScheduleSection } from "@/components/sections/ScheduleSection"
import { FinalCTA } from "@/components/sections/FinalCTA"

const EnrollSection = dynamic(() => import("@/components/sections/EnrollSection"), { ssr: false })

export default function HomePage() {
  return (
    <>
      <div className="relative flex flex-col">
        <Hero />
        <ScrollScene />
        <AboutTeacher />
        <TopicsSlider />
        <TeachingMethod />
        <TestimonialsSlider />
        <ScheduleSection />
        <FinalCTA />
        <EnrollSection />
      </div>
    </>
  )
}
