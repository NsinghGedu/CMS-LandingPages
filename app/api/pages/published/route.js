import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request) {
  try {
    const { db } = await connectToDatabase()

    const pages = await db.collection("pages").find({ published: true }).sort({ publishedAt: -1 }).toArray()

    return Response.json({ pages })
  } catch (error) {
    console.error("Error fetching published pages:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
