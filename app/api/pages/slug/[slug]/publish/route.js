import { connectToDatabase } from "@/lib/mongodb";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
  const slugStr = String(slug);

    const page = await db.collection("pages").findOne({
      slug: slugStr,
      userId: new ObjectId(decoded.userId),
    });

    if (!page) {
      return Response.json({ error: "Page not found" }, { status: 404 });
    }

    const result = await db.collection("pages").updateOne(
      { slug: slug },
      {
        $set: {
          published: true,
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({
      message: "Page published successfully",
      publishedAt: new Date(),
    });
  } catch (error) {
    return Response.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
