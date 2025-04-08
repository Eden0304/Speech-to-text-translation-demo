"use client"
import ClientLayout from "../client-layout"
import dynamic from "next/dynamic"

// Dynamically import the TranslatePage component with no SSR
const TranslatePageClient = dynamic(() => import("../components/translate-page-client"), {
  ssr: false,
})

export default function TranslatePage() {
  return (
    <ClientLayout>
      <TranslatePageClient />
    </ClientLayout>
  )
}
