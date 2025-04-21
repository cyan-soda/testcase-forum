'use-client'

import { useEffect, useState } from 'react';

const LANGUAGE = 'language'
const isBrowser = typeof window !== 'undefined'

export const setLocalStorage = (name: string, value: string) => {
    if (isBrowser) {
        localStorage.setItem(name, JSON.stringify(value))
    }
}

export const getLocalStorage = (name: string) => {
    if (isBrowser) {
        const item = localStorage.getItem(name)
        return item ? JSON.parse(item) : null
    }
    return null
}

export const removeLocalStorage = (name: string) => {
    if (isBrowser) {
        localStorage.removeItem(name)
    }
}

// export function getLanguage() {
//     if (typeof window !== 'undefined') {
//         return localStorage.getItem('LANGUAGE')
//     }
//     return null
// }

// export function setLanguage(language: string) {
//     if (typeof window !== 'undefined') {
//         if (language) {
//             localStorage.setItem(LANGUAGE, language)
//         }
//     } 
// }

export function useLanguage() {
    const [language, setLanguageState] = useState<string | null>(null);
  
    // Load language from localStorage after mount
    useEffect(() => {
      const storedLanguage = getLocalStorage(LANGUAGE) || localStorage.getItem(LANGUAGE);
      setLanguageState(storedLanguage);
    }, []);
  
    // Set language and update localStorage
    const setLanguage = (newLanguage: string) => {
      if (newLanguage) {
        setLocalStorage(LANGUAGE, newLanguage);
        setLanguageState(newLanguage);
      }
    };
  
    return { language, setLanguage };
  }