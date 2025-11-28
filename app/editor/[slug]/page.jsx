"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import { PageEditor } from "@/components/page-editor"
import { authStorage } from "@/lib/storage"

export default function EditorPage({ params }) {
  const { slug } = use(params)
  const [page, setPage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPage = async () => {
      try {
        // Ensure slug is available
        if (!slug) {
          console.log("[v0] Slug not available yet")
          return
        }

        console.log("[v0] Loading page with slug:", slug)

        const token = authStorage.getToken()
        console.log("[v0] Token exists:", !!token)

        if (!token) {
          setError("Not authenticated")
          router.push("/login")
          return
        }

        const url = `/api/pages/slug/${slug}`
        console.log("[v0] Fetching from:", url)

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        console.log("[v0] Fetch response status:", response.status)
        console.log("[v0] Response URL:", response.url)

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Page loaded successfully:", data.page)
          setPage(data.page)
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.log("[v0] Error response:", response.status, errorData)
          setError(errorData.error || `Failed to load page (${response.status})`)
          setTimeout(() => router.push("/dashboard/pages"), 2000)
        }
      } catch (error) {
        console.error("[v0] Error fetching page:", error)
        setError("Error fetching page: " + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPage()
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
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-4">Error: {error}</div>
          <button
            onClick={() => (window.location.href = "/dashboard/pages")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Pages
          </button>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-muted-foreground text-lg mb-4">No page data available</div>
          <button
            onClick={() => (window.location.href = "/dashboard/pages")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Pages
          </button>
        </div>
      </div>
    )
  }

  return <PageEditor initialPage={page} />
}
