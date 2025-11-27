import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export async function comparePasswords(password, hash) {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return null
  const token = authHeader.replace("Bearer ", "")
  return token
}
