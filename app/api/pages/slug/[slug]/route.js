import { connectToDatabase } from "@/lib/mongodb";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
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
      return Response.json({ page });
    } catch (error) {
        return Response.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    }
}

export async function PUT(request, { params }) {
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
    const { title, description, components, published } = await request.json();

    const slugStr = String(slug);

    const page = await db.collection("pages").findOne({
      slug: slugStr,
      userId: new ObjectId(decoded.userId),
    });

    if (!page) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.collection("pages").updateOne(
      { slug: slugStr },
      {
        $set: {
          title: title || page.title,
          description: description || page.description,
          components: components || page.components,
          published: published !== undefined ? published : page.published,
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({ message: "Page updated successfully" });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.collection("pages").deleteOne({ slug: slugStr });

    return Response.json({ message: "Page deleted successfully" });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
