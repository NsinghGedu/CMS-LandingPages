import { connectToDatabase } from "@/lib/mongodb"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(request, { params }) {
  try {
    console.log("[v0] POST publish - params:", params)

    const token = getTokenFromRequest(request)
    console.log("[v0] Token exists:", !!token)

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    console.log("[v0] Token decoded:", decoded)

    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const slug = String(params.slug)
    console.log("[v0] Publishing page with slug:", slug)

    const page = await db.collection("pages").findOne({
      slug: slug,
      userId: new ObjectId(decoded.userId),
    })

    console.log("[v0] Page found:", !!page)

    if (!page) {
      return Response.json({ error: "Page not found" }, { status: 404 })
    }

    const result = await db.collection("pages").updateOne(
      { slug: slug },
      {
        $set: {
          published: true,
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    console.log("[v0] Page published successfully")

    return Response.json({
      message: "Page published successfully",
      publishedAt: new Date(),
    })
  } catch (error) {
    console.error("[v0] Publish error:", error)
    return Response.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
