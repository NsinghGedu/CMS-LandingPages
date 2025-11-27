import { connectToDatabase } from "@/lib/mongodb"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(request) {
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
    const { title, description, templateId } = await request.json()

    const result = await db.collection("pages").insertOne({
      userId: new ObjectId(decoded.userId),
      title,
      description,
      templateId: templateId || null,
      components: [],
      published: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return Response.json(
      {
        message: "Page created successfully",
        page: {
          id: result.insertedId,
          title,
          description,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create page error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request) {
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

    const pages = await db
      .collection("pages")
      .find({ userId: new ObjectId(decoded.userId) })
      .toArray()

    return Response.json({ pages })
  } catch (error) {
    console.error("Get pages error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
