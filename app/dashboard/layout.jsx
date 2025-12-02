"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authStorage } from "@/lib/storage"

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = authStorage.getToken()
    const userData = authStorage.getUser()

    if (!token || !userData) {
      router.push("/login")
    } else {
      setUser(userData)
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    authStorage.clearAuth()
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 overflow-y-auto`}
      >
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {isSidebarOpen && <h2 className="text-lg font-bold text-sidebar-foreground">CMS</h2>}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-sidebar-accent rounded-md">
              ☰
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
          >
            <span>📊</span>
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            href="/dashboard/pages"
            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
          >
            <span>📄</span>
            {isSidebarOpen && <span>Pages</span>}
          </Link>
          <Link
            href="/dashboard/templates"
            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
          >
            <span>🎨</span>
            {isSidebarOpen && <span>Templates</span>}
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          {isSidebarOpen ? (
            <div className="space-y-2">
              <p className="text-sm text-sidebar-foreground font-medium">{user?.name}</p>
              <p className="text-xs text-sidebar-muted-foreground">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="w-full mt-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full px-2 py-2 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              ↪
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="text-sm text-muted-foreground">Welcome, {user?.name}</div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}
