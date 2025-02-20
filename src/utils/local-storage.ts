const LANGUAGE = 'language'

export function getLanguage() {
    return localStorage.getItem('LANGUAGE')
}

export function setLanguage(language: string) {
    if (language) {
        localStorage.setItem(LANGUAGE, language)
    }
}