"use client"

import { useState } from "react"
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

export function EditorCanvas({
  components,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
}) {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        {components.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No components yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {components.map((component) => (
              <CanvasComponent
                key={component.id}
                component={component}
                isSelected={selectedComponentId === component.id}
                onSelect={() => onSelectComponent(component.id)}
                onUpdate={onUpdateComponent}
                onDelete={onDeleteComponent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CanvasComponent({ component, isSelected, onSelect, onUpdate, onDelete }) {
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
