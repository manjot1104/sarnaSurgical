import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLocation, Navigate } from 'react-router-dom'
import { formatPrice } from '../data/machines'
import OrderStatusBadge from '../components/OrderStatusBadge'
import './OrderConfirmation.css'

export default function OrderConfirmation() {
  const location = useLocation()
  const order = location.state?.order

  if (!order) return <Navigate to="/categories" replace />

  return (
    <div className="confirm-page">
      <div className="confirm-page__bg" />
      <div className="container confirm-page__inner">
        <motion.div
          className="confirm-page__card glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="confirm-page__icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            ✓
          </motion.div>

          <h1 className="confirm-page__title display-title">Order Placed!</h1>
          <p className="confirm-page__subtitle">
            Thank you, {order.customer.name}. Your order has been received.
          </p>

          <div className="confirm-page__order-num">
            <span>Order Number</span>
            <strong>{order.orderNumber}</strong>
          </div>

          <div className="confirm-page__summary">
            <div><span>Machine</span><span>{order.machine.name}</span></div>
            <div><span>Items</span><span>{order.items.reduce((s, i) => s + i.quantity, 0)} parts</span></div>
            <div><span>Total</span><span className="price">{formatPrice(order.total)}</span></div>
            <div><span>Status</span><OrderStatusBadge status={order.status} /></div>
          </div>

          <p className="confirm-page__note">
            Save your order number <strong>{order.orderNumber}</strong> to track your order.
            A confirmation will be sent to <strong>{order.customer.email}</strong>.
          </p>

          <div className="confirm-page__actions">
            <Link to={`/order/${order.id}`} state={{ email: order.customer.email }} className="btn btn-primary btn-lg">
              View Order Status
            </Link>
            <Link to="/track" className="btn btn-secondary">Track Orders</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
