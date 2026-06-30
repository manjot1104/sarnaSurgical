import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'
import { getDb, isMongoEnabled } from './db.js'
import { SEED_PRODUCTS } from '../data/seedProducts.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '../data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function normalizeProduct(raw) {
  const now = new Date().toISOString()
  return {
    id: raw.id,
    categoryId: raw.categoryId,
    name: raw.name?.trim() || '',
    subtitle: raw.subtitle?.trim() || '',
    tagline: raw.tagline?.trim() || '',
    description: raw.description?.trim() || '',
    price: Number(raw.price) || 0,
    priceNote: raw.priceNote?.trim() || '',
    photo: raw.photo?.trim() || '',
    image: raw.image?.trim() || 'ot-table',
    badge: raw.badge?.trim() || '',
    published: raw.published !== false,
    specs: raw.specs && typeof raw.specs === 'object' ? raw.specs : {},
    parts: Array.isArray(raw.parts)
      ? raw.parts.map((p, i) => ({
          id: p.id || `part-${i + 1}`,
          name: p.name?.trim() || '',
          price: Number(p.price) || 0,
          sku: p.sku?.trim() || '',
        }))
      : [],
    createdAt: raw.createdAt || now,
    updatedAt: now,
  }
}

async function readJsonProducts() {
  await ensureDataDir()
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

async function writeJsonProducts(products) {
  await ensureDataDir()
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2))
}

async function seedIfEmpty(products) {
  if (products.length > 0) return products
  const seeded = SEED_PRODUCTS.map((p) => normalizeProduct({ ...p, createdAt: new Date().toISOString() }))
  await writeJsonProducts(seeded)
  return seeded
}

async function mongoProducts() {
  const database = await getDb()
  if (!database) return null
  return database.collection('products')
}

export async function initProducts() {
  const col = await mongoProducts()
  if (col) {
    const count = await col.countDocuments()
    if (count === 0) {
      const seeded = SEED_PRODUCTS.map((p) =>
        normalizeProduct({ ...p, createdAt: new Date().toISOString() })
      )
      await col.insertMany(seeded)
      console.log(`📦 Seeded ${seeded.length} products in MongoDB`)
    }
    return
  }

  const existing = await readJsonProducts()
  if (!existing) {
    const seeded = await seedIfEmpty([])
    console.log(`📦 Seeded ${seeded.length} products in JSON store`)
  }
}

export async function getAllProducts({ includeUnpublished = false } = {}) {
  const col = await mongoProducts()
  if (col) {
    const filter = includeUnpublished ? {} : { published: true }
    return col.find(filter).sort({ updatedAt: -1 }).toArray()
  }

  let products = (await readJsonProducts()) || []
  products = await seedIfEmpty(products)
  if (!includeUnpublished) {
    products = products.filter((p) => p.published !== false)
  }
  return products.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export async function getProductById(id) {
  const col = await mongoProducts()
  if (col) {
    return col.findOne({ id })
  }

  const products = await getAllProducts({ includeUnpublished: true })
  return products.find((p) => p.id === id) || null
}

export async function createProduct(data) {
  const products = await getAllProducts({ includeUnpublished: true })
  const baseId = data.id?.trim() || slugify(data.name)
  let id = baseId
  let n = 1
  while (products.some((p) => p.id === id)) {
    id = `${baseId}-${n++}`
  }

  const product = normalizeProduct({ ...data, id, createdAt: new Date().toISOString() })

  if (!product.name || !product.categoryId) {
    throw new Error('Product name and category are required')
  }

  const col = await mongoProducts()
  if (col) {
    await col.insertOne(product)
    return product
  }

  products.push(product)
  await writeJsonProducts(products)
  return product
}

export async function updateProduct(id, data) {
  const existing = await getProductById(id)
  if (!existing) return null

  const updated = normalizeProduct({
    ...existing,
    ...data,
    id,
    createdAt: existing.createdAt,
  })

  const col = await mongoProducts()
  if (col) {
    await col.updateOne({ id }, { $set: updated })
    return updated
  }

  const products = await getAllProducts({ includeUnpublished: true })
  const index = products.findIndex((p) => p.id === id)
  products[index] = updated
  await writeJsonProducts(products)
  return updated
}

export async function deleteProduct(id) {
  const col = await mongoProducts()
  if (col) {
    const result = await col.deleteOne({ id })
    return result.deletedCount > 0
  }

  const products = await getAllProducts({ includeUnpublished: true })
  const filtered = products.filter((p) => p.id !== id)
  if (filtered.length === products.length) return false
  await writeJsonProducts(filtered)
  return true
}

export function generatePartId() {
  return `part-${crypto.randomBytes(4).toString('hex')}`
}
