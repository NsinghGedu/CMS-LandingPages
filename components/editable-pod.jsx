"use client"

import { useState } from "react"

export function EditablePod({ component, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(component.data)

  const handleSave = () => {
    onUpdate({
      ...component,
      data: editData,
    })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="border-2 border-primary p-4 bg-background rounded-lg mb-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold mb-1">Pod Title</label>
            <input
              type="text"
              value={editData.title || ""}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-2 py-1 border border-input rounded text-sm"
              placeholder="Pod title"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Heading</label>
            <input
              type="text"
              value={editData.heading || ""}
              onChange={(e) => setEditData({ ...editData, heading: e.target.value })}
              className="w-full px-2 py-1 border border-input rounded text-sm"
              placeholder="Heading text"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Description</label>
            <textarea
              value={editData.description || ""}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full px-2 py-1 border border-input rounded text-sm"
              placeholder="Pod description"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Image URL</label>
            <input
              type="text"
              value={editData.imageUrl || ""}
              onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })}
              className="w-full px-2 py-1 border border-input rounded text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-2">
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
      </div>
    )
  }

  return (
    <div className="border-2 border-border p-4 bg-card rounded-lg mb-4 group hover:border-primary transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {editData.imageUrl && (
            <img
              src={editData.imageUrl || "/placeholder.svg"}
              alt={editData.title}
              className="w-full h-40 object-cover rounded mb-3"
              onError={(e) => {
                e.target.style.display = "none"
              }}
            />
          )}
          {editData.heading && <h3 className="font-bold text-foreground">{editData.heading}</h3>}
          {editData.description && <p className="text-sm text-muted-foreground mt-1">{editData.description}</p>}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(component.id)}
            className="p-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
