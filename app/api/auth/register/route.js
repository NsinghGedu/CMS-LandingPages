import { connectToDatabase } from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { email, password, name, role } = await request.json()

    if (!email || !password || !name) {
      return Response.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      name,
      role: role || "user",
      createdAt: new Date(),
    })

    const token = generateToken(result.insertedId.toString(), role || "user")

    return Response.json(
      {
        message: "User registered successfully",
        token,
        user: {
          id: result.insertedId,
          email,
          name,
          role: role || "user",
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
