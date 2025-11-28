import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request, { params }) {
  try {
    console.log("[v0] GET /api/pages/preview - params:", params)

    const { db } = await connectToDatabase()
    console.log("[v0] Connected to database")

    // Ensure slug is a string
    const slug = String(params.slug)
    console.log("[v0] Looking for published page with slug:", slug)

    const page = await db.collection("pages").findOne({
      slug: slug,
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
