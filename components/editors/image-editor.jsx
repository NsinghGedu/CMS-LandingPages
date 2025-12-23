"use client"

export function ImageEditor({ editData, setEditData }) {
  return (
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
  )
}
