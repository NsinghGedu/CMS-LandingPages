export function YouTubeRenderer({ editData }) {
  if (!editData.videoId) return null

  return (
    <iframe
      width="100%"
      height="400"
      src={`https://www.youtube.com/embed/${editData.videoId}`}
      title="YouTube video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="rounded-md"
    />
  )
}
