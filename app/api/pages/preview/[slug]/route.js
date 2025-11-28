import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request, { params }) {
  try {
    const { slug } = await params
    console.log("[v0] GET /api/pages/preview - slug:", slug)

    const { db } = await connectToDatabase()
    console.log("[v0] Connected to database")

    // Ensure slug is a string
    const slugStr = String(slug)
    console.log("[v0] Looking for published page with slug:", slugStr)

    const page = await db.collection("pages").findOne({
      slug: slugStr,
      published: true,
    })

    console.log("[v0] Published page found:", !!page)

    if (!page) {
      return Response.json({ error: "Page not found" }, { status: 404 })
    }

    return Response.json({ page })
  } catch (error) {
    console.error("[v0] Get preview page error:", error)
    return Response.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
