import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ordersApi, updateOrderInHistory } from '../services/api'
import { formatPrice } from '../data/machines'
import OrderStatusBadge from '../components/OrderStatusBadge'
import OrderTimeline from '../components/OrderTimeline'
import { FadeUp } from '../components/AnimatedReveal'
import './OrderDetail.css'

export default function OrderDetail() {
  const { orderId } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [confirmSuccess, setConfirmSuccess] = useState(false)
  const customerEmail = location.state?.email || ''

  useEffect(() => {
    ordersApi.getById(orderId)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [orderId])

  const handleConfirmReceived = async () => {
    setConfirmLoading(true)
    try {
      const updated = await ordersApi.markReceived(orderId, customerEmail)
      setOrder(updated)
      updateOrderInHistory(updated)
      setConfirmSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setConfirmLoading(false)
    }
  }

  if (loading) {
    return <div className="order-detail-page"><div className="container order-detail__loading">Loading order...</div></div>
  }

  if (error && !order) {
    return (
      <div className="order-detail-page">
        <div className="container order-detail__error">
          <h2>Order Not Found</h2>
          <p>{error}</p>
          <Link to="/track" className="btn btn-primary">Track Another Order</Link>
        </div>
      </div>
    )
  }

  const canConfirmReceipt = order.status === 'dispatched' && !confirmSuccess

  return (
    <div className="order-detail-page">
      <div className="container">
        <FadeUp>
          <div className="order-detail__header">
            <div>
              <span className="badge">Order Details</span>
              <h1 className="order-detail__title display-title">{order.orderNumber}</h1>
              <p className="order-detail__date">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
            <OrderStatusBadge status={order.status} size="lg" />
          </div>
        </FadeUp>

        {canConfirmReceipt && (
          <motion.div
            className="order-detail__action-banner glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <strong>Your order has been dispatched!</strong>
              <p>Please confirm when you receive your parts.</p>
              {order.trackingNumber && (
                <p className="order-detail__tracking">
                  Tracking: <strong>{order.trackingNumber}</strong>
                  {order.courierName && ` via ${order.courierName}`}
                </p>
              )}
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleConfirmReceived}
              disabled={confirmLoading}
            >
              {confirmLoading ? 'Confirming...' : '✓ Confirm Received'}
            </button>
          </motion.div>
        )}

        {confirmSuccess && (
          <motion.div
            className="order-detail__success-banner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            🎉 Order completed! Thank you for choosing Sarna Surgical.
          </motion.div>
        )}

        <div className="order-detail__grid">
          <div>
            <div className="order-detail__card glass-card">
              <h2>Order Status</h2>
              <OrderTimeline timeline={order.timeline} currentStatus={order.status} />
            </div>

            <div className="order-detail__card glass-card">
              <h2>Items Ordered</h2>
              <ul className="order-detail__items">
                {order.items.map((item) => (
                  <li key={item.id} className="order-detail__item">
                    <div>
                      <strong>{item.name}</strong>
                      <span className="order-detail__sku">SKU: {item.sku}</span>
                    </div>
                    <div className="order-detail__item-right">
                      <span>×{item.quantity}</span>
                      <span className="price">{formatPrice(item.subtotal)}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="order-detail__totals">
                <div><span>Subtotal</span><span className="price">{formatPrice(order.subtotal)}</span></div>
                <div><span>Shipping</span><span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span></div>
                <div className="order-detail__total-row"><span>Total</span><span className="price price-large">{formatPrice(order.total)}</span></div>
              </div>
            </div>
          </div>

          <div>
            <div className="order-detail__card glass-card">
              <h2>Machine</h2>
              <p className="order-detail__machine-name">{order.machine.name}</p>
              <p className="order-detail__machine-cat">{order.machine.categoryName}</p>
            </div>

            <div className="order-detail__card glass-card">
              <h2>Delivery Details</h2>
              <div className="order-detail__info-row"><span>Name</span><span>{order.customer.name}</span></div>
              <div className="order-detail__info-row"><span>Email</span><span>{order.customer.email}</span></div>
              <div className="order-detail__info-row"><span>Phone</span><span>{order.customer.phone || '—'}</span></div>
              <div className="order-detail__info-row"><span>Hospital</span><span>{order.customer.hospital}</span></div>
              <div className="order-detail__info-row"><span>Address</span><span>{order.customer.address || '—'}</span></div>
            </div>

            {order.trackingNumber && (
              <div className="order-detail__card glass-card order-detail__tracking-card">
                <h2>🚚 Shipping</h2>
                <div className="order-detail__info-row"><span>Courier</span><span>{order.courierName || 'Standard'}</span></div>
                <div className="order-detail__info-row"><span>Tracking</span><span style={{ fontFamily: 'monospace' }}>{order.trackingNumber}</span></div>
              </div>
            )}

            <Link to="/track" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
              Track Another Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
