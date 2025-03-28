'use client'

import { useAuthStore } from "@/store/auth/auth-store"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function AppProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const allowedPaths = ['/auth']
    const { isAuthenticated, logIn, logOut } = useAuthStore()

    useEffect(() => {
        const authenticateUser = async () => {
            if (isAuthenticated || allowedPaths.some(path => pathname.startsWith(path))) {
                return
            }
            // login, logout logic to check if user is authenticated
            const token = localStorage.getItem('token')
            const user = localStorage.getItem('user')
            const code = searchParams.get('code')
            if (code) {
                try {
                    const response = await fetch('http://localhost:3000/auth/google', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ code })
                    })
                    const data = await response.json()
                    console.log('Google Login Success:', data)
                    if (data.token) {
                        logIn(data.token, data.user)
                        // localStorage.setItem('token', data.token)
                        // localStorage.setItem('user', JSON.stringify(data.user))
                    }
                    router.push('/')
                } catch (error) {
                    console.error('Error exchanging code for token:', error)
                }
            }
        }

        authenticateUser()
    }, [isAuthenticated, logIn, logOut, router, pathname, searchParams])

    return children
}