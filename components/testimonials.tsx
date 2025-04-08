"use client"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { useState, useEffect } from "react"

export function Testimonials() {
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

  // Translations for testimonials section
  const translations = {
    en: {
      testimonials: "Testimonials",
      trustedByThousands: "Trusted by Thousands",
      description: "See what our users have to say about our speech translation service.",
    },
    es: {
      testimonials: "Testimonios",
      trustedByThousands: "Confiado por Miles",
      description: "Vea lo que nuestros usuarios tienen que decir sobre nuestro servicio de traducción de voz.",
    },
    fr: {
      testimonials: "Témoignages",
      trustedByThousands: "Approuvé par des Milliers",
      description: "Découvrez ce que nos utilisateurs disent de notre service de traduction vocale.",
    },
    de: {
      testimonials: "Erfahrungsberichte",
      trustedByThousands: "Von Tausenden Vertraut",
      description: "Sehen Sie, was unsere Benutzer über unseren Sprachübersetzungsdienst zu sagen haben.",
    },
    zh: {
      testimonials: "用户评价",
      trustedByThousands: "受到数千人信赖",
      description: "看看我们的用户对我们的语音翻译服务有什么评价。",
    },
    ja: {
      testimonials: "お客様の声",
      trustedByThousands: "数千人に信頼されています",
      description: "当社の音声翻訳サービスについてユーザーの声をご覧ください。",
    },
  }

  // Get current language translations
  const t = translations[language] || translations.en

  // Format testimonials for the InfiniteMovingCards component
  const testimonialItems = [
    {
      quote:
        "This tool has revolutionized our international meetings. No more language barriers or misunderstandings. It's like having a professional interpreter at a fraction of the cost.",
      name: "Sarah Johnson",
      title: "Global Project Manager",
    },
    {
      quote:
        "As a frequent traveler, this app has been a game-changer. I can have natural conversations with locals without knowing their language. The accuracy is impressive.",
      name: "Miguel Rodriguez",
      title: "Travel Blogger",
    },
    {
      quote:
        "We use this for our international customer support team. It's helped us expand to new markets without having to hire multilingual staff. The ROI has been incredible.",
      name: "Akiko Tanaka",
      title: "Customer Success Director",
    },
    {
      quote:
        "The real-time translation has made our global team collaboration seamless. We can now have productive meetings without language barriers.",
      name: "Hans Mueller",
      title: "Engineering Director",
    },
    {
      quote:
        "I use this for my online language tutoring business. It helps me communicate with students from around the world effortlessly.",
      name: "Li Wei",
      title: "Language Educator",
    },
    {
      quote:
        "The speech recognition accuracy is remarkable. It understands different accents and dialects with minimal errors.",
      name: "James Wilson",
      title: "International Sales Manager",
    },
    {
      quote:
        "This platform has transformed how we conduct international research interviews. We can now focus on the content rather than language barriers.",
      name: "Elena Petrova",
      title: "Research Scientist",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background overflow-hidden" id="testimonials">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gradient-to-r from-gradient-start to-gradient-end px-3 py-1 text-sm text-white">
              {t.testimonials}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t.trustedByThousands}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t.description}
            </p>
          </div>
        </div>

        {/* Infinite Moving Cards for testimonials - now used for all screen sizes */}
        <div className="mx-auto max-w-6xl">
          <InfiniteMovingCards items={testimonialItems} direction="left" speed="slow" pauseOnHover={true} />
        </div>
      </div>
    </section>
  )
}
