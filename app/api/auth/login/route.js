import { connectToDatabase } from "@/lib/mongodb"
import { comparePasswords, generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const passwordMatch = await comparePasswords(password, user.password)
    if (!passwordMatch) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = generateToken(user._id.toString(), user.role)

    return Response.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
