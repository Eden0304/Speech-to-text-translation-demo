import type React from "react"
import "@/app/globals.css"

export const metadata = {
  title: "Speech Translator - Real-Time Speech-to-Text Translation",
  description:
    "Break language barriers with our real-time speech-to-text translation service. Perfect for meetings, travel, and international communication.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="theme-default mode-normal">{children}</body>
    </html>
  )
}
