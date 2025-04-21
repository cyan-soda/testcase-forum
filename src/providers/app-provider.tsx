'use client'

import { authService } from "@/service/auth"
import { useAuthStore } from "@/store/auth/auth-store"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  exp: number // Expiration time in seconds
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const allowedPaths = ['/auth']
  const { isAuthenticated, logIn, logOut, googleAuthCode } = useAuthStore()

  useEffect(() => {
    const authenticateUser = async () => {
      // Skip authentication check for allowed paths or if already authenticated
      if (allowedPaths.some(path => pathname.startsWith(path))) {
        return
      }

      // Handle Google OAuth login
      if (googleAuthCode && !isAuthenticated) {
        try {
          const response = await authService.loginGoogle(googleAuthCode)
          const data = await response.json()
          if (data.token) {
            logIn(data.token, data.user)
            router.push('/')
          }
        } catch (error) {
          console.error('Error exchanging code for token:', error)
          logOut() // Log out on error
          router.push('/auth')
        }
        return
      }

      // Check if token is expired
      const token = localStorage.getItem('token') // Assuming token is stored in localStorage
      if (token && isAuthenticated) {
        try {
          const decoded = jwtDecode<JwtPayload>(token)
          const currentTime = Math.floor(Date.now() / 1000)
          if (decoded.exp < currentTime) {
            logOut()
            router.push('/auth/log-in')
          }
        } catch (error) {
          console.error('Error decoding token:', error)
          logOut()
          router.push('/auth/log-in')
        }
      } else if (!token && isAuthenticated) {
        logOut()
        router.push('/auth/log-in')
      }
    }

    authenticateUser()

    // Optional: Periodically check token expiration
    const interval = setInterval(() => {
      const token = localStorage.getItem('token')
      if (token && isAuthenticated) {
        try {
          const decoded = jwtDecode<JwtPayload>(token)
          const currentTime = Math.floor(Date.now() / 1000)
          if (decoded.exp < currentTime) {
            logOut()
            router.push('/auth/log-in')
          }
        } catch (error) {
          console.error('Error decoding token:', error)
          logOut()
          router.push('/auth/log-in')
        }
      }
    }, 60000) // Check every 60 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [googleAuthCode, isAuthenticated, logIn, logOut, router, pathname])

  return children
}