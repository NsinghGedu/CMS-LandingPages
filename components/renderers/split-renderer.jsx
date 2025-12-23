export function SplitRenderer({ editData }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-foreground">{editData.leftContent}</div>
      <div className="text-foreground">{editData.rightContent}</div>
    </div>
  )
}
