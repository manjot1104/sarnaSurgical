import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { requireAdmin } from '../middleware/auth.js'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../store/productsStore.js'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '../uploads')

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await fs.mkdir(UPLOADS_DIR, { recursive: true })
    cb(null, UPLOADS_DIR)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    cb(null, safe)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpe?g|png|webp|gif)$/i
    if (allowed.test(file.originalname)) cb(null, true)
    else cb(new Error('Only image files (jpg, png, webp, gif) are allowed'))
  },
})

// Admin routes (before /:id)
router.get('/admin/all', requireAdmin, async (_req, res) => {
  try {
    const products = await getAllProducts({ includeUnpublished: true })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

router.post('/admin/upload', requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed' })
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' })
    }
    res.json({ url: `/api/uploads/${req.file.filename}` })
  })
})

router.post('/admin', requireAdmin, async (req, res) => {
  try {
    const product = await createProduct(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create product' })
  }
})

router.put('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update product' })
  }
})

router.delete('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await deleteProduct(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

// Public catalog
router.get('/', async (_req, res) => {
  try {
    const products = await getAllProducts()
    res.json(products)
  } catch (err) {
    console.error('List products error:', err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id)
    if (!product || product.published === false) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

export default router
