import { connectToDatabase } from "@/lib/mongodb"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function POST(request, { params }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const page = await db.collection("pages").findOne({
      slug: params.slug,
    })

    if (!page || page.userId.toString() !== decoded.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await db.collection("pages").updateOne(
      { slug: params.slug },
      {
        $set: {
          published: true,
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    return Response.json({
      message: "Page published successfully",
      publishedAt: new Date(),
    })
  } catch (error) {
    console.error("Publish error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
