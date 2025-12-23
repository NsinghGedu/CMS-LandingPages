"use client"

export function YouTubeEditor({ editData, setEditData }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1">YouTube Video ID</label>
      <input
        type="text"
        value={editData.videoId}
        onChange={(e) => setEditData({ ...editData, videoId: e.target.value })}
        className="w-full px-2 py-1 border border-input rounded text-sm"
        placeholder="dQw4w9WgXcQ"
      />
    </div>
  )
}
