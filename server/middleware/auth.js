import crypto from 'crypto'

const sessions = new Map()
const SESSION_TTL = 24 * 60 * 60 * 1000

export function createSession() {
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, { createdAt: Date.now() })
  return token
}

export function validateSession(token) {
  if (!token) return false
  const session = sessions.get(token)
  if (!session) return false
  if (Date.now() - session.createdAt > SESSION_TTL) {
    sessions.delete(token)
    return false
  }
  return true
}

export function destroySession(token) {
  sessions.delete(token)
}

export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!validateSession(token)) {
    return res.status(401).json({ error: 'Unauthorized. Please login again.' })
  }
  next()
}

export function verifyAdminPassword(password) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'sarna2024'
  return password === adminPassword
}
