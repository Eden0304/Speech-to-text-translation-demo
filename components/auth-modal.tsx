"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { IconBrandGithub, IconBrandGoogle } from "@/components/ui/icons"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [language, setLanguage] = useState("en")
  const [colorTheme, setColorTheme] = useState("default")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const router = useRouter()

  // Form data
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const { login, register, isLoggedIn } = useAuth()

  // Close modal if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      onClose()
    }
  }, [isLoggedIn, onClose])

  // Load language and theme from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("speechTranslator-language")
    const savedColorTheme = localStorage.getItem("speechTranslator-colorTheme")

    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    if (savedColorTheme) {
      setColorTheme(savedColorTheme)
    }

    // Add event listener to update language and theme when they change
    const handleStorageChange = () => {
      const updatedLanguage = localStorage.getItem("speechTranslator-language")
      const updatedColorTheme = localStorage.getItem("speechTranslator-colorTheme")

      if (updatedLanguage) {
        setLanguage(updatedLanguage)
      }

      if (updatedColorTheme) {
        setColorTheme(updatedColorTheme)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("languageChange", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("languageChange", handleStorageChange)
    }
  }, [])

  // Add event listener for tab changes
  useEffect(() => {
    const handleTabChange = (e) => {
      if (e.detail && e.detail.activeTab) {
        setActiveTab(e.detail.activeTab)
      }
    }

    window.addEventListener("authModalTabChange", handleTabChange)

    return () => {
      window.removeEventListener("authModalTabChange", handleTabChange)
    }
  }, [])

  // Translations for auth modal
  const translations = {
    en: {
      welcome: "Welcome to Speech Translator",
      subtitle: "Create an account or log in to get started",
      login: "Log In",
      signup: "Sign Up",
      firstName: "First name",
      lastName: "Last name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      signUpButton: "Sign up",
      loginButton: "Log in",
      orContinueWith: "Or continue with",
      github: "GitHub",
      google: "Google",
      firstNamePlaceholder: "John",
      lastNamePlaceholder: "Doe",
      emailPlaceholder: "you@example.com",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      errorOccurred: "An error occurred",
      passwordsDontMatch: "Passwords don't match",
    },
    // Other translations remain the same...
  }

  // Get current language translations
  const t = translations[language] || translations.en

  // Get theme-specific gradient
  const getThemeGradient = () => {
    switch (colorTheme) {
      case "blue-eclipse":
        return "from-[#0d1b2a] to-[#415a77]"
      case "calm":
        return "from-[#20b2aa] to-[#32cd32]"
      case "high-contrast":
        return "from-black to-black dark:from-white dark:to-white"
      default:
        return "from-gradient-start to-gradient-end"
    }
  }

  // Reset form fields and error message
  const resetForm = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setFirstName("")
    setLastName("")
    setErrorMessage("")
  }

  // 更新登录表单提交处理
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      const result = await login(email, password)

      if (result.success) {
        console.log("Login successful, redirecting...")
        resetForm()
        onClose()
        router.push("/translate")
      } else {
        setErrorMessage(result.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrorMessage(error.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // 更新注册表单提交处理
  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage("")

    if (password !== confirmPassword) {
      setErrorMessage(t.passwordsDontMatch)
      return
    }

    setIsLoading(true)

    try {
      const result = await register({
        name: `${firstName} ${lastName}`,
        email,
        password,
      })

      if (result.success) {
        console.log("Registration successful, redirecting...")
        resetForm()
        onClose()
        router.push("/translate")
      } else {
        setErrorMessage(result.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setErrorMessage(error.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="mx-auto w-full max-w-md pb-4">
          <h2 className="text-2xl font-bold text-foreground">{t.welcome}</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t.subtitle}</p>

          {/* Error message display */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
          )}

          {/* Make sure the tabs are properly working */}
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "signup")}
            className="mt-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t.login}</TabsTrigger>
              <TabsTrigger value="signup">{t.signup}</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              {/* Login form content */}
              <form onSubmit={handleLoginSubmit}>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email-login">{t.email}</Label>
                  <Input
                    id="email-login"
                    placeholder={t.emailPlaceholder}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </LabelInputContainer>
                <LabelInputContainer className="mb-6">
                  <Label htmlFor="password-login">{t.password}</Label>
                  <Input
                    id="password-login"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </LabelInputContainer>

                <Button
                  className={`w-full bg-gradient-to-r ${getThemeGradient()} text-white`}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : t.loginButton}
                </Button>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                  {t.dontHaveAccount}{" "}
                  <button type="button" className="text-primary hover:underline" onClick={() => setActiveTab("signup")}>
                    {t.signup}
                  </button>
                </p>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              {/* Signup form content */}
              <form onSubmit={handleSignupSubmit}>
                <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                  <LabelInputContainer>
                    <Label htmlFor="firstname">{t.firstName}</Label>
                    <Input
                      id="firstname"
                      placeholder={t.firstNamePlaceholder}
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="lastname">{t.lastName}</Label>
                    <Input
                      id="lastname"
                      placeholder={t.lastNamePlaceholder}
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email-signup">{t.email}</Label>
                  <Input
                    id="email-signup"
                    placeholder={t.emailPlaceholder}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="password-signup">{t.password}</Label>
                  <Input
                    id="password-signup"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </LabelInputContainer>
                <LabelInputContainer className="mb-6">
                  <Label htmlFor="confirm-password">{t.confirmPassword}</Label>
                  <Input
                    id="confirm-password"
                    placeholder="••••••••"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </LabelInputContainer>

                <Button
                  className={`w-full bg-gradient-to-r ${getThemeGradient()} text-white`}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : t.signUpButton}
                </Button>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                  {t.alreadyHaveAccount}{" "}
                  <button type="button" className="text-primary hover:underline" onClick={() => setActiveTab("login")}>
                    {t.login}
                  </button>
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center">
            <div className="flex-grow h-[1px] bg-border"></div>
            <span className="px-4 text-sm text-muted-foreground">{t.orContinueWith}</span>
            <div className="flex-grow h-[1px] bg-border"></div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              className="group/btn relative flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-border bg-background px-4 font-medium text-foreground hover:bg-muted transition-colors"
              type="button"
            >
              <IconBrandGithub className="h-4 w-4" />
              <span className="text-sm">{t.github}</span>
              <BottomGradient />
            </button>
            <button
              className="group/btn relative flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-border bg-background px-4 font-medium text-foreground hover:bg-muted transition-colors"
              type="button"
            >
              <IconBrandGoogle className="h-4 w-4" />
              <span className="text-sm">{t.google}</span>
              <BottomGradient />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
}
