"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

export function ComponentPropertiesPanel({ component, onUpdate }) {
  const [expanded, setExpanded] = useState(true)

  if (!component) {
    return (
      <div className="w-80 border-l border-border bg-card p-6 flex items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">Select a component to edit properties</p>
      </div>
    )
  }

  const data = component.data

  const handleChange = (key, value) => {
    onUpdate({
      ...component,
      data: {
        ...data,
        [key]: value,
      },
    })
  }

  const handleStyleChange = (key, value) => {
    onUpdate({
      ...component,
      data: {
        ...data,
        style: {
          ...data.style,
          [key]: value,
        },
      },
    })
  }

  return (
    <div className="w-80 border-l border-border bg-card overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground uppercase">Properties</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown size={16} className={`transition-transform ${expanded ? "" : "-rotate-90"}`} />
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          {/* Component Type Badge */}
          <div className="px-3 py-2 bg-primary/10 text-primary rounded text-xs font-semibold capitalize">
            {component.type}
          </div>

          {/* Content Section */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-2">Content</label>
            {component.type === "heading" && (
              <>
                <input
                  type="text"
                  value={data.text || ""}
                  onChange={(e) => handleChange("text", e.target.value)}
                  placeholder="Enter heading text"
                  className="w-full px-3 py-2 border border-input rounded-md text-sm mb-2"
                />
                <select
                  value={data.level || "h1"}
                  onChange={(e) => handleChange("level", e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                >
                  <option value="h1">H1</option>
                  <option value="h2">H2</option>
                  <option value="h3">H3</option>
                </select>
              </>
            )}

            {component.type === "text" && (
              <textarea
                value={data.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
                placeholder="Enter text content"
                rows="4"
                className="w-full px-3 py-2 border border-input rounded-md text-sm"
              />
            )}

            {component.type === "image" && (
              <>
                <input
                  type="text"
                  value={data.url || ""}
                  onChange={(e) => handleChange("url", e.target.value)}
                  placeholder="Image URL"
                  className="w-full px-3 py-2 border border-input rounded-md text-sm mb-2"
                />
                <input
                  type="text"
                  value={data.alt || ""}
                  onChange={(e) => handleChange("alt", e.target.value)}
                  placeholder="Alt text"
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                />
              </>
            )}

            {component.type === "youtube" && (
              <input
                type="text"
                value={data.videoId || ""}
                onChange={(e) => handleChange("videoId", e.target.value)}
                placeholder="YouTube Video ID"
                className="w-full px-3 py-2 border border-input rounded-md text-sm"
              />
            )}

            {component.type === "banner" && (
              <>
                <input
                  type="text"
                  value={data.text || ""}
                  onChange={(e) => handleChange("text", e.target.value)}
                  placeholder="Banner text"
                  className="w-full px-3 py-2 border border-input rounded-md text-sm mb-2"
                />
                <input
                  type="number"
                  value={data.height || 200}
                  onChange={(e) => handleChange("height", Number.parseInt(e.target.value))}
                  placeholder="Height (px)"
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                />
              </>
            )}
          </div>

          {/* Style Section */}
          <div className="border-t border-border pt-4">
            <h4 className="text-xs font-bold text-foreground mb-3">Styling</h4>

            {/* Text Alignment */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-foreground mb-2">Text Align</label>
              <div className="flex gap-1">
                {["left", "center", "right"].map((align) => (
                  <button
                    key={align}
                    onClick={() => handleStyleChange("textAlign", align)}
                    className={`flex-1 px-2 py-1 text-xs rounded capitalize transition-colors ${
                      data.style?.textAlign === align
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {align[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-foreground mb-2">Font Size</label>
              <select
                value={data.style?.fontSize || "base"}
                onChange={(e) => handleStyleChange("fontSize", e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md text-sm"
              >
                <option value="sm">Small</option>
                <option value="base">Base</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>

            {/* Text Color */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-foreground mb-2">Text Color</label>
              <input
                type="color"
                value={data.style?.color || "#000000"}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                className="w-full h-10 border border-input rounded-md cursor-pointer"
              />
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2">Background Color</label>
              <input
                type="color"
                value={data.style?.backgroundColor || "#ffffff"}
                onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                className="w-full h-10 border border-input rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
