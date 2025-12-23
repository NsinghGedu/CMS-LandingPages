"use client"

export function StylePanel({ component, onUpdate }) {
  if (!component || !component.data) {
    return (
      <div className="bg-card border border-border p-4 rounded-lg">
        <p className="text-xs text-muted-foreground">Select a component to edit styles</p>
      </div>
    )
  }

  const data = component.data

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
    <div className="bg-card border border-border p-4 rounded-lg space-y-3">
      <p className="text-xs font-bold text-muted-foreground uppercase">Style Settings</p>

      <div>
        <label className="block text-xs font-bold mb-2">Text Alignment</label>
        <div className="flex gap-2">
          {["left", "center", "right", "justify"].map((align) => (
            <button
              key={align}
              onClick={() => handleStyleChange("textAlign", align)}
              className={`px-2 py-1 text-xs rounded capitalize ${
                data.style?.textAlign === align
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold mb-2">Font Size</label>
        <select
          value={data.style?.fontSize || "base"}
          onChange={(e) => handleStyleChange("fontSize", e.target.value)}
          className="w-full px-2 py-1 border border-input rounded text-sm"
        >
          <option value="sm">Small</option>
          <option value="base">Base</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold mb-2">Text Color</label>
        <input
          type="color"
          value={data.style?.color || "#000000"}
          onChange={(e) => handleStyleChange("color", e.target.value)}
          className="w-full px-2 py-2 border border-input rounded cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-xs font-bold mb-2">Background Color</label>
        <input
          type="color"
          value={data.style?.backgroundColor || "#ffffff"}
          onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
          className="w-full px-2 py-2 border border-input rounded cursor-pointer"
        />
      </div>
    </div>
  )
}
