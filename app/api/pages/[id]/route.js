import { connectToDatabase } from "@/lib/mongodb"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
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
      _id: new ObjectId(params.id),
      userId: new ObjectId(decoded.userId),
    })

    if (!page) {
      return Response.json({ error: "Page not found" }, { status: 404 })
    }

    return Response.json({ page })
  } catch (error) {
    console.error("[v0] Get page error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
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

    const page = await db.collection("pages").findOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(decoded.userId),
    })

    if (!page) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await db.collection("pages").updateOne(
      { _id: new ObjectId(params.id) },
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
    console.error("Update page error:", error)
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

    const page = await db.collection("pages").findOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(decoded.userId),
    })

    if (!page) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    await db.collection("pages").deleteOne({ _id: new ObjectId(params.id) })

    return Response.json({ message: "Page deleted successfully" })
  } catch (error) {
    console.error("Delete page error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
