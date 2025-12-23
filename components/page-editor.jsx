"use client"

import { useState } from "react"
import { authStorage } from "@/lib/storage"
import { ComponentLibraryModal } from "./component-library-modal"
import { EditorHeader } from "./editor-header"
import { ComponentPropertiesPanel } from "./component-properties-panel"
import { EditablePod } from "./editable-pod"

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
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

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

  const selectedComponent = components.find((c) => c.id === selectedComponentId)

  return (
    <div className="flex h-screen bg-background">
      <ComponentLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectComponent={addComponent}
      />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <EditorHeader
          page={page}
          isSaving={isSaving}
          saveStatus={saveStatus}
          onSave={savePage}
          onPublish={publishPage}
          onAddComponent={() => setIsLibraryOpen(true)}
        />

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Canvas */}
          <div className="flex-1 overflow-y-auto p-8 bg-muted/30">
            <div className="max-w-4xl mx-auto">
              {components.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No components yet</p>
                  <button
                    onClick={() => setIsLibraryOpen(true)}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
                  >
                    + Add Component
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {components.map((component) => (
                    <ComponentPreview
                      key={component.id}
                      component={component}
                      isSelected={selectedComponentId === component.id}
                      onSelect={() => setSelectedComponentId(component.id)}
                      onUpdate={updateComponent}
                      onDelete={deleteComponent}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Properties Panel */}
          <ComponentPropertiesPanel component={selectedComponent} onUpdate={updateComponent} />
        </div>
      </div>
    </div>
  )
}

function ComponentPreview({ component, isSelected, onSelect, onUpdate, onDelete }) {
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
      <div className="border-2 border-primary p-4 bg-card rounded-lg">
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
    <div
      onClick={onSelect}
      className={`bg-card border-2 rounded-lg p-4 cursor-pointer transition-all group ${
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
      }`}
    >
      <div className="mb-3">
        {component.type === "heading" && <HeadingRenderer editData={editData} />}
        {component.type === "text" && <TextRenderer editData={editData} />}
        {component.type === "image" && <ImageRenderer editData={editData} />}
        {component.type === "video" && <VideoRenderer editData={editData} />}
        {component.type === "youtube" && <YouTubeRenderer editData={editData} />}
        {component.type === "split" && <SplitRenderer editData={editData} />}
        {component.type === "banner" && <BannerRenderer editData={editData} />}
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(true)
          }}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(component.id)
          }}
          className="px-3 py-1 text-xs bg-red-600/10 text-red-600 rounded hover:bg-red-600/20"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
