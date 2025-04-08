"use client"
import ClientLayout from "./client-layout"
import dynamic from "next/dynamic"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"

// Dynamically import the HeroSectionClient component with no SSR
const HeroSectionClient = dynamic(() => import("@/components/hero-section-client"), {
  ssr: false,
})

export default function Home() {
  return (
    <ClientLayout>
      <div className="flex min-h-screen flex-col">
        <HeroSectionClient />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <Testimonials />
        <Footer />
      </div>
    </ClientLayout>
  )
}
