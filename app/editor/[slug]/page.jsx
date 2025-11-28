"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageEditor } from "@/components/page-editor"
import { authStorage } from "@/lib/storage"

export default function EditorPage() {
  const [page, setPage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { slug } = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const token = authStorage.getToken()
        if (!token) {
          setError("Not authenticated")
          router.push("/login")
          return
        }

        const response = await fetch(`/api/pages/slug/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("[v0] Fetch page response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Page loaded:", data.page)
          setPage(data.page)
        } else {
          const errorData = await response.json()
          console.log("[v0] Error response:", errorData)
          setError(errorData.error || "Failed to load page")
          router.push("/dashboard/pages")
        }
      } catch (error) {
        console.error("[v0] Error fetching page:", error)
        setError("Error fetching page")
        router.push("/dashboard/pages")
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchPage()
    }
  }, [slug, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  if (!page) {
    return <div>Page not found</div>
  }

  return <PageEditor initialPage={page} />
}
