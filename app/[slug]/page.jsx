"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import Link from "next/link"
import { PageRenderer } from "@/components/page-renderer"
import { authStorage } from "@/lib/storage"


export default function PreviewPage({ params }) {
  const { slug } = use(params)
  const [page, setPage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPage = async () => {
      const token = authStorage.getToken()
      try {
        const url = `/api/pages/slug/${slug}`
       const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setPage(data.page) 
        } else {
          const errorData = await response.json()
          setError("Failed to load page")
        }
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchPage()
    }
  }, [slug])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{error || "Page not found"}</p>
          <Link href="/dashboard" className="text-primary hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {page.components && page.components.length > 0 ? (
          <PageRenderer components={page.components} />
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>No content to display</p>
          </div>
        )}
      </main>
    </div>
  )
}
