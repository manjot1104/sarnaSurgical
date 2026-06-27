import { Router } from 'express'
import { createSession, destroySession, requireAdmin, verifyAdminPassword } from '../middleware/auth.js'
import { getStats } from '../store/ordersStore.js'

const router = Router()

router.post('/login', (req, res) => {
  const { password } = req.body
  if (!verifyAdminPassword(password)) {
    return res.status(401).json({ error: 'Invalid admin password' })
  }
  const token = createSession()
  res.json({ token, message: 'Login successful' })
})

router.post('/logout', requireAdmin, (req, res) => {
  const token = req.headers.authorization?.slice(7)
  if (token) destroySession(token)
  res.json({ message: 'Logged out' })
})

router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const stats = await getStats()
    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

router.get('/verify', requireAdmin, (req, res) => {
  res.json({ valid: true })
})

export default router
