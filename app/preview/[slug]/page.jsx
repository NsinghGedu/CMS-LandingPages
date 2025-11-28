"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import Link from "next/link"
import { PageRenderer } from "@/components/page-renderer"

export default function PreviewPage({ params }) {
  const { slug } = use(params)
  const [page, setPage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        console.log("[v0] Fetching preview page with slug:", slug)
        const response = await fetch(`/api/pages/preview/${slug}`)
        console.log("[v0] Preview response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Page data received:", !!data.page)
          setPage(data.page)
        } else {
          const errorData = await response.json()
          console.log("[v0] Preview error:", errorData)
          setError("Failed to load page")
        }
      } catch (error) {
        console.error("[v0] Error fetching page:", error)
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
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{page.title}</h1>
            <p className="text-sm text-muted-foreground">{page.description}</p>
          </div>
          <div className="flex items-center gap-3">
            {page.published && (
              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full text-sm font-medium">
                Published
              </span>
            )}
            <Link
              href={`/editor/${page.slug}`}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>

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

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          <p>Built with CMS</p>
        </div>
      </footer>
    </div>
  )
}
