"use client"

export function VideoEditor({ editData, setEditData }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-bold mb-1">Video URL</label>
        <input
          type="text"
          value={editData.url}
          onChange={(e) => setEditData({ ...editData, url: e.target.value })}
          className="w-full px-2 py-1 border border-input rounded text-sm"
        />
      </div>
    </div>
  )
}
