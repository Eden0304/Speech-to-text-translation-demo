"use client"

import { useAuth } from "@/components/auth-context"
import { SignupForm } from "@/components/signup-form"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignupPageClient() {
  const { user, register } = useAuth() // 现在可以安全使用useAuth
  const router = useRouter()

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleSubmit = async (data) => {
    const result = await register(data)
    if (result.success) {
      // 注册成功处理
      router.push("/translate")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24 lg:py-32">
        <div className="flex justify-center">
          <SignupForm onSubmit={handleSubmit} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
