export function BannerRenderer({ editData }) {
  return (
    <div
      style={{
        height: `${editData.height}px`,
        backgroundColor: editData.bgColor,
        color: editData.textColor,
      }}
      className="p-4 text-center flex items-center justify-center"
    >
      <span className="text-lg font-semibold">{editData.text}</span>
    </div>
  )
}
