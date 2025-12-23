"use client"

export function TextEditor({ editData, setEditData }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1">Content</label>
      <textarea
        value={editData.content}
        onChange={(e) => setEditData({ ...editData, content: e.target.value })}
        className="w-full px-2 py-1 border border-input rounded text-sm"
        rows="4"
      />
    </div>
  )
}
