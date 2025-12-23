"use client"

export function HeadingEditor({ editData, setEditData }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-bold mb-1">Heading Level</label>
        <select
          value={editData.level}
          onChange={(e) => setEditData({ ...editData, level: e.target.value })}
          className="w-full px-2 py-1 border border-input rounded text-sm"
        >
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold mb-1">Text</label>
        <input
          type="text"
          value={editData.text}
          onChange={(e) => setEditData({ ...editData, text: e.target.value })}
          className="w-full px-2 py-1 border border-input rounded text-sm"
        />
      </div>
    </div>
  )
}
