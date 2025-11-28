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

        if (!slug) {
          return
        }

        const token = authStorage.getToken()

        if (!token) {
          setError("Not authenticated")
          router.push("/login")
          return
        }

        const url = `/api/pages/slug/${slug}`

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setPage(data.page)
        } else {
          const errorData = await response.json().catch(() => ({}))
          setError(errorData.error || `Failed to load page (${response.status})`)
          setTimeout(() => router.push("/dashboard/pages"), 2000)
        }
      } catch (error) {
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
