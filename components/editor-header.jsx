"use client"

import Link from "next/link"

export function EditorHeader({ page, isSaving, saveStatus, onSave, onPublish, onAddComponent }) {
  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Page Info */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">{page.title}</h1>
            <p className="text-xs text-muted-foreground">{page.description}</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {saveStatus && <span className="text-xs text-green-600 dark:text-green-400 font-medium">{saveStatus}</span>}

          <button
            onClick={onAddComponent}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            + Add Component
          </button>

          <Link
            href={`/preview/${page.slug}`}
            target="_blank"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/90 transition-colors"
          >
            Preview
          </Link>

          <button
            onClick={onPublish}
            disabled={isSaving || page.published}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {page.published ? "Published" : "Publish"}
          </button>

          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          <Link
            href="/dashboard/pages"
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  )
}
