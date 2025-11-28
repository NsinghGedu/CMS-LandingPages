import { connectToDatabase } from "@/lib/mongodb"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
  try {
    console.log("[v0] GET /api/pages/slug - params:", params)

    const token = getTokenFromRequest(request)
    console.log("[v0] Token from request:", !!token)

    if (!token) {
      console.log("[v0] No token provided")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    console.log("[v0] Token decoded:", decoded)

    if (!decoded) {
      console.log("[v0] Invalid token")
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    console.log("[v0] Connected to database")

    // Ensure slug is a string
    const slug = String(params.slug)
    console.log("[v0] Looking for page with slug:", slug, "and userId:", decoded.userId)

    const page = await db.collection("pages").findOne({
      slug: slug,
      userId: new ObjectId(decoded.userId),
    })

    console.log("[v0] Page found:", !!page)

    if (!page) {
      return Response.json({ error: "Page not found" }, { status: 404 })
    }

    return Response.json({ page })
  } catch (error) {
    console.error("[v0] Get page error:", error)
    return Response.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
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
    const { title, description, components, published } = await request.json()

    const slug = String(params.slug)

    const page = await db.collection("pages").findOne({
      slug: slug,
      userId: new ObjectId(decoded.userId),
    })

    if (!page) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await db.collection("pages").updateOne(
      { slug: slug },
      {
        $set: {
          title: title || page.title,
          description: description || page.description,
          components: components || page.components,
          published: published !== undefined ? published : page.published,
          updatedAt: new Date(),
        },
      },
    )

    return Response.json({ message: "Page updated successfully" })
  } catch (error) {
    console.error("[v0] Update page error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
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

    const slug = String(params.slug)

    const page = await db.collection("pages").findOne({
      slug: slug,
      userId: new ObjectId(decoded.userId),
    })

    if (!page) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    await db.collection("pages").deleteOne({ slug: slug })

    return Response.json({ message: "Page deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete page error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
