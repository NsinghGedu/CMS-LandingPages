"use client"
import { X } from "lucide-react"

const COMPONENT_LIBRARY = [
  { type: "heading", label: "Heading", description: "Add a heading to your page", icon: "H" },
  { type: "text", label: "Text", description: "Add rich text content", icon: "T" },
  { type: "image", label: "Image", description: "Insert an image", icon: "🖼️" },
  { type: "video", label: "Video", description: "Embed a video file", icon: "▶️" },
  { type: "youtube", label: "YouTube", description: "Embed a YouTube video by ID", icon: "▶️" },
  { type: "banner", label: "Banner", description: "Add a full-width banner", icon: "📢" },
  { type: "pod", label: "Pod", description: "Editable content pod with image", icon: "📦" },
  { type: "split", label: "Split", description: "Split content layout", icon: "⬌" },
]

export function ComponentLibraryModal({ isOpen, onClose, onSelectComponent }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-96 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Add Component</h2>
            <p className="text-sm text-muted-foreground mt-1">Select a component to add to your page</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Components Grid */}
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            {COMPONENT_LIBRARY.map((component) => (
              <button
                key={component.type}
                onClick={() => {
                  onSelectComponent(component.type)
                  onClose()
                }}
                className="text-left p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{component.icon}</div>
                <h3 className="font-semibold text-foreground">{component.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{component.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
