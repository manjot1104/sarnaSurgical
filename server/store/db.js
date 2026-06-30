import { MongoClient } from 'mongodb'

let client = null
let db = null
let connectPromise = null

export function isMongoEnabled() {
  return Boolean(process.env.MONGODB_URI)
}

export async function getDb() {
  if (!isMongoEnabled()) return null
  if (db) return db

  if (!connectPromise) {
    connectPromise = (async () => {
      client = new MongoClient(process.env.MONGODB_URI)
      await client.connect()
      db = client.db()
      console.log('✅ MongoDB connected')
      return db
    })().catch((err) => {
      connectPromise = null
      console.error('MongoDB connection failed, using JSON fallback:', err.message)
      return null
    })
  }

  return connectPromise
}

export async function closeDb() {
  if (client) {
    await client.close()
    client = null
    db = null
    connectPromise = null
  }
}
