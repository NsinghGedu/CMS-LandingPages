"use client"

import { useEffect, useState } from "react"
import { authStorage } from "@/lib/storage"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPages: 0,
    publishedPages: 0,
    draftPages: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = authStorage.getToken()
        const response = await fetch("/api/pages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          const pages = data.pages || []

          setStats({
            totalPages: pages.length,
            publishedPages: pages.filter((p) => p.published).length,
            draftPages: pages.filter((p) => !p.published).length,
          })
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Pages */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Pages</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalPages}</p>
            </div>
            <div className="text-4xl">📄</div>
          </div>
        </div>

        {/* Published Pages */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Published</p>
              <p className="text-3xl font-bold text-foreground">{stats.publishedPages}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        {/* Draft Pages */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Drafts</p>
              <p className="text-3xl font-bold text-foreground">{stats.draftPages}</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dashboard/pages"
            className="bg-primary text-primary-foreground rounded-lg p-6 hover:bg-primary/90 transition-colors shadow-sm"
          >
            <h3 className="text-lg font-bold mb-2">📄 View All Pages</h3>
            <p className="text-sm opacity-90">Manage and edit your pages</p>
          </a>
          <a
            href="/dashboard/pages?action=new"
            className="bg-accent text-accent-foreground rounded-lg p-6 hover:bg-accent/90 transition-colors shadow-sm"
          >
            <h3 className="text-lg font-bold mb-2">➕ Create New Page</h3>
            <p className="text-sm opacity-90">Start building a new page</p>
          </a>
        </div>
      </div>
    </div>
  )
}
