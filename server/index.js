import express from 'express'
import cors from 'cors'
import ordersRouter from './routes/orders.js'
import adminRouter from './routes/admin.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Sarna Surgical API' })
})

app.use('/api/orders', ordersRouter)
app.use('/api/admin', adminRouter)

app.listen(PORT, () => {
  console.log(`🚀 Sarna Surgical API running on http://localhost:${PORT}`)
})
