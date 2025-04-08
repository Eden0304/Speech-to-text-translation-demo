"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Globe, Menu, X, Mic, Settings, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/components/auth-context"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [language, setLanguage] = useState("en")
  const [colorTheme, setColorTheme] = useState("default")
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)

  // Use the auth context
  const { user, isLoggedIn, logout } = useAuth()

  // Load language and theme from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return

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

    // Custom event for language change within the app
    window.addEventListener("languageChange", handleStorageChange)

    // Custom event for settings panel visibility
    const handleSettingsPanelChange = (e) => {
      if (e.detail && typeof e.detail.isOpen !== "undefined") {
        setShowSettingsPanel(e.detail.isOpen)
      }
    }

    window.addEventListener("settingsPanelChange", handleSettingsPanelChange)

    // Listen for auth state changes
    const handleAuthStateChange = () => {
      console.log("Auth state changed in navigation component")
    }

    window.addEventListener("authStateChange", handleAuthStateChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("languageChange", handleStorageChange)
      window.removeEventListener("settingsPanelChange", handleSettingsPanelChange)
      window.removeEventListener("authStateChange", handleAuthStateChange)
    }
  }, [])

  const closeMenu = () => setIsOpen(false)

  // Toggle settings panel
  const toggleSettings = () => {
    const newState = !showSettingsPanel
    setShowSettingsPanel(newState)

    // Dispatch custom event to notify the CustomizationPanel
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("settingsPanelChange", {
          detail: { isOpen: newState },
        }),
      )
    }
  }

  // Handle start translating button click
  const handleStartTranslating = (e) => {
    e.preventDefault()
    console.log("Start translating clicked, isLoggedIn:", isLoggedIn)

    if (!isLoggedIn) {
      // Show auth modal if user is not logged in
      setShowAuthModal(true)
    } else {
      // Navigate to translate page if user is logged in
      router.push("/translate")
    }
  }

  // Add a function to open the auth modal with login tab
  const openAuthModal = (tab = "login") => {
    setShowAuthModal(true)
    // Dispatch an event to set the active tab in the auth modal
    window.dispatchEvent(
      new CustomEvent("authModalTabChange", {
        detail: { activeTab: tab },
      }),
    )
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    if (pathname !== "/") {
      router.push("/")
    }
  }

  // Get theme-specific icon color
  const getIconColor = () => {
    const isDarkMode = typeof document !== "undefined" && document.documentElement.classList.contains("dark")

    switch (colorTheme) {
      case "blue-eclipse":
        return isDarkMode ? "#778da9" : "#415a77"
      case "calm":
        return isDarkMode ? "#4fd1c5" : "#20b2aa"
      case "high-contrast":
        return isDarkMode ? "#FFFFFF" : "#000000"
      default:
        return isDarkMode ? "#A78BFA" : "#8B5CF6"
    }
  }

  // Smooth scroll to section when clicking on navigation links
  const scrollToSection = (e, sectionId) => {
    e.preventDefault()

    // If we're not on the homepage, navigate to homepage with the section ID
    if (pathname !== "/") {
      window.location.href = `/#${sectionId}`
      return
    }

    // If we're already on the homepage, just scroll to the section
    if (typeof document !== "undefined") {
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
        closeMenu()
      }
    }
  }

  // Get theme-specific animation colors
  const getThemeColors = () => {
    switch (colorTheme) {
      case "blue-eclipse":
        return {
          colors: ["rgba(13, 27, 42, 0.1)", "rgba(27, 38, 59, 0.1)", "rgba(65, 90, 119, 0.1)", "rgba(13, 27, 42, 0.1)"],
          textColors: ["rgb(13, 27, 42)", "rgb(27, 38, 59)", "rgb(65, 90, 119)", "rgb(13, 27, 42)"],
        }
      case "calm":
        return {
          colors: [
            "rgba(32, 178, 170, 0.1)",
            "rgba(50, 205, 50, 0.1)",
            "rgba(30, 144, 255, 0.1)",
            "rgba(32, 178, 170, 0.1)",
          ],
          textColors: ["rgb(32, 178, 170)", "rgb(50, 205, 50)", "rgb(30, 144, 255)", "rgb(32, 178, 170)"],
        }
      case "high-contrast":
        return {
          colors: ["rgba(0, 0, 0, 0.1)", "rgba(255, 215, 0, 0.1)", "rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.1)"],
          textColors: ["rgb(0, 0, 0)", "rgb(255, 215, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)"],
        }
      default:
        return {
          colors: [
            "rgba(99, 102, 241, 0.1)",
            "rgba(139, 92, 246, 0.1)",
            "rgba(217, 70, 239, 0.1)",
            "rgba(99, 102, 241, 0.1)",
          ],
          textColors: ["rgb(99, 102, 241)", "rgb(139, 92, 246)", "rgb(217, 70, 239)", "rgb(99, 102, 241)"],
        }
    }
  }

  // Translations for navigation items
  const translations = {
    en: {
      home: "Home",
      features: "Features",
      howItWorks: "How It Works",
      testimonials: "Testimonials",
      startTranslating: "Start Translating",
      settings: "Settings",
      signup: "Log In / Sign Up",
      logout: "Log Out",
      welcome: "Welcome",
    },
    es: {
      home: "Inicio",
      features: "Características",
      howItWorks: "Cómo Funciona",
      testimonials: "Testimonios",
      startTranslating: "Comenzar a Traducir",
      settings: "Configuración",
      signup: "Iniciar Sesión / Registrarse",
      logout: "Cerrar Sesión",
      welcome: "Bienvenido",
    },
    fr: {
      home: "Accueil",
      features: "Fonctionnalités",
      howItWorks: "Comment Ça Marche",
      testimonials: "Témoignages",
      startTranslating: "Commencer à Traduire",
      settings: "Paramètres",
      signup: "Connexion / S'inscrire",
      logout: "Se déconnecter",
      welcome: "Bienvenue",
    },
    de: {
      home: "Startseite",
      features: "Funktionen",
      howItWorks: "Wie Es Funktioniert",
      testimonials: "Erfahrungsberichte",
      startTranslating: "Übersetzung Starten",
      settings: "Einstellungen",
      signup: "Anmelden / Registrieren",
      logout: "Abmelden",
      welcome: "Willkommen",
    },
    zh: {
      home: "首页",
      features: "功能",
      howItWorks: "工作原理",
      testimonials: "用户评价",
      startTranslating: "开始翻译",
      settings: "设置",
      signup: "登录 / 注册",
      logout: "登出",
      welcome: "欢迎",
    },
    ja: {
      home: "ホーム",
      features: "機能",
      howItWorks: "使い方",
      testimonials: "お客様の声",
      startTranslating: "翻訳を始める",
      settings: "設定",
      signup: "ログイン / 登録",
      logout: "ログアウト",
      welcome: "ようこそ",
    },
  }

  // Get current language translations
  const t = translations[language] || translations.en

  // Updated navItems with Testimonials
  const navItems = [
    { name: t.home, href: "/", isSection: false },
    { name: t.features, href: "/#features", isSection: true, sectionId: "features" },
    { name: t.howItWorks, href: "/#how-it-works", isSection: true, sectionId: "how-it-works" },
    { name: t.testimonials, href: "/#testimonials", isSection: true, sectionId: "testimonials" },
  ]

  // Add login/signup or logout based on auth state
  if (!isLoggedIn) {
    navItems.push({
      name: t.signup,
      href: "#",
      isSection: false,
      onClick: () => openAuthModal("login"),
    })
  }

  const themeColors = getThemeColors()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end">
              Speech Translator
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={
                item.isSection ? (e) => scrollToSection(e, item.sectionId) : item.onClick ? item.onClick : undefined
              }
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href || (pathname === "/" && item.href.startsWith("#"))
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn && user && (
            <div className="flex items-center mr-4">
              <span className="text-sm text-muted-foreground mr-2">
                {t.welcome}, {user.name || "User"}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout} title={t.logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSettings}
            className="mr-2"
            style={{ color: getIconColor() }}
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Button
            className="bg-gradient-to-r from-gradient-start to-gradient-end hover:opacity-90 transition-opacity"
            onClick={handleStartTranslating}
          >
            <Mic className="mr-2 h-4 w-4" />
            {t.startTranslating}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px] p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
                  <div className="p-1.5 rounded-full bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end">
                    Speech Translator
                  </span>
                </Link>
                <motion.button
                  className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={closeMenu}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ backgroundColor: "transparent" }}
                  animate={{
                    backgroundColor: themeColors.colors,
                    color: themeColors.textColors,
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {isLoggedIn && user && (
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t.welcome}, {user.name || "User"}
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t.logout}
                    </Button>
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-4 p-4 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={
                      item.isSection
                        ? (e) => scrollToSection(e, item.sectionId)
                        : item.onClick
                          ? (e) => {
                              e.preventDefault()
                              closeMenu()
                              item.onClick()
                            }
                          : closeMenu
                    }
                    className={`text-base font-medium transition-colors hover:text-primary ${
                      pathname === item.href || (pathname === "/" && item.href.startsWith("#"))
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    toggleSettings()
                    closeMenu()
                  }}
                  className="flex items-center text-base font-medium text-muted-foreground transition-colors hover:text-primary text-left"
                >
                  <Settings className="h-4 w-4 mr-2" style={{ color: getIconColor() }} />
                  {t.settings}
                </button>
              </nav>
              <div className="mt-auto p-4 border-t">
                {/* Add back the Start Translating button to mobile navigation */}
                <Button
                  className="w-full bg-gradient-to-r from-gradient-start to-gradient-end hover:opacity-90 transition-opacity"
                  onClick={(e) => {
                    closeMenu()
                    handleStartTranslating(e)
                  }}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  {t.startTranslating}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  )
}
