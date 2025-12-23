export function ImageRenderer({ editData }) {
  if (!editData.url) return null

  return (
    <img
      src={editData.url || "/placeholder.svg"}
      alt={editData.alt}
      className="w-full rounded-md max-h-96 object-cover"
      onError={(e) => {
        e.target.style.display = "none"
      }}
    />
  )
}
