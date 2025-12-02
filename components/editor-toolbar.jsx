"use client"

const componentTypes = [
  { type: "heading", icon: "H", label: "Heading" },
  { type: "text", icon: "T", label: "Text" },
  { type: "image", icon: "🖼️", label: "Image" },
  { type: "video", icon: "▶️", label: "Video" },
  { type: "youtube", icon: "▶️", label: "YouTube" },
  { type: "pod", icon: "📦", label: "Pod" },
  { type: "split", icon: "⬌", label: "Split" },
]

export function EditorToolbar({ onAddComponent }) {
  return (
    <div className="bg-card border-b border-border p-4 sticky top-0 z-10">
      <p className="text-xs font-bold text-muted-foreground mb-3 uppercase">Add Components</p>
      <div className="flex gap-2 flex-wrap">
        {componentTypes.map((component) => (
          <button
            key={component.type}
            onClick={() => onAddComponent(component.type)}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <span>{component.icon}</span>
            {component.label}
          </button>
        ))}
      </div>
    </div>
  )
}
