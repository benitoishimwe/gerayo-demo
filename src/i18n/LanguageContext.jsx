import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { translations } from './translations'

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'rw', label: 'Kinyarwanda', native: 'Ikinyarwanda' },
]

const LanguageContext = createContext(null)

function resolve(dict, key) {
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict)
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useLocalStorage('gerayo-language', 'rw')

  const t = useMemo(() => {
    return (key, vars) => {
      const dict = translations[language] || translations.en
      let str = resolve(dict, key)
      if (str === undefined) str = resolve(translations.en, key)
      if (str === undefined) return key
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replaceAll(`{${k}}`, v)
        })
      }
      return str
    }
  }, [language])

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
