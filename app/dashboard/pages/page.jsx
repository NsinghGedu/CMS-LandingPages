"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { authStorage } from "@/lib/storage"

export default function PagesPage() {
  const [pages, setPages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewPageForm, setShowNewPageForm] = useState(false)
  const [newPageTitle, setNewPageTitle] = useState("")
  const [newPageDescription, setNewPageDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchPages()
    if (searchParams.get("action") === "new") {
      setShowNewPageForm(true)
    }
  }, [searchParams])

  const fetchPages = async () => {
    try {
      const token = authStorage.getToken()
      const response = await fetch("/api/pages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPages(data.pages || [])
      }
    } catch (error) {
      console.error("Error fetching pages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePage = async (e) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const token = authStorage.getToken()
      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newPageTitle,
          description: newPageDescription,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewPageTitle("")
        setNewPageDescription("")
        setShowNewPageForm(false)
        fetchPages()
      }
    } catch (error) {
      console.error("Error creating page:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeletePage = async (pageId) => {
    if (!confirm("Are you sure you want to delete this page?")) return

    try {
      const token = authStorage.getToken()
      const response = await fetch(`/api/pages/slug/${pageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchPages()
      }
    } catch (error) {
      console.error("Error deleting page:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">My Pages</h2>
        <button
          onClick={() => setShowNewPageForm(!showNewPageForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
        >
          {showNewPageForm ? "Cancel" : "+ New Page"}
        </button>
      </div>

      {/* New Page Form */}
      {showNewPageForm && (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Create New Page</h3>
          <form onSubmit={handleCreatePage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Page Title</label>
              <input
                type="text"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder="My Awesome Page"
                className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea
                value={newPageDescription}
                onChange={(e) => setNewPageDescription(e.target.value)}
                placeholder="Page description..."
                className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
              />
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium"
            >
              {isCreating ? "Creating..." : "Create Page"}
            </button>
          </form>
        </div>
      )}

      {/* Pages List */}
      {pages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No pages yet. Create your first page!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pages.map((page) => (
            <div
              key={page._id}
              className="bg-card rounded-lg border border-border p-6 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{page.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{page.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      page.published
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {page.published ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-muted-foreground">{new Date(page.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/editor/${page.slug}`}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeletePage(page._id)}
                  className="px-4 py-2 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
