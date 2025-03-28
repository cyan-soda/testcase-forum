import { TUser } from '@/types/user'
import { create } from 'zustand'

export type State = {
    token: string | null
    isAuthenticated: boolean
    user: TUser | null
}

export type Actions = {
    logIn: (token: string, user: TUser) => void
    logOut: () => void
}

export const useAuthStore = create<State & Actions>((set) => ({
    token: null,
    isAuthenticated: false,
    user: null,

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
}))