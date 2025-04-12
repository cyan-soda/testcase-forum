'use-client'

import { TUser } from '@/types/user'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type State = {
    token: string | null
    isAuthenticated: boolean
    user: TUser | null
    googleAuthCode: string | null
}

export type Actions = {
    logIn: (token: string, user: TUser) => void
    logOut: () => void
    setGoogleAuthCode: (code: string) => void
    clearGoogleAuthCode: () => void
}

export const useAuthStore = create<State & Actions>()(
    persist(
        (set) => ({
            token: null,
            isAuthenticated: false,
            user: null,
            googleAuthCode: null,

            logIn: (token: string, user: TUser) => {
                localStorage.setItem('token', token)
                return set({ 
                    token, 
                    isAuthenticated: true,
                    user,
                });
            },

            logOut: () => {
                localStorage.removeItem('token')
                return set({ 
                    token: null, 
                    isAuthenticated: false,
                    user: null
                });
            },

            setGoogleAuthCode: (code: string) => {
                return set({ googleAuthCode: code });
            },
            clearGoogleAuthCode: () => {
                return set({ googleAuthCode: null });
            },
        }),
        {
            name: 'auth-storage', 
            // storage: createJSONStorage(() => sessionStorage), 
        }
    )
)
