export function VideoRenderer({ editData }) {
  if (!editData.url) return null

  return <video src={editData.url} controls className="w-full rounded-md max-h-96" />
}
