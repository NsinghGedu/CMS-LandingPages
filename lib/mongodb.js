import { MongoClient } from "mongodb"

let cachedClient = null
let cachedDb = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI environment variable not set")
  }

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db("cms_db")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function initializeDatabase() {
  const { db } = await connectToDatabase()

  // Create collections if they don't exist
  const collections = await db.listCollections().toArray()
  const collectionNames = collections.map((c) => c.name)

  if (!collectionNames.includes("users")) {
    await db.createCollection("users")
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
  }

  if (!collectionNames.includes("pages")) {
    await db.createCollection("pages")
    await db.collection("pages").createIndex({ userId: 1 })
  }

  if (!collectionNames.includes("templates")) {
    await db.createCollection("templates")
  }

  console.log("Database initialized successfully")
}
