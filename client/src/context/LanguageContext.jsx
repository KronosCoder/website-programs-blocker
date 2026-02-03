import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations } from '../utils/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language')
        return saved || 'en'
    })

    useEffect(() => {
        localStorage.setItem('language', language)
        // Set body data-lang attribute for font switching
        document.body.setAttribute('data-lang', language)
    }, [language])

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'th' : 'en')
    }

    const t = useCallback((key) => {
        return translations[language][key] || key
    }, [language])

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
