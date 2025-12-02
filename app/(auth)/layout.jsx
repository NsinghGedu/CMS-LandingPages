"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authStorage } from "@/lib/storage"

export default function AuthLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = authStorage.getToken()
    if (token) {
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
