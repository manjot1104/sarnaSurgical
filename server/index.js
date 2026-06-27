import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import ordersRouter from './routes/orders.js'
import adminRouter from './routes/admin.js'

const app = express()
const PORT = process.env.PORT || 3001

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
].filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS blocked: ${origin}`))
      }
    },
    credentials: true,
  })
)

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sarna Surgical API',
    frontend: process.env.FRONTEND_URL || 'not set',
  })
})

app.use('/api/orders', ordersRouter)
app.use('/api/admin', adminRouter)

app.listen(PORT, () => {
  console.log(`🚀 Sarna Surgical API running on port ${PORT}`)
  console.log(`   Allowed frontend: ${process.env.FRONTEND_URL || 'localhost only'}`)
})
