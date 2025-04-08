"use client"

import { HeroSection } from "./hero-section"
import { AuthProvider } from "@/components/auth-context"

export default function HeroSectionClient() {
  return (
    <AuthProvider>
      <HeroSection />
    </AuthProvider>
  )
}
