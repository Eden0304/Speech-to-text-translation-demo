"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { IconBrandGithub, IconBrandGoogle } from "@/components/ui/icons"

interface SignupFormProps {
  onSubmit?: (data: {
    name: string
    email: string
    password: string
  }) => void
}

export function SignupForm({ onSubmit }: SignupFormProps) {
  const [language, setLanguage] = useState("en")
  const [colorTheme, setColorTheme] = useState("default")
  const [isLoading, setIsLoading] = useState(false)

  // Form data
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

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

  // Translations for signup form
  const translations = {
    en: {
      welcome: "Welcome to Speech Translator",
      subtitle: "Create an account to get started with real-time speech translation",
      firstName: "First name",
      lastName: "Last name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      signUp: "Sign up",
      orContinueWith: "Or continue with",
      github: "GitHub",
      google: "Google",
      apple: "Apple",
      firstNamePlaceholder: "John",
      lastNamePlaceholder: "Doe",
      emailPlaceholder: "you@example.com",
    },
    es: {
      welcome: "Bienvenido a Traductor de Voz",
      subtitle: "Crea una cuenta para comenzar con la traducción de voz en tiempo real",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo Electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      signUp: "Registrarse",
      orContinueWith: "O continuar con",
      github: "GitHub",
      google: "Google",
      apple: "Apple",
      firstNamePlaceholder: "Juan",
      lastNamePlaceholder: "Pérez",
      emailPlaceholder: "tu@ejemplo.com",
    },
    fr: {
      welcome: "Bienvenue sur Traducteur Vocal",
      subtitle: "Créez un compte pour commencer la traduction vocale en temps réel",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Adresse Email",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      signUp: "S'inscrire",
      orContinueWith: "Ou continuer avec",
      github: "GitHub",
      google: "Google",
      apple: "Apple",
      firstNamePlaceholder: "Jean",
      lastNamePlaceholder: "Dupont",
      emailPlaceholder: "vous@exemple.com",
    },
    de: {
      welcome: "Willkommen bei Sprachübersetzer",
      subtitle: "Erstellen Sie ein Konto, um mit der Echtzeit-Sprachübersetzung zu beginnen",
      firstName: "Vorname",
      lastName: "Nachname",
      email: "E-Mail-Adresse",
      password: "Passwort",
      confirmPassword: "Passwort bestätigen",
      signUp: "Registrieren",
      orContinueWith: "Oder fortfahren mit",
      github: "GitHub",
      google: "Google",
      apple: "Apple",
      firstNamePlaceholder: "Hans",
      lastNamePlaceholder: "Müller",
      emailPlaceholder: "sie@beispiel.de",
    },
    zh: {
      welcome: "欢迎使用语音翻译器",
      subtitle: "创建账户以开始实时语音翻译",
      firstName: "名字",
      lastName: "姓氏",
      email: "电子邮件地址",
      password: "密码",
      confirmPassword: "确认密码",
      signUp: "注册",
      orContinueWith: "或继续使用",
      github: "GitHub",
      google: "Google",
      apple: "Apple",
      firstNamePlaceholder: "李",
      lastNamePlaceholder: "明",
      emailPlaceholder: "你@例子.com",
    },
    ja: {
      welcome: "音声翻訳へようこそ",
      subtitle: "アカウントを作成してリアルタイム音声翻訳を始めましょう",
      firstName: "名",
      lastName: "姓",
      email: "メールアドレス",
      password: "パスワード",
      confirmPassword: "パスワード確認",
      signUp: "登録",
      orContinueWith: "または次で続行",
      github: "GitHub",
      google: "Google",
      apple: "Apple",
      firstNamePlaceholder: "太郎",
      lastNamePlaceholder: "山田",
      emailPlaceholder: "あなた@例.com",
    },
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }

    setIsLoading(true)

    try {
      if (onSubmit) {
        await onSubmit({
          name: `${firstName} ${lastName}`,
          email,
          password,
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed: " + (error.message || "Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="shadow-lg mx-auto w-full max-w-md rounded-lg bg-white p-6 md:p-8 dark:bg-black border border-border">
      <h2 className="text-2xl font-bold text-foreground">{t.welcome}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t.subtitle}</p>

      <form className="my-8" onSubmit={handleSubmit}>
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
          <Label htmlFor="email">{t.email}</Label>
          <Input
            id="email"
            placeholder={t.emailPlaceholder}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">{t.password}</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
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

        <button
          className={`group/btn relative block h-10 w-full rounded-md bg-gradient-to-r ${getThemeGradient()} font-medium text-white`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : t.signUp} &rarr;
          <BottomGradient />
        </button>

        <div className="my-8 flex items-center">
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
      </form>
    </div>
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
