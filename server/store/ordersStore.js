import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ORDERS_FILE = path.join(__dirname, '../data/orders.json')

export const ORDER_STATUSES = {
  PLACED: 'placed',
  CONFIRMED: 'confirmed',
  DISPATCHED: 'dispatched',
  RECEIVED: 'received',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const STATUS_LABELS = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  dispatched: 'Dispatched',
  received: 'Received by Customer',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

async function readOrders() {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeOrders(orders) {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true })
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2))
}

function generateOrderNumber() {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = crypto.randomBytes(2).toString('hex').toUpperCase()
  return `SS-${dateStr}-${rand}`
}

export async function getAllOrders(filters = {}) {
  let orders = await readOrders()
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  if (filters.status && filters.status !== 'all') {
    orders = orders.filter((o) => o.status === filters.status)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.hospital.toLowerCase().includes(q) ||
        o.machine.name.toLowerCase().includes(q)
    )
  }

  return orders
}

export async function getOrderById(id) {
  const orders = await readOrders()
  return orders.find((o) => o.id === id) || null
}

export async function getOrderByNumber(orderNumber) {
  const orders = await readOrders()
  return orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()) || null
}

export async function createOrder(orderData) {
  const orders = await readOrders()
  const now = new Date().toISOString()

  const order = {
    id: crypto.randomUUID(),
    orderNumber: generateOrderNumber(),
    status: ORDER_STATUSES.PLACED,
    customer: orderData.customer,
    machine: orderData.machine,
    items: orderData.items,
    subtotal: orderData.subtotal,
    shipping: orderData.shipping || 0,
    total: orderData.total,
    trackingNumber: null,
    courierName: null,
    adminNotes: '',
    timeline: [
      {
        status: ORDER_STATUSES.PLACED,
        message: 'Order placed successfully. Awaiting confirmation.',
        timestamp: now,
        by: 'customer',
      },
    ],
    createdAt: now,
    updatedAt: now,
  }

  orders.push(order)
  await writeOrders(orders)
  return order
}

export async function updateOrderStatus(id, { status, message, by, trackingNumber, courierName, adminNotes }) {
  const orders = await readOrders()
  const index = orders.findIndex((o) => o.id === id)
  if (index === -1) return null

  const order = orders[index]
  const now = new Date().toISOString()

  order.status = status
  order.updatedAt = now

  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber
  if (courierName !== undefined) order.courierName = courierName
  if (adminNotes !== undefined) order.adminNotes = adminNotes

  order.timeline.push({
    status,
    message: message || STATUS_LABELS[status] || status,
    timestamp: now,
    by: by || 'admin',
  })

  orders[index] = order
  await writeOrders(orders)
  return order
}

export async function getStats() {
  const orders = await readOrders()
  const today = new Date().toISOString().slice(0, 10)

  return {
    total: orders.length,
    placed: orders.filter((o) => o.status === ORDER_STATUSES.PLACED).length,
    confirmed: orders.filter((o) => o.status === ORDER_STATUSES.CONFIRMED).length,
    dispatched: orders.filter((o) => o.status === ORDER_STATUSES.DISPATCHED).length,
    received: orders.filter((o) => o.status === ORDER_STATUSES.RECEIVED).length,
    completed: orders.filter((o) => o.status === ORDER_STATUSES.COMPLETED).length,
    cancelled: orders.filter((o) => o.status === ORDER_STATUSES.CANCELLED).length,
    revenue: orders
      .filter((o) => o.status !== ORDER_STATUSES.CANCELLED)
      .reduce((sum, o) => sum + o.total, 0),
    todayOrders: orders.filter((o) => o.createdAt.startsWith(today)).length,
    pendingAction: orders.filter((o) =>
      [ORDER_STATUSES.PLACED, ORDER_STATUSES.CONFIRMED].includes(o.status)
    ).length,
  }
}
