import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import ordersRouter from './routes/orders.js'
import adminRouter from './routes/admin.js'
import productsRouter from './routes/products.js'
import contactRouter from './routes/contact.js'
import { initProducts } from './store/productsStore.js'
import { isEmailConfigured } from './services/email.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
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

app.use(express.json({ limit: '2mb' }))

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sarna Surgical API',
    frontend: process.env.FRONTEND_URL || 'not set',
    storage: process.env.MONGODB_URI ? 'mongodb' : 'json',
    email: isEmailConfigured() ? 'configured' : 'not configured',
  })
})

app.use('/api/products', productsRouter)
app.use('/api/contact', contactRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/admin', adminRouter)

initProducts().catch((err) => console.error('Product init error:', err))

app.listen(PORT, () => {
  console.log(`🚀 Sarna Surgical API running on port ${PORT}`)
  console.log(`   Allowed frontend: ${process.env.FRONTEND_URL || 'localhost only'}`)
  console.log(`   Storage: ${process.env.MONGODB_URI ? 'MongoDB' : 'JSON files'}`)
  console.log(`   Email: ${isEmailConfigured() ? 'Gmail SMTP ready' : 'not configured'}`)
})
