"use client"

import { useState } from "react"
import Link from "next/link"
import { authStorage } from "@/lib/storage"
import { EditorToolbar } from "./editor-toolbar"
import { EditablePod } from "./editable-pod"
import { StylePanel } from "./style-panel"

import { HeadingEditor } from "./editors/heading-editor"
import { TextEditor } from "./editors/text-editor"
import { ImageEditor } from "./editors/image-editor"
import { VideoEditor } from "./editors/video-editor"
import { YouTubeEditor } from "./editors/youtube-editor"
import { SplitEditor } from "./editors/split-editor"

import { HeadingRenderer } from "./renderers/heading-renderer"
import { TextRenderer } from "./renderers/text-renderer"
import { ImageRenderer } from "./renderers/image-renderer"
import { VideoRenderer } from "./renderers/video-renderer"
import { YouTubeRenderer } from "./renderers/youtube-renderer"
import { SplitRenderer } from "./renderers/split-renderer"
import { BannerRenderer } from "./renderers/banner-renderer"

const generateId = () => `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export function PageEditor({ initialPage }) {
  const [page, setPage] = useState(initialPage)
  const [components, setComponents] = useState(initialPage?.components || [])
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState("")
  const [selectedComponentId, setSelectedComponentId] = useState(null)

  const addComponent = (type) => {
    const newComponent = {
      id: generateId(),
      type,
      data: getDefaultData(type),
    }
    setComponents([...components, newComponent])
    setSelectedComponentId(newComponent.id)
  }

  const getDefaultData = (type) => {
    const defaults = {
      heading: { text: "New Heading", level: "h1", style: {} },
      text: { content: "Add your rich text content here...", style: {} },
      image: { url: "", alt: "Image", style: {} },
      video: { url: "", title: "Video", style: {} },
      youtube: { videoId: "", title: "YouTube Video", style: {} },
      pod: { title: "", heading: "", description: "", imageUrl: "", style: {} },
      split: { leftContent: "", rightContent: "", style: {} },
      banner: { text: "Welcome to our site", height: 200, bgColor: "#3b82f6", textColor: "#ffffff", style: {} },
    }
    return defaults[type] || {}
  }

  const updateComponent = (updatedComponent) => {
    setComponents(components.map((comp) => (comp.id === updatedComponent.id ? updatedComponent : comp)))
  }

  const deleteComponent = (componentId) => {
    setComponents(components.filter((comp) => comp.id !== componentId))
    setSelectedComponentId(null)
  }

  const savePage = async () => {
    setIsSaving(true)
    setSaveStatus("")

    try {
      const token = authStorage.getToken()
      const response = await fetch(`/api/pages/slug/${page.slug}`, {
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
      const response = await fetch(`/api/pages/slug/${page.slug}/publish`, {
        method: "POST",
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
      {/* Left Sidebar */}
      <div className="w-64 border-r border-border overflow-y-auto flex flex-col">
        <EditorToolbar onAddComponent={addComponent} />
        <div className="flex-1 p-4">
          {selectedComponentId && components.find((c) => c.id === selectedComponentId) && (
            <StylePanel component={components.find((c) => c.id === selectedComponentId)} onUpdate={updateComponent} />
          )}
        </div>
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
              href={`/preview/${page.slug}`}
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
                  <div
                    key={component.id}
                    onClick={() => setSelectedComponentId(component.id)}
                    className={`rounded-lg transition-all ${
                      selectedComponentId === component.id ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <ComponentRenderer
                      component={component}
                      onUpdate={updateComponent}
                      onDelete={deleteComponent}
                      isSelected={selectedComponentId === component.id}
                      setSelectedComponentId={setSelectedComponentId} // Added setSelectedComponentId here
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ComponentRenderer({ component, onUpdate, onDelete, isSelected, setSelectedComponentId }) {
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

  if (isSelected && isEditing) {
    return (
      <div className="border-2 border-primary p-4 bg-background rounded-lg mb-4">
        {component.type === "heading" && <HeadingEditor editData={editData} setEditData={setEditData} />}
        {component.type === "text" && <TextEditor editData={editData} setEditData={setEditData} />}
        {component.type === "image" && <ImageEditor editData={editData} setEditData={setEditData} />}
        {component.type === "video" && <VideoEditor editData={editData} setEditData={setEditData} />}
        {component.type === "youtube" && <YouTubeEditor editData={editData} setEditData={setEditData} />}
        {component.type === "split" && <SplitEditor editData={editData} setEditData={setEditData} />}

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
      {component.type === "heading" && <HeadingRenderer editData={editData} />}
      {component.type === "text" && <TextRenderer editData={editData} />}
      {component.type === "image" && <ImageRenderer editData={editData} />}
      {component.type === "video" && <VideoRenderer editData={editData} />}
      {component.type === "youtube" && <YouTubeRenderer editData={editData} />}
      {component.type === "split" && <SplitRenderer editData={editData} />}
      {component.type === "banner" && <BannerRenderer editData={editData} />}

      <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Edit
        </button>
        <button
          onClick={() => {
            onDelete(component.id)
            setSelectedComponentId(null)
          }}
          className="px-3 py-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
