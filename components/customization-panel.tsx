"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Volume2, Type, Glasses, Palette, Globe } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import BabyIcon from "@/components/icons/baby-icon"

export function CustomizationPanel() {
  // State for all customization options
  const [volume, setVolume] = useState(80)
  const [fontSize, setFontSize] = useState("medium")
  const [mode, setMode] = useState("normal")
  const [colorTheme, setColorTheme] = useState("default")
  const [language, setLanguage] = useState("en")
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    // Skip this effect during SSR
    if (typeof window === "undefined") return

    const savedVolume = localStorage.getItem("speechTranslator-volume")
    const savedFontSize = localStorage.getItem("speechTranslator-fontSize")
    const savedMode = localStorage.getItem("speechTranslator-mode")
    const savedColorTheme = localStorage.getItem("speechTranslator-colorTheme")
    const savedLanguage = localStorage.getItem("speechTranslator-language")
    const panelShown = localStorage.getItem("speechTranslator-panelShown")

    if (savedVolume) setVolume(Number.parseInt(savedVolume))
    if (savedFontSize) setFontSize(savedFontSize)
    if (savedMode) setMode(savedMode)
    if (savedColorTheme) setColorTheme(savedColorTheme)
    if (savedLanguage) setLanguage(savedLanguage)

    // Check if dark mode is active
    setIsDarkMode(document.documentElement.classList.contains("dark"))

    // If the panel has been shown before, don't auto-open it
    if (!panelShown) {
      // Mark that the panel has been shown
      localStorage.setItem("speechTranslator-panelShown", "true")
      // Open the panel on first visit
      setIsOpen(true)
    }

    // Apply the saved settings
    applySettings({
      fontSize: savedFontSize || fontSize,
      mode: savedMode || mode,
      colorTheme: savedColorTheme || colorTheme,
      language: savedLanguage || language,
    })

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(document.documentElement.classList.contains("dark"))
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    // Listen for settings panel toggle from navigation
    const handleSettingsPanelChange = (e) => {
      if (e.detail && typeof e.detail.isOpen !== "undefined") {
        setIsOpen(e.detail.isOpen)
      }
    }

    window.addEventListener("settingsPanelChange", handleSettingsPanelChange)

    return () => {
      observer.disconnect()
      window.removeEventListener("settingsPanelChange", handleSettingsPanelChange)
    }
  }, [])

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem("speechTranslator-volume", volume.toString())
    localStorage.setItem("speechTranslator-fontSize", fontSize)
    localStorage.setItem("speechTranslator-mode", mode)
    localStorage.setItem("speechTranslator-colorTheme", colorTheme)
    localStorage.setItem("speechTranslator-language", language)

    // Apply the settings
    applySettings({ fontSize, mode, colorTheme, language })

    // Dispatch a custom event to notify other components about the language change
    window.dispatchEvent(new Event("languageChange"))

    // Dispatch a custom event to notify other components about theme changes
    window.dispatchEvent(
      new CustomEvent("themeChange", {
        detail: { colorTheme, mode },
      }),
    )
  }, [volume, fontSize, mode, colorTheme, language])

  // Function to apply settings to the document
  const applySettings = ({ fontSize, mode, colorTheme, language }) => {
    // Apply font size
    const fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
      "extra-large": "20px",
    }
    document.documentElement.style.fontSize = fontSizeMap[fontSize] || "16px"

    // Apply mode-specific settings
    document.body.classList.remove("mode-child", "mode-elderly", "mode-normal")
    document.body.classList.add(`mode-${mode}`)

    // Apply color theme
    document.body.classList.remove("theme-default", "theme-blue-eclipse", "theme-calm", "theme-high-contrast")
    document.body.classList.add(`theme-${colorTheme}`)

    // Apply language
    document.documentElement.lang = language

    // Force a repaint to ensure styles are applied
    document.body.style.display = "none"
    document.body.offsetHeight // Trigger a reflow
    document.body.style.display = ""

    console.log(`Applied settings: fontSize=${fontSize}, mode=${mode}, colorTheme=${colorTheme}, language=${language}`)
  }

  // Toggle the settings panel
  const toggleSettings = () => {
    const newState = !isOpen
    setIsOpen(newState)

    // Dispatch custom event to notify the Navigation component
    window.dispatchEvent(
      new CustomEvent("settingsPanelChange", {
        detail: { isOpen: newState },
      }),
    )
  }

  // Get theme-specific colors
  const getThemeColors = () => {
    const baseColors = {
      default: {
        light: {
          primary: "bg-gradient-to-r from-gradient-start to-gradient-end text-white",
          secondary: "bg-white border border-gray-200",
          accent: "bg-purple-100 text-purple-800",
          icon: "#8B5CF6", // Purple
        },
        dark: {
          primary: "bg-gradient-to-r from-gradient-start to-gradient-end text-white",
          secondary: "bg-gray-800 border border-gray-700",
          accent: "bg-purple-900 text-purple-100",
          icon: "#A78BFA", // Light purple
        },
      },
      "blue-eclipse": {
        light: {
          primary: "bg-[#1b263b] text-white",
          secondary: "bg-white border border-[#415a77]/30",
          accent: "bg-[#415a77]/20 text-[#0d1b2a]",
          icon: "#415a77", // Blue
        },
        dark: {
          primary: "bg-[#0d1b2a] text-white",
          secondary: "bg-[#1b263b] border border-[#415a77]",
          accent: "bg-[#415a77] text-white",
          icon: "#778da9", // Light blue
        },
      },
      calm: {
        light: {
          primary: "bg-gradient-to-r from-[#20b2aa] to-[#32cd32] text-white",
          secondary: "bg-white border border-[#20b2aa]/30",
          accent: "bg-[#e0f2f1] text-[#20b2aa]",
          icon: "#20b2aa", // Teal
        },
        dark: {
          primary: "bg-gradient-to-r from-[#20b2aa] to-[#32cd32] text-white",
          secondary: "bg-[#004d40] border border-[#00897b]",
          accent: "bg-[#00897b] text-white",
          icon: "#4fd1c5", // Light teal
        },
      },
      "high-contrast": {
        light: {
          primary: "bg-black text-white border-2 border-yellow-400",
          secondary: "bg-white border-2 border-black",
          accent: "bg-yellow-400 text-black",
          icon: "#000000", // Black
        },
        dark: {
          primary: "bg-white text-black border-2 border-yellow-400",
          secondary: "bg-black border-2 border-white",
          accent: "bg-yellow-400 text-black",
          icon: "#FFFFFF", // White
        },
      },
    }

    return baseColors[colorTheme][isDarkMode ? "dark" : "light"]
  }

  // Get the current icon color based on theme
  const getIconColor = () => {
    return getThemeColors().icon
  }

  // Translations for UI elements
  const translations = {
    en: {
      customizeExperience: "Customize Experience",
      adjustSettings: "Adjust settings for your needs",
      general: "General",
      colors: "Colors",
      modes: "Modes",
      language: "Language",
      soundVolume: "Sound Volume",
      fontSize: "Font Size",
      small: "Small",
      medium: "Medium",
      large: "Large",
      extraLarge: "Extra Large",
      colorTheme: "Color Theme",
      default: "Default",
      blueEclipse: "Blue Eclipse",
      calm: "Calm",
      highContrast: "High Contrast",
      userMode: "User Mode",
      standard: "Standard",
      child: "Child",
      elderly: "Elderly",
      standardDesc: "Standard mode with default settings.",
      childDesc: "Simplified interface with larger buttons and fun colors for children.",
      elderlyDesc: "High contrast mode with larger text and controls for better visibility.",
      applyClose: "Apply & Close",
      english: "English",
      spanish: "Español",
      french: "Français",
      german: "Deutsch",
      chinese: "中文",
      japanese: "日本語",
    },
    // Other translations remain the same...
  }

  // Get current language translations
  const t = translations[language] || translations.en

  // Get theme colors
  const themeColors = getThemeColors()

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={toggleSettings}
        style={{ color: getIconColor() }}
      >
        <Settings className="h-5 w-5" />
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          // Notify other components about the panel state change
          window.dispatchEvent(
            new CustomEvent("settingsPanelChange", {
              detail: { isOpen: open },
            }),
          )
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t.customizeExperience}</DialogTitle>
            <DialogDescription>{t.adjustSettings}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="general">{t.general}</TabsTrigger>
              <TabsTrigger value="colors">{t.colors}</TabsTrigger>
              <TabsTrigger value="modes">{t.modes}</TabsTrigger>
              <TabsTrigger value="language">{t.language}</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4" />
                    <Label htmlFor="volume">{t.soundVolume}</Label>
                  </div>
                  <span className="text-sm">{volume}%</span>
                </div>
                <Slider
                  id="volume"
                  min={0}
                  max={100}
                  step={1}
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4" />
                  <Label htmlFor="font-size">{t.fontSize}</Label>
                </div>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder={t.fontSize} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">{t.small}</SelectItem>
                    <SelectItem value="medium">{t.medium}</SelectItem>
                    <SelectItem value="large">{t.large}</SelectItem>
                    <SelectItem value="extra-large">{t.extraLarge}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="colors" className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <Label>{t.colorTheme}</Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={colorTheme === "default" ? "default" : "outline"}
                    className={cn(
                      "flex flex-col items-center justify-center h-20",
                      colorTheme === "default" ? themeColors.primary : themeColors.secondary,
                    )}
                    onClick={() => setColorTheme("default")}
                  >
                    <div className="flex space-x-1 mb-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-start"></div>
                      <div className="w-3 h-3 rounded-full bg-gradient-mid"></div>
                      <div className="w-3 h-3 rounded-full bg-gradient-end"></div>
                    </div>
                    <span className="text-xs">{t.default}</span>
                  </Button>

                  <Button
                    variant={colorTheme === "blue-eclipse" ? "default" : "outline"}
                    className={cn(
                      "flex flex-col items-center justify-center h-20",
                      colorTheme === "blue-eclipse" ? themeColors.primary : themeColors.secondary,
                    )}
                    onClick={() => setColorTheme("blue-eclipse")}
                  >
                    <div className="flex space-x-1 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#0d1b2a]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#1b263b]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#415a77]"></div>
                    </div>
                    <span className="text-xs">{t.blueEclipse}</span>
                  </Button>

                  <Button
                    variant={colorTheme === "calm" ? "default" : "outline"}
                    className={cn(
                      "flex flex-col items-center justify-center h-20",
                      colorTheme === "calm" ? themeColors.primary : themeColors.secondary,
                    )}
                    onClick={() => setColorTheme("calm")}
                  >
                    <div className="flex space-x-1 mb-2">
                      <div className="w-3 h-3 rounded-full bg-vibrant-teal"></div>
                      <div className="w-3 h-3 rounded-full bg-vibrant-green"></div>
                      <div className="w-3 h-3 rounded-full bg-vibrant-blue"></div>
                    </div>
                    <span className="text-xs">{t.calm}</span>
                  </Button>

                  <Button
                    variant={colorTheme === "high-contrast" ? "default" : "outline"}
                    className={cn(
                      "flex flex-col items-center justify-center h-20",
                      colorTheme === "high-contrast" ? themeColors.primary : themeColors.secondary,
                    )}
                    onClick={() => setColorTheme("high-contrast")}
                  >
                    <div className="flex space-x-1 mb-2">
                      <div className="w-3 h-3 rounded-full bg-black border border-gray-400"></div>
                      <div className="w-3 h-3 rounded-full bg-white border border-gray-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 border border-gray-400"></div>
                    </div>
                    <span className="text-xs">{t.highContrast}</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="modes" className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mode">{t.userMode}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={mode === "normal" ? "default" : "outline"}
                    className={cn(
                      "flex flex-col items-center justify-center h-24",
                      mode === "normal" ? themeColors.primary : themeColors.secondary,
                    )}
                    onClick={() => setMode("normal")}
                  >
                    <Settings className="h-8 w-8 mb-2" />
                    <span className="text-xs">{t.standard}</span>
                  </Button>

                  <Button
                    variant={mode === "child" ? "default" : "outline"}
                    className={cn(
                      "flex flex-col items-center justify-center h-24",
                      mode === "child" ? themeColors.primary : themeColors.secondary,
                    )}
                    onClick={() => setMode("child")}
                  >
                    <BabyIcon className="h-8 w-8 mb-2" />
                    <span className="text-xs">{t.child}</span>
                  </Button>

                  <Button
                    variant={mode === "elderly" ? "default" : "outline"}
                    className={cn(
                      "flex flex-col items-center justify-center h-24",
                      mode === "elderly" ? themeColors.primary : themeColors.secondary,
                    )}
                    onClick={() => setMode("elderly")}
                  >
                    <Glasses className="h-8 w-8 mb-2" />
                    <span className="text-xs">{t.elderly}</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {mode === "normal" && t.standardDesc}
                  {mode === "child" && t.childDesc}
                  {mode === "elderly" && t.elderlyDesc}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="language" className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <Label htmlFor="language">{t.language}</Label>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder={t.language} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t.english}</SelectItem>
                    <SelectItem value="es">{t.spanish}</SelectItem>
                    <SelectItem value="fr">{t.french}</SelectItem>
                    <SelectItem value="de">{t.german}</SelectItem>
                    <SelectItem value="zh">{t.chinese}</SelectItem>
                    <SelectItem value="ja">{t.japanese}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} className={themeColors.primary}>
              {t.applyClose}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
