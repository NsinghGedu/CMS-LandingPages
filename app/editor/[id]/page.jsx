"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageEditor } from "@/components/page-editor"

export default function EditorPage() {
  const [page, setPage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/pages/${id}`)
        if (response.ok) {
          const data = await response.json()
          setPage(data.page)
        } else {
          router.push("/dashboard/pages")
        }
      } catch (error) {
        console.error("Error fetching page:", error)
        router.push("/dashboard/pages")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPage()
  }, [id, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (!page) {
    return <div>Page not found</div>
  }

  return <PageEditor initialPage={page} />
}
