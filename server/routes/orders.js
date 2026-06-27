import { Router } from 'express'
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  ORDER_STATUSES,
} from '../store/ordersStore.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { customer, machine, items, subtotal, shipping, total } = req.body

    if (!customer?.name || !customer?.email || !machine?.id || !items?.length) {
      return res.status(400).json({ error: 'Missing required order fields' })
    }

    const order = await createOrder({
      customer,
      machine,
      items,
      subtotal: subtotal || total,
      shipping: shipping || 0,
      total,
    })

    res.status(201).json(order)
  } catch (err) {
    console.error('Create order error:', err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await getOrderByNumber(req.params.orderNumber)
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const { email } = req.query
    if (email && order.customer.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ error: 'Email does not match this order' })
    }

    res.json(order)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const order = await getOrderById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

router.patch('/:id/receive', async (req, res) => {
  try {
    const order = await getOrderById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })

    if (order.status !== ORDER_STATUSES.DISPATCHED) {
      return res.status(400).json({
        error: 'Order can only be marked received when status is dispatched',
        currentStatus: order.status,
      })
    }

    const { email } = req.body
    if (email && order.customer.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ error: 'Email verification failed' })
    }

    let updated = await updateOrderStatus(order.id, {
      status: ORDER_STATUSES.RECEIVED,
      message: 'Customer confirmed receipt of order.',
      by: 'customer',
    })

    updated = await updateOrderStatus(order.id, {
      status: ORDER_STATUSES.COMPLETED,
      message: 'Order completed successfully. Thank you for your business!',
      by: 'system',
    })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' })
  }
})

router.get('/', requireAdmin, async (req, res) => {
  try {
    const orders = await getAllOrders({
      status: req.query.status,
      search: req.query.search,
    })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const order = await getOrderById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })

    const { status, trackingNumber, courierName, adminNotes, message } = req.body
    const validTransitions = {
      [ORDER_STATUSES.PLACED]: [ORDER_STATUSES.CONFIRMED, ORDER_STATUSES.DISPATCHED, ORDER_STATUSES.CANCELLED],
      [ORDER_STATUSES.CONFIRMED]: [ORDER_STATUSES.DISPATCHED, ORDER_STATUSES.CANCELLED],
      [ORDER_STATUSES.DISPATCHED]: [ORDER_STATUSES.CANCELLED],
      [ORDER_STATUSES.RECEIVED]: [ORDER_STATUSES.COMPLETED],
      [ORDER_STATUSES.COMPLETED]: [],
      [ORDER_STATUSES.CANCELLED]: [],
    }

    const allowed = validTransitions[order.status] || []
    if (!allowed.includes(status)) {
      return res.status(400).json({
        error: `Cannot change status from "${order.status}" to "${status}"`,
        currentStatus: order.status,
        allowedStatuses: allowed,
      })
    }

    const statusMessages = {
      confirmed: 'Order confirmed and being prepared for dispatch.',
      dispatched: `Order dispatched${trackingNumber ? ` — Tracking: ${trackingNumber}` : ''}.`,
      cancelled: message || 'Order has been cancelled.',
    }

    const updated = await updateOrderStatus(order.id, {
      status,
      message: message || statusMessages[status] || status,
      by: 'admin',
      trackingNumber,
      courierName,
      adminNotes,
    })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' })
  }
})

export default router
