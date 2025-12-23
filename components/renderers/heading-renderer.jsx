export function HeadingRenderer({ editData }) {
  const sizeMap = {
    h1: "text-3xl",
    h2: "text-2xl",
    h3: "text-xl",
  }

  return <div className={`font-bold ${sizeMap[editData.level] || "text-3xl"} text-foreground`}>{editData.text}</div>
}
