"use client"

import type React from "react"

import { AuthProvider } from "@/components/auth-context"
import { Navigation } from "@/components/navigation"
import { CustomizationPanel } from "@/components/customization-panel"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {" "}
      {/* 确保这是最外层的Provider */}
      <Navigation />
      {children}
      <CustomizationPanel />
    </AuthProvider>
  )
}
