"use client"
import ClientLayout from "../client-layout"
import dynamic from "next/dynamic"

// Dynamically import the SignupPageClient component with no SSR
const SignupPageClient = dynamic(() => import("../components/signup-page-client"), {
  ssr: false,
})

export default function SignupPage() {
  return (
    <ClientLayout>
      <SignupPageClient />
    </ClientLayout>
  )
}
