import { create } from 'zustand'
import { TUser } from '@/types/user'
import { persist, createJSONStorage } from 'zustand/middleware'

type AppState = {
  user: TUser | null
  setUser: (user: TUser | null) => void
}

export const useUserStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: TUser | null) => set({ user }),
    }),
    {
      name: 'user-storage', // Unique storage key
    //   storage: createJSONStorage(() => sessionStorage), // Persist state in sessionStorage
    }
  )
)
