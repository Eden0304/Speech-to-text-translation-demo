"use client"

import { Mic, Cpu, Globe } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import StarBorder from "@/components/star-border"
import { motion } from "framer-motion"

export function HowItWorks() {
  const [language, setLanguage] = useState("en")
  const [colorTheme, setColorTheme] = useState("default")

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

    // Custom event for language change within the app
    window.addEventListener("languageChange", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("languageChange", handleStorageChange)
    }
  }, [])

  // Get theme-specific star border color
  const getThemeColor = () => {
    switch (colorTheme) {
      case "blue-eclipse":
        return "#415a77"
      case "calm":
        return "#20b2aa"
      case "high-contrast":
        return "#ffd700"
      default:
        return "#8b5cf6"
    }
  }

  // Translations for how it works section
  const translations = {
    en: {
      howItWorks: "How It Works",
      simpleProcess: "Simple 3-Step Process",
      description: "Our technology makes translation effortless with just a few simple steps.",
      speak: {
        title: "Speak",
        description: "Speak clearly into your device's microphone in your native language.",
      },
      process: {
        title: "Process",
        description: "Our AI processes your speech and converts it to text in real-time.",
      },
      translate: {
        title: "Translate",
        description: "The text is instantly translated to your selected target language.",
      },
    },
    es: {
      howItWorks: "Cómo Funciona",
      simpleProcess: "Proceso Simple de 3 Pasos",
      description: "Nuestra tecnología hace que la traducción sea sencilla con solo unos simples pasos.",
      speak: {
        title: "Habla",
        description: "Habla claramente en el micrófono de tu dispositivo en tu idioma nativo.",
      },
      process: {
        title: "Procesa",
        description: "Nuestra IA procesa tu voz y la convierte en texto en tiempo real.",
      },
      translate: {
        title: "Traduce",
        description: "El texto se traduce instantáneamente al idioma de destino seleccionado.",
      },
    },
    fr: {
      howItWorks: "Comment Ça Marche",
      simpleProcess: "Processus Simple en 3 Étapes",
      description: "Notre technologie rend la traduction sans effort en quelques étapes simples.",
      speak: {
        title: "Parlez",
        description: "Parlez clairement dans le microphone de votre appareil dans votre langue maternelle.",
      },
      process: {
        title: "Traitement",
        description: "Notre IA traite votre parole et la convertit en texte en temps réel.",
      },
      translate: {
        title: "Traduction",
        description: "Le texte est instantanément traduit dans la langue cible que vous avez sélectionnée.",
      },
    },
    de: {
      howItWorks: "Wie Es Funktioniert",
      simpleProcess: "Einfacher 3-Schritte-Prozess",
      description: "Unsere Technologie macht Übersetzung mühelos mit nur wenigen einfachen Schritten.",
      speak: {
        title: "Sprechen",
        description: "Sprechen Sie deutlich in das Mikrofon Ihres Geräts in Ihrer Muttersprache.",
      },
      process: {
        title: "Verarbeitung",
        description: "Unsere KI verarbeitet Ihre Sprache und wandelt sie in Echtzeit in Text um.",
      },
      translate: {
        title: "Übersetzung",
        description: "Der Text wird sofort in die von Ihnen ausgewählte Zielsprache übersetzt.",
      },
    },
    zh: {
      howItWorks: "工作原理",
      simpleProcess: "简单的3步流程",
      description: "我们的技术只需几个简单的步骤就能轻松实现翻译。",
      speak: {
        title: "说话",
        description: "用您的母语清晰地对着设备麦克风说话。",
      },
      process: {
        title: "处理",
        description: "我们的AI处理您的语音并实时将其转换为文本。",
      },
      translate: {
        title: "翻译",
        description: "文本会立即被翻译成您选择的目标语言。",
      },
    },
    ja: {
      howItWorks: "使い方",
      simpleProcess: "簡単な3ステッププロセス",
      description: "当社の技術により、いくつかの簡単なステップで翻訳が簡単に行えます。",
      speak: {
        title: "話す",
        description: "デバイスのマイクに母国語で明確に話します。",
      },
      process: {
        title: "処理",
        description: "当社のAIがあなたの音声を処理し、リアルタイムでテキストに変換します。",
      },
      translate: {
        title: "翻訳",
        description: "テキストは選択した目標言語に即座に翻訳されます。",
      },
    },
  }

  // Get current language translations
  const t = translations[language] || translations.en

  const steps = [
    {
      icon: <Mic className="h-8 w-8" />,
      title: t.speak.title,
      description: t.speak.description,
      number: 1,
      color: "from-vibrant-blue to-vibrant-purple",
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: t.process.title,
      description: t.process.description,
      number: 2,
      color: "from-vibrant-purple to-vibrant-pink",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: t.translate.title,
      description: t.translate.description,
      number: 3,
      color: "from-vibrant-pink to-vibrant-orange",
    },
  ]

  return (
    <section
      className={`w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50 theme-${colorTheme}`}
      id="how-it-works"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gradient-to-r from-gradient-start to-gradient-end px-3 py-1 text-sm text-white">
              {t.howItWorks}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t.simpleProcess}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="relative h-full"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <StarBorder color={getThemeColor()} speed={`${6 + idx}s`} className="h-full">
                <div className="flex flex-col items-center justify-center p-4 h-full">
                  <motion.div
                    className={cn(
                      "relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r text-white",
                      step.color,
                    )}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                  >
                    {step.icon}
                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-vibrant-purple shadow-md">
                      {step.number}
                    </span>
                  </motion.div>
                  <h4 className="text-foreground font-bold tracking-wide mt-4 text-center text-xl">{step.title}</h4>
                  <p className="mt-4 text-muted-foreground tracking-wide leading-relaxed text-sm text-center">
                    {step.description}
                  </p>
                </div>
              </StarBorder>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
