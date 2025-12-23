"use client"

export function SplitEditor({ editData, setEditData }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-bold mb-1">Left Content</label>
        <textarea
          value={editData.leftContent}
          onChange={(e) => setEditData({ ...editData, leftContent: e.target.value })}
          className="w-full px-2 py-1 border border-input rounded text-sm"
          rows="2"
        />
      </div>
      <div>
        <label className="block text-xs font-bold mb-1">Right Content</label>
        <textarea
          value={editData.rightContent}
          onChange={(e) => setEditData({ ...editData, rightContent: e.target.value })}
          className="w-full px-2 py-1 border border-input rounded text-sm"
          rows="2"
        />
      </div>
    </div>
  )
}
