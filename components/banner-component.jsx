"use client"

export function BannerComponent({ component, onUpdate, onDelete }) {
  const data = component.data
  const [isEditing, setIsEditing] = require("react").useState(false)
  const [editData, setEditData] = require("react").useState(data)

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
            <label className="block text-xs font-bold mb-1">Banner Text</label>
            <input
              type="text"
              value={editData.text}
              onChange={(e) => setEditData({ ...editData, text: e.target.value })}
              className="w-full px-2 py-1 border border-input rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Banner Height (px)</label>
            <input
              type="number"
              value={editData.height}
              onChange={(e) => setEditData({ ...editData, height: Number.parseInt(e.target.value) })}
              className="w-full px-2 py-1 border border-input rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Text Color</label>
            <input
              type="color"
              value={editData.textColor}
              onChange={(e) => setEditData({ ...editData, textColor: e.target.value })}
              className="w-full px-2 py-1 border border-input rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Background Color</label>
            <input
              type="color"
              value={editData.bgColor}
              onChange={(e) => setEditData({ ...editData, bgColor: e.target.value })}
              className="w-full px-2 py-1 border border-input rounded cursor-pointer"
            />
          </div>
        </div>

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
    <div className="border-2 border-border p-0 rounded-lg group overflow-hidden">
      <div
        style={{
          height: `${data.height}px`,
          backgroundColor: data.bgColor,
          color: data.textColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="w-full"
      >
        <p className="text-center font-bold text-lg">{data.text}</p>
      </div>

      <div className="flex gap-1 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-card border-t border-border">
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
