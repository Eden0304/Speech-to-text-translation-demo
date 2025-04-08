"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"
import { useState, useEffect } from "react"

export function Footer() {
  const [language, setLanguage] = useState("en")

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("speechTranslator-language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    // Add event listener to update language when it changes
    const handleStorageChange = () => {
      const updatedLanguage = localStorage.getItem("speechTranslator-language")
      if (updatedLanguage) {
        setLanguage(updatedLanguage)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for language change within the app
    window.addEventListener("languageChange", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("languageChange", handleStorageChange)
    }
  }, [])

  // Translations for footer
  const translations = {
    en: {
      subscribe: "Subscribe to our newsletter",
      updates: "Get the latest updates and news about our translation technology.",
      enterEmail: "Enter your email",
      subscribeButton: "Subscribe",
      copyright: "© 2025 Speech Translator. All rights reserved.",
    },
    es: {
      subscribe: "Suscríbete a nuestro boletín",
      updates: "Recibe las últimas actualizaciones y noticias sobre nuestra tecnología de traducción.",
      enterEmail: "Introduce tu email",
      subscribeButton: "Suscribirse",
      copyright: "© 2025 Traductor de Voz. Todos los derechos reservados.",
    },
    fr: {
      subscribe: "Abonnez-vous à notre newsletter",
      updates: "Recevez les dernières mises à jour et actualités sur notre technologie de traduction.",
      enterEmail: "Entrez votre email",
      subscribeButton: "S'abonner",
      copyright: "© 2025 Traducteur Vocal. Tous droits réservés.",
    },
    de: {
      subscribe: "Abonnieren Sie unseren Newsletter",
      updates: "Erhalten Sie die neuesten Updates und Nachrichten über unsere Übersetzungstechnologie.",
      enterEmail: "E-Mail eingeben",
      subscribeButton: "Abonnieren",
      copyright: "© 2025 Sprachübersetzer. Alle Rechte vorbehalten.",
    },
    zh: {
      subscribe: "订阅我们的通讯",
      updates: "获取有关我们翻译技术的最新更新和新闻。",
      enterEmail: "输入您的电子邮件",
      subscribeButton: "订阅",
      copyright: "© 2025 语音翻译器。保留所有权利。",
    },
    ja: {
      subscribe: "ニュースレターを購読する",
      updates: "翻訳技術に関する最新情報やニュースを入手してください。",
      enterEmail: "メールアドレスを入力",
      subscribeButton: "購読",
      copyright: "© 2025 音声翻訳。全著作権所有。",
    },
  }

  // Get current language translations
  const t = translations[language] || translations.en

  return (
    <footer className="w-full border-t bg-background py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="max-w-md space-y-4">
            <h3 className="text-xl font-bold">{t.subscribe}</h3>
            <p className="text-muted-foreground">{t.updates}</p>
            <div className="flex w-full items-center space-x-2">
              <Input type="email" placeholder={t.enterEmail} />
              <Button type="submit">{t.subscribeButton}</Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 border-t pt-8">
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </Link>
          </div>
          <p className="text-center text-sm text-muted-foreground">{t.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
