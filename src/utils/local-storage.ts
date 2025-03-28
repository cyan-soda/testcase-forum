const LANGUAGE = 'language'
const isBrowser = typeof window !== 'undefined'

export const setLocalStorage = (name: string, value: any) => {
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

export function getLanguage() {
    return localStorage.getItem('LANGUAGE')
}

export function setLanguage(language: string) {
    if (language) {
        localStorage.setItem(LANGUAGE, language)
    }
}