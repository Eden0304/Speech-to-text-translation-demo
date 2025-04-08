"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { AuthModal } from "@/components/auth-modal"
import { getSupportedLanguages } from "@/utils/youdao-websocket"
import { useAuth } from "@/components/auth-context"

export function HeroSection() {
  const [sourceLanguage, setSourceLanguage] = useState("en-US")
  const [targetLanguage, setTargetLanguage] = useState("es-ES")
  const [language, setLanguage] = useState("en")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [supportedLanguages, setSupportedLanguages] = useState({})
  const router = useRouter()

  // Use the auth context
  const { user, isLoggedIn } = useAuth()

  // Initialize supported languages only once
  useEffect(() => {
    setSupportedLanguages(getSupportedLanguages())
  }, [])

  // Load language and translation preferences from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return

    const savedSourceLang = localStorage.getItem("speechTranslator-sourceLanguage")
    const savedTargetLang = localStorage.getItem("speechTranslator-targetLanguage")
    const savedLanguage = localStorage.getItem("speechTranslator-language")

    if (savedSourceLang) setSourceLanguage(savedSourceLang)
    if (savedTargetLang) setTargetLanguage(savedTargetLang)
    if (savedLanguage) setLanguage(savedLanguage)

    // Add event listener to update language when it changes
    const handleStorageChange = () => {
      const updatedLanguage = localStorage.getItem("speechTranslator-language")
      if (updatedLanguage) {
        setLanguage(updatedLanguage)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("languageChange", handleStorageChange)

    // Listen for auth state changes
    const handleAuthStateChange = () => {
      console.log("Auth state changed in hero section")
    }

    window.addEventListener("authStateChange", handleAuthStateChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("languageChange", handleStorageChange)
      window.removeEventListener("authStateChange", handleAuthStateChange)
    }
  }, [])

  // Save language selections to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("speechTranslator-sourceLanguage", sourceLanguage)
  }, [sourceLanguage])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("speechTranslator-targetLanguage", targetLanguage)
  }, [targetLanguage])

  // Create refs for source and target languages
  const sourceLanguageRef = useRef(sourceLanguage)
  const targetLanguageRef = useRef(targetLanguage)

  // Update refs when sourceLanguage or targetLanguage state changes
  useEffect(() => {
    sourceLanguageRef.current = sourceLanguage
  }, [sourceLanguage])

  useEffect(() => {
    targetLanguageRef.current = targetLanguage
  }, [targetLanguage])

  // Update the handleStartTranslating function to properly check authentication
  const handleStartTranslating = (e) => {
    e.preventDefault()
    console.log("Start translating clicked in hero section, isLoggedIn:", isLoggedIn)

    if (!isLoggedIn) {
      // Show auth modal if user is not logged in
      setShowAuthModal(true)
    } else {
      // Navigate to translate page if user is logged in
      router.push(`/translate?source=${sourceLanguageRef.current}&target=${targetLanguageRef.current}`)
    }
  }

  // Translations for hero section
  const translations = {
    en: {
      title: "Translate Speech in Real-Time",
      description:
        "Break language barriers instantly with our advanced speech-to-text translation technology. Perfect for meetings, travel, and international communication.",
      sourceLanguage: "Source Language",
      targetLanguage: "Target Language",
      startTranslating: "Start Translating Now",
      speaking: "Speaking...",
      translatingTo: "Translating to Spanish...",
      hello: "Hello, how are you today?",
      hola: "Hola, ¿cómo estás hoy?",
      welcome: "Welcome",
      loginToStart: "Log in to start translating",
    },
    es: {
      title: "Traduce Voz en Tiempo Real",
      description:
        "Rompe las barreras del idioma al instante con nuestra avanzada tecnología de traducción de voz a texto. Perfecto para reuniones, viajes y comunicación internacional.",
      sourceLanguage: "Idioma de Origen",
      targetLanguage: "Idioma de Destino",
      startTranslating: "Comenzar a Traducir Ahora",
      speaking: "Hablando...",
      translatingTo: "Traduciendo al inglés...",
      hello: "Hola, ¿cómo estás hoy?",
      hola: "Hello, how are you today?",
      welcome: "Bienvenido",
      loginToStart: "Inicia sesión para comenzar a traducir",
    },
    // Other translations remain the same...
  }

  // Get current language translations
  const t = translations[language] || translations.en

  // Handle language changes
  const handleSourceLanguageChange = (value) => {
    setSourceLanguage(value)
  }

  const handleTargetLanguageChange = (value) => {
    setTargetLanguage(value)
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end">
                {isLoggedIn && user ? `${t.welcome}, ${user.name}` : t.title}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">{t.description}</p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <div className="grid w-full gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-vibrant-blue/10">
                    <Globe className="h-4 w-4 text-vibrant-blue" />
                  </div>
                  <span className="text-sm font-medium">{t.sourceLanguage}</span>
                </div>
                <div className="bg-white rounded-full px-3 py-1 shadow-sm border">
                  <Select value={sourceLanguage} onValueChange={handleSourceLanguageChange}>
                    <SelectTrigger className="w-[100px] border-none shadow-none h-8 text-sm">
                      <SelectValue placeholder={supportedLanguages[sourceLanguage] || sourceLanguage} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(supportedLanguages).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid w-full gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-vibrant-purple/10">
                    <Globe className="h-4 w-4 text-vibrant-purple" />
                  </div>
                  <span className="text-sm font-medium">{t.targetLanguage}</span>
                </div>
                <div className="bg-white rounded-full px-3 py-1 shadow-sm border">
                  <Select value={targetLanguage} onValueChange={handleTargetLanguageChange}>
                    <SelectTrigger className="w-[100px] border-none shadow-none h-8 text-sm">
                      <SelectValue placeholder={supportedLanguages[targetLanguage] || targetLanguage} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(supportedLanguages).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button
                className="w-full bg-gradient-to-r from-gradient-start to-gradient-end hover:opacity-90 transition-opacity"
                onClick={handleStartTranslating}
              >
                <Mic className="mr-2 h-4 w-4" />
                {isLoggedIn ? t.startTranslating : t.loginToStart}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gradient-start/20 via-gradient-mid/30 to-gradient-end/40 blur-3xl" />
              <div className="absolute inset-10 rounded-full bg-white p-8 shadow-lg">
                <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                  <div className="rounded-full bg-gradient-to-r from-gradient-start to-gradient-end p-3">
                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gradient-start to-gradient-end animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t.speaking}</p>
                    <p className="text-lg font-medium">{t.hello}</p>
                    <p className="text-sm text-vibrant-purple">{t.translatingTo}</p>
                    <p className="text-lg font-medium">{t.hola}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </section>
  )
}
