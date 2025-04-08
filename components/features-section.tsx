"use client"

import { Globe, Shield, Zap, Mic, MessageSquare, Star } from "lucide-react"
import { useState, useEffect } from "react"

export function FeaturesSection() {
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

  // Translations for features section
  const translations = {
    en: {
      features: "Features",
      powerfulTools: "Powerful Translation Tools",
      description: "Our platform offers cutting-edge features to make speech translation seamless and accurate.",
      realTimeTitle: "Real-Time Transcription",
      realTimeDesc: "Low-latency speech recognition that transcribes as you speak with high accuracy.",
      multiLanguageTitle: "Multi-Language Support",
      multiLanguageDesc: "Support for over 125 languages and dialects from around the world.",
      securityTitle: "Security & Privacy",
      securityDesc: "Enterprise-grade encryption and privacy controls to keep your conversations secure.",
      offlineTitle: "Offline Mode",
      offlineDesc: "Download language packs for translation even without an internet connection.",
      transcriptTitle: "Transcript Export",
      transcriptDesc: "Save and export your translated conversations in multiple formats.",
      feedbackTitle: "User Feedback Mechanism",
      feedbackDesc: "Rate translations and provide feedback to help improve service accuracy over time.",
    },
    es: {
      features: "Características",
      powerfulTools: "Potentes Herramientas de Traducción",
      description:
        "Nuestra plataforma ofrece características de vanguardia para hacer que la traducción de voz sea fluida y precisa.",
      realTimeTitle: "Transcripción en Tiempo Real",
      realTimeDesc: "Reconocimiento de voz de baja latencia que transcribe mientras hablas con alta precisión.",
      multiLanguageTitle: "Soporte Multilingüe",
      multiLanguageDesc: "Soporte para más de 125 idiomas y dialectos de todo el mundo.",
      securityTitle: "Seguridad y Privacidad",
      securityDesc:
        "Encriptación de nivel empresarial y controles de privacidad para mantener tus conversaciones seguras.",
      offlineTitle: "Modo Sin Conexión",
      offlineDesc: "Descarga paquetes de idiomas para traducción incluso sin conexión a internet.",
      transcriptTitle: "Exportación de Transcripciones",
      transcriptDesc: "Guarda y exporta tus conversaciones traducidas en múltiples formatos.",
      feedbackTitle: "Mecanismo de Retroalimentación",
      feedbackDesc:
        "Califica traducciones y proporciona comentarios para mejorar la precisión del servicio con el tiempo.",
    },
    fr: {
      features: "Fonctionnalités",
      powerfulTools: "Outils de Traduction Puissants",
      description:
        "Notre plateforme offre des fonctionnalités de pointe pour rendre la traduction vocale fluide et précise.",
      realTimeTitle: "Transcription en Temps Réel",
      realTimeDesc:
        "Reconnaissance vocale à faible latence qui transcrit pendant que vous parlez avec une grande précision.",
      multiLanguageTitle: "Support Multilingue",
      multiLanguageDesc: "Prise en charge de plus de 125 langues et dialectes du monde entier.",
      securityTitle: "Sécurité et Confidentialité",
      securityDesc:
        "Cryptage de niveau entreprise et contrôles de confidentialité pour garder vos conversations sécurisées.",
      offlineTitle: "Mode Hors Ligne",
      offlineDesc: "Téléchargez des packs de langues pour la traduction même sans connexion Internet.",
      transcriptTitle: "Exportation de Transcriptions",
      transcriptDesc: "Enregistrez et exportez vos conversations traduites dans plusieurs formats.",
      feedbackTitle: "Mécanisme de Retour d'Utilisateur",
      feedbackDesc:
        "Évaluez les traductions et fournissez des commentaires pour améliorer la précision du service au fil du temps.",
    },
    de: {
      features: "Funktionen",
      powerfulTools: "Leistungsstarke Übersetzungswerkzeuge",
      description:
        "Unsere Plattform bietet modernste Funktionen, um Sprachübersetzung nahtlos und präzise zu gestalten.",
      realTimeTitle: "Echtzeit-Transkription",
      realTimeDesc:
        "Spracherkennung mit niedriger Latenz, die mit hoher Genauigkeit transkribiert, während Sie sprechen.",
      multiLanguageTitle: "Mehrsprachige Unterstützung",
      multiLanguageDesc: "Unterstützung für über 125 Sprachen und Dialekte aus der ganzen Welt.",
      securityTitle: "Sicherheit & Datenschutz",
      securityDesc: "Unternehmensklasse-Verschlüsselung und Datenschutzkontrollen, um Ihre Gespräche zu schützen.",
      offlineTitle: "Offline-Modus",
      offlineDesc: "Laden Sie Sprachpakete für die Übersetzung herunter, auch ohne Internetverbindung.",
      transcriptTitle: "Transkript-Export",
      transcriptDesc: "Speichern und exportieren Sie Ihre übersetzten Gespräche in verschiedenen Formaten.",
      feedbackTitle: "Nutzer-Feedback-Mechanismus",
      feedbackDesc:
        "Bewerten Sie Übersetzungen und geben Sie Feedback, um die Servicegenauigkeit im Laufe der Zeit zu verbessern.",
    },
    zh: {
      features: "功能",
      powerfulTools: "强大的翻译工具",
      description: "我们的平台提供尖端功能，使语音翻译无缝且准确。",
      realTimeTitle: "实时转录",
      realTimeDesc: "低延迟语音识别，在您说话时以高精度进行转录。",
      multiLanguageTitle: "多语言支持",
      multiLanguageDesc: "支持来自世界各地的125多种语言和方言。",
      securityTitle: "安全与隐私",
      securityDesc: "企业级加密和隐私控制，确保您的对话安全。",
      offlineTitle: "离线模式",
      offlineDesc: "下载语言包，即使没有互联网连接也能进行翻译。",
      transcriptTitle: "转录导出",
      transcriptDesc: "以多种格式保存和导出您的翻译对话。",
      feedbackTitle: "用户反馈机制",
      feedbackDesc: "对翻译进行评分并提供反馈，以帮助随着时间的推移提高服务准确性。",
    },
    ja: {
      features: "機能",
      powerfulTools: "強力な翻訳ツール",
      description: "当社のプラットフォームは、音声翻訳をシームレスかつ正確にするための最先端機能を提供します。",
      realTimeTitle: "リアルタイム文字起こし",
      realTimeDesc: "低遅延の音声認識で、話しながら高精度で文字起こしします。",
      multiLanguageTitle: "多言語サポート",
      multiLanguageDesc: "世界中の125以上の言語と方言をサポート。",
      securityTitle: "セキュリティとプライバシー",
      securityDesc: "エンタープライズグレードの暗号化とプライバシーコントロールで会話を安全に保ちます。",
      offlineTitle: "オフラインモード",
      offlineDesc: "インターネット接続がなくても翻訳できる言語パックをダウンロード。",
      transcriptTitle: "文字起こしのエクスポート",
      transcriptDesc: "翻訳された会話を複数の形式で保存およびエクスポート。",
      feedbackTitle: "ユーザーフィードバックメカニズム",
      feedbackDesc: "翻訳を評価し、フィードバックを提供して、時間の経過とともにサービスの精度を向上させます。",
    },
  }

  // Get current language translations
  const t = translations[language] || translations.en

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gradient-to-r from-gradient-start to-gradient-end px-3 py-1 text-sm text-white">
              {t.features}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t.powerfulTools}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t.description}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 transition-all hover:shadow-md hover:border-vibrant-blue/50 hover:-translate-y-1">
            <div className="rounded-full bg-vibrant-blue/10 p-3">
              <Mic className="h-6 w-6 text-vibrant-blue" />
            </div>
            <h3 className="text-xl font-bold">{t.realTimeTitle}</h3>
            <p className="text-center text-muted-foreground">{t.realTimeDesc}</p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 transition-all hover:shadow-md hover:border-vibrant-purple/50 hover:-translate-y-1">
            <div className="rounded-full bg-vibrant-purple/10 p-3">
              <Globe className="h-6 w-6 text-vibrant-purple" />
            </div>
            <h3 className="text-xl font-bold">{t.multiLanguageTitle}</h3>
            <p className="text-center text-muted-foreground">{t.multiLanguageDesc}</p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 transition-all hover:shadow-md hover:border-vibrant-teal/50 hover:-translate-y-1">
            <div className="rounded-full bg-vibrant-teal/10 p-3">
              <Shield className="h-6 w-6 text-vibrant-teal" />
            </div>
            <h3 className="text-xl font-bold">{t.securityTitle}</h3>
            <p className="text-center text-muted-foreground">{t.securityDesc}</p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 transition-all hover:shadow-md hover:border-vibrant-yellow/50 hover:-translate-y-1">
            <div className="rounded-full bg-vibrant-yellow/10 p-3">
              <Zap className="h-6 w-6 text-vibrant-yellow" />
            </div>
            <h3 className="text-xl font-bold">{t.offlineTitle}</h3>
            <p className="text-center text-muted-foreground">{t.offlineDesc}</p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 transition-all hover:shadow-md hover:border-vibrant-pink/50 hover:-translate-y-1">
            <div className="rounded-full bg-vibrant-pink/10 p-3">
              <MessageSquare className="h-6 w-6 text-vibrant-pink" />
            </div>
            <h3 className="text-xl font-bold">{t.transcriptTitle}</h3>
            <p className="text-center text-muted-foreground">{t.transcriptDesc}</p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 transition-all hover:shadow-md hover:border-vibrant-orange/50 hover:-translate-y-1">
            <div className="rounded-full bg-vibrant-orange/10 p-3">
              <Star className="h-6 w-6 text-vibrant-orange" />
            </div>
            <h3 className="text-xl font-bold">{t.feedbackTitle}</h3>
            <p className="text-center text-muted-foreground">{t.feedbackDesc}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
