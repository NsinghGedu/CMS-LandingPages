"use client"

export function PageRenderer({ components = [] }) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      {components.map((component) => (
        <ComponentDisplay key={component.id} component={component} />
      ))}
    </div>
  )
}

function ComponentDisplay({ component }) {
  const data = component.data || {}

  switch (component.type) {
    case "heading":
      const HeadingTag = data.level || "h1"
      return <HeadingTag className="text-foreground font-bold mb-4">{data.text}</HeadingTag>

    case "text":
      return <p className="text-foreground whitespace-pre-wrap mb-4 leading-relaxed">{data.content}</p>

    case "image":
      return data.url ? (
        <div className="my-6">
          <img
            src={data.url || "/placeholder.svg"}
            alt={data.alt || "Image"}
            className="w-full rounded-lg max-h-96 object-cover"
            onError={(e) => {
              e.target.style.display = "none"
            }}
          />
        </div>
      ) : null

    case "video":
      return data.url ? (
        <div className="my-6">
          <video src={data.url} controls className="w-full rounded-lg max-h-96" />
        </div>
      ) : null

    case "youtube":
      return data.videoId ? (
        <div className="my-6 aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${data.videoId}`}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      ) : null

    case "pod":
      return (
        <div className="bg-card rounded-lg border border-border p-6 my-6 shadow-sm hover:shadow-md transition-shadow">
          {data.imageUrl && (
            <img
              src={data.imageUrl || "/placeholder.svg"}
              alt={data.title || "Pod image"}
              className="w-full h-48 object-cover rounded-md mb-4"
              onError={(e) => {
                e.target.style.display = "none"
              }}
            />
          )}
          {data.heading && <h3 className="text-lg font-bold text-foreground mb-2">{data.heading}</h3>}
          {data.description && <p className="text-muted-foreground">{data.description}</p>}
        </div>
      )

    case "split":
      return (
        <div className="grid grid-cols-2 gap-6 my-6">
          <div className="text-foreground bg-card rounded-lg p-6 border border-border">{data.leftContent}</div>
          <div className="text-foreground bg-card rounded-lg p-6 border border-border">{data.rightContent}</div>
        </div>
      )

    default:
      return null
  }
}
