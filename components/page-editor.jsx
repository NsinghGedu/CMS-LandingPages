"use client"

import { useState } from "react"
import Link from "next/link"
import { authStorage } from "@/lib/storage"
import { EditorToolbar } from "./editor-toolbar"
import { EditablePod } from "./editable-pod"

const generateId = () => `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export function PageEditor({ initialPage }) {
  const [page, setPage] = useState(initialPage)
  const [components, setComponents] = useState(initialPage?.components || [])
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState("")

  const addComponent = (type) => {
    const newComponent = {
      id: generateId(),
      type,
      data: getDefaultData(type),
    }
    setComponents([...components, newComponent])
  }

  const getDefaultData = (type) => {
    const defaults = {
      heading: { text: "New Heading", level: "h1" },
      text: { content: "Add your rich text content here..." },
      image: { url: "", alt: "Image" },
      video: { url: "", title: "Video" },
      youtube: { videoId: "", title: "YouTube Video" },
      pod: { title: "", heading: "", description: "", imageUrl: "" },
      split: { leftContent: "", rightContent: "" },
    }
    return defaults[type] || {}
  }

  const updateComponent = (updatedComponent) => {
    setComponents(components.map((comp) => (comp.id === updatedComponent.id ? updatedComponent : comp)))
  }

  const deleteComponent = (componentId) => {
    setComponents(components.filter((comp) => comp.id !== componentId))
  }

  const savePage = async () => {
    setIsSaving(true)
    setSaveStatus("")

    try {
      const token = authStorage.getToken()
      const response = await fetch(`/api/pages/${page._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: page.title,
          description: page.description,
          components,
        }),
      })

      if (response.ok) {
        setSaveStatus("Saved successfully!")
        setTimeout(() => setSaveStatus(""), 3000)
      } else {
        setSaveStatus("Error saving page")
      }
    } catch (error) {
      console.error("Error saving page:", error)
      setSaveStatus("Error saving page")
    } finally {
      setIsSaving(false)
    }
  }

  const publishPage = async () => {
    setIsSaving(true)

    try {
      const token = authStorage.getToken()
      const response = await fetch(`/api/pages/${page._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: page.title,
          description: page.description,
          components,
          published: true,
        }),
      })

      if (response.ok) {
        setPage({ ...page, published: true })
        setSaveStatus("Page published!")
        setTimeout(() => setSaveStatus(""), 3000)
      } else {
        setSaveStatus("Error publishing page")
      }
    } catch (error) {
      console.error("Error publishing page:", error)
      setSaveStatus("Error publishing page")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Toolbar */}
      <div className="w-64 border-r border-border overflow-y-auto">
        <EditorToolbar onAddComponent={addComponent} />
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{page.title}</h1>
            <p className="text-sm text-muted-foreground">{page.description}</p>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus && <span className="text-sm text-green-600 dark:text-green-400">{saveStatus}</span>}
            <Link
              href={`/preview/${page._id}`}
              target="_blank"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 font-medium"
            >
              Preview
            </Link>
            <button
              onClick={publishPage}
              disabled={isSaving || page.published}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {page.published ? "Published" : "Publish"}
            </button>
            <button
              onClick={savePage}
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <Link
              href="/dashboard/pages"
              className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 font-medium"
            >
              Back
            </Link>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {components.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No components yet. Add one from the toolbar to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {components.map((component) => (
                  <ComponentRenderer
                    key={component.id}
                    component={component}
                    onUpdate={updateComponent}
                    onDelete={deleteComponent}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ComponentRenderer({ component, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(component.data)

  const handleSave = () => {
    onUpdate({
      ...component,
      data: editData,
    })
    setIsEditing(false)
  }

  if (component.type === "pod") {
    return <EditablePod component={component} onUpdate={onUpdate} onDelete={onDelete} />
  }

  if (isEditing) {
    return (
      <div className="border-2 border-primary p-4 bg-background rounded-lg mb-4">
        {component.type === "heading" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1">Heading Level</label>
              <select
                value={editData.level}
                onChange={(e) => setEditData({ ...editData, level: e.target.value })}
                className="w-full px-2 py-1 border border-input rounded text-sm"
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Text</label>
              <input
                type="text"
                value={editData.text}
                onChange={(e) => setEditData({ ...editData, text: e.target.value })}
                className="w-full px-2 py-1 border border-input rounded text-sm"
              />
            </div>
          </div>
        )}

        {component.type === "text" && (
          <div>
            <label className="block text-xs font-bold mb-1">Content</label>
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              className="w-full px-2 py-1 border border-input rounded text-sm"
              rows="4"
            />
          </div>
        )}

        {component.type === "image" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1">Image URL</label>
              <input
                type="text"
                value={editData.url}
                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                className="w-full px-2 py-1 border border-input rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Alt Text</label>
              <input
                type="text"
                value={editData.alt}
                onChange={(e) => setEditData({ ...editData, alt: e.target.value })}
                className="w-full px-2 py-1 border border-input rounded text-sm"
              />
            </div>
          </div>
        )}

        {component.type === "video" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1">Video URL</label>
              <input
                type="text"
                value={editData.url}
                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                className="w-full px-2 py-1 border border-input rounded text-sm"
              />
            </div>
          </div>
        )}

        {component.type === "youtube" && (
          <div>
            <label className="block text-xs font-bold mb-1">YouTube Video ID</label>
            <input
              type="text"
              value={editData.videoId}
              onChange={(e) => setEditData({ ...editData, videoId: e.target.value })}
              className="w-full px-2 py-1 border border-input rounded text-sm"
              placeholder="dQw4w9WgXcQ"
            />
          </div>
        )}

        {component.type === "split" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1">Left Content</label>
              <textarea
                value={editData.leftContent}
                onChange={(e) => setEditData({ ...editData, leftContent: e.target.value })}
                className="w-full px-2 py-1 border border-input rounded text-sm"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Right Content</label>
              <textarea
                value={editData.rightContent}
                onChange={(e) => setEditData({ ...editData, rightContent: e.target.value })}
                className="w-full px-2 py-1 border border-input rounded text-sm"
                rows="2"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded font-medium hover:bg-primary/90"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded font-medium hover:bg-muted/80"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border-2 border-border p-4 bg-card rounded-lg group hover:border-primary transition-colors">
      {component.type === "heading" && (
        <div
          className={`font-bold text-${editData.level === "h1" ? "3xl" : editData.level === "h2" ? "2xl" : "xl"} text-foreground`}
        >
          {editData.text}
        </div>
      )}

      {component.type === "text" && <p className="text-foreground whitespace-pre-wrap">{editData.content}</p>}

      {component.type === "image" && editData.url && (
        <img
          src={editData.url || "/placeholder.svg"}
          alt={editData.alt}
          className="w-full rounded-md max-h-96 object-cover"
          onError={(e) => {
            e.target.style.display = "none"
          }}
        />
      )}

      {component.type === "video" && editData.url && (
        <video src={editData.url} controls className="w-full rounded-md max-h-96" />
      )}

      {component.type === "youtube" && editData.videoId && (
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${editData.videoId}`}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-md"
        />
      )}

      {component.type === "split" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-foreground">{editData.leftContent}</div>
          <div className="text-foreground">{editData.rightContent}</div>
        </div>
      )}

      <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(component.id)}
          className="px-3 py-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
