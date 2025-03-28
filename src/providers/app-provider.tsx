'use client'

import { authService } from "@/service/auth"
import { useAuthStore } from "@/store/auth/auth-store"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function AppProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const allowedPaths = ['/auth']
    const { isAuthenticated, logIn, logOut, googleAuthCode } = useAuthStore()

    console.log('authcode from app-provider:', googleAuthCode)
    console.log('isAuthenticated from app-provider:', isAuthenticated)
    const token = localStorage.getItem('token')
    console.log('token from app-provider:', token)

    useEffect(() => {
        const authenticateUser = async () => {
            if (isAuthenticated || allowedPaths.some(path => pathname.startsWith(path))) {
                return
            }

            if (googleAuthCode) {
                console.log('OAuth Code from app-provider:', googleAuthCode)
                try {
                    const response = await authService.loginGoogle(googleAuthCode)
                    const data = await response.json()
                    console.log('Google Login Success:', data)
                    if (data.token) {
                        logIn(data.token, data.user)
                    }
                    router.push('/')
                } catch (error) {
                    console.error('Error exchanging code for token:', error)
                }
            }
        }

        authenticateUser()
    }, [])

    return children
}