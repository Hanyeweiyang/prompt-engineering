"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

// Statically import all translation files
import enTranslations from "../locales/en.json"
import zhTranslations from "../locales/zh.json"

type Language = "en" | "zh"

interface Translation {
  [key: string]: string
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Map of available translations
const allTranslations: Record<Language, Translation> = {
  en: enTranslations,
  zh: zhTranslations,
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [translations, setTranslations] = useState<Translation>(enTranslations) // Default to English

  useEffect(() => {
    // Update translations when language changes
    setTranslations(allTranslations[language] || enTranslations) // Fallback to English if language not found
  }, [language])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string>) => {
      let translatedString = translations[key] || key // Fallback to key if not found

      if (params) {
        for (const paramKey in params) {
          translatedString = translatedString.replace(`{${paramKey}}`, params[paramKey])
        }
      }
      return translatedString
    },
    [translations],
  )

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
