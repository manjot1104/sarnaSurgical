import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ordersApi } from '../../services/api'
import { formatPrice } from '../../data/machines'
import OrderStatusBadge from '../../components/OrderStatusBadge'
import OrderTimeline from '../../components/OrderTimeline'
import './admin.css'

export default function AdminOrderDetail() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [courierName, setCourierName] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [message, setMessage] = useState('')

  const loadOrder = () => {
    ordersApi.getById(orderId)
      .then((o) => {
        setOrder(o)
        setTrackingNumber(o.trackingNumber || '')
        setCourierName(o.courierName || '')
        setAdminNotes(o.adminNotes || '')
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadOrder() }, [orderId])

  const handleStatusUpdate = async (status, extra = {}) => {
    setActionLoading(true)
    setMessage('')
    try {
      const updated = await ordersApi.updateStatus(orderId, {
        status,
        trackingNumber: trackingNumber || undefined,
        courierName: courierName || undefined,
        adminNotes: adminNotes || undefined,
        ...extra,
      })
      setOrder(updated)
      setMessage(`Status updated to ${status}`)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className="admin-loading">Loading order...</div>
  if (!order) return <div className="admin-empty">Order not found. <Link to="/admin/orders">Back to orders</Link></div>

  const canConfirm = order.status === 'placed'
  const canDispatch = ['placed', 'confirmed'].includes(order.status)
  const canCancel = ['placed', 'confirmed', 'dispatched'].includes(order.status)

  return (
    <>
      <Link to="/admin/orders" className="admin-sidebar__link" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
        ← Back to Orders
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem' }}>
          {order.orderNumber}
        </h2>
        <OrderStatusBadge status={order.status} size="lg" />
      </div>

      {message && (
        <div className="admin-login__error" style={{ marginBottom: '1rem', background: message.includes('updated') ? 'rgba(52,211,153,0.1)' : undefined, borderColor: message.includes('updated') ? 'rgba(52,211,153,0.3)' : undefined, color: message.includes('updated') ? '#34d399' : undefined }}>
          {message}
        </div>
      )}

      <div className="admin-order-grid">
        <div>
          <div className="admin-card">
            <h3 className="admin-card__title">Order Timeline</h3>
            <OrderTimeline timeline={order.timeline} currentStatus={order.status} />
          </div>

          <div className="admin-card">
            <h3 className="admin-card__title">Order Items</h3>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Part</th>
                    <th>SKU</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{item.sku}</td>
                      <td>{item.quantity}</td>
                      <td className="price">{formatPrice(item.price)}</td>
                      <td className="price">{formatPrice(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <div className="admin-detail-row"><span>Subtotal</span><span className="price">{formatPrice(order.subtotal)}</span></div>
              <div className="admin-detail-row"><span>Shipping</span><span className="price">{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span></div>
              <div className="admin-detail-row" style={{ fontWeight: 700, fontSize: '1.1rem' }}><span>Total</span><span className="price">{formatPrice(order.total)}</span></div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="admin-card__title">Machine</h3>
            <div className="admin-detail-row"><span>Machine</span><span>{order.machine.name}</span></div>
            <div className="admin-detail-row"><span>Category</span><span>{order.machine.categoryName}</span></div>
          </div>
        </div>

        <div>
          <div className="admin-card">
            <h3 className="admin-card__title">Customer Details</h3>
            <div className="admin-detail-row"><span>Name</span><span>{order.customer.name}</span></div>
            <div className="admin-detail-row"><span>Email</span><span>{order.customer.email}</span></div>
            <div className="admin-detail-row"><span>Phone</span><span>{order.customer.phone || '—'}</span></div>
            <div className="admin-detail-row"><span>Hospital</span><span>{order.customer.hospital}</span></div>
            <div className="admin-detail-row"><span>Address</span><span>{order.customer.address || '—'}</span></div>
            {order.customer.notes && (
              <div className="admin-detail-row"><span>Notes</span><span>{order.customer.notes}</span></div>
            )}
          </div>

          {order.trackingNumber && (
            <div className="admin-card">
              <h3 className="admin-card__title">Shipping Info</h3>
              <div className="admin-detail-row"><span>Courier</span><span>{order.courierName || '—'}</span></div>
              <div className="admin-detail-row"><span>Tracking #</span><span style={{ fontFamily: 'monospace' }}>{order.trackingNumber}</span></div>
            </div>
          )}

          {canDispatch && (
            <div className="admin-card">
              <h3 className="admin-card__title">Shipping Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Courier Name</label>
                  <input value={courierName} onChange={(e) => setCourierName(e.target.value)} placeholder="FedEx, DHL, etc." />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Tracking Number</label>
                  <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Tracking ID" />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Admin Notes</label>
                  <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={2} placeholder="Internal notes..." />
                </div>
              </div>
            </div>
          )}

          <div className="admin-card">
            <h3 className="admin-card__title">Actions</h3>
            <div className="admin-actions">
              {canConfirm && (
                <button
                  className="btn btn-secondary"
                  disabled={actionLoading}
                  onClick={() => handleStatusUpdate('confirmed')}
                >
                  ✓ Confirm Order
                </button>
              )}
              {canDispatch && (
                <button
                  className="btn btn-dispatch"
                  disabled={actionLoading}
                  onClick={() => handleStatusUpdate('dispatched')}
                >
                  🚚 Mark as Dispatched
                </button>
              )}
              {canCancel && (
                <button
                  className="btn btn-danger"
                  disabled={actionLoading}
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this order?')) {
                      handleStatusUpdate('cancelled', { message: 'Order cancelled by admin.' })
                    }
                  }}
                >
                  ✕ Cancel Order
                </button>
              )}
              {order.status === 'completed' && (
                <p style={{ color: 'var(--accent)', textAlign: 'center', fontWeight: 600 }}>
                  ✓ This order is completed
                </p>
              )}
              {order.status === 'dispatched' && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                  Waiting for customer to confirm receipt
                </p>
              )}
            </div>
          </div>

          <div className="admin-card">
            <h3 className="admin-card__title">Order Info</h3>
            <div className="admin-detail-row"><span>Order ID</span><span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{order.id.slice(0, 8)}...</span></div>
            <div className="admin-detail-row"><span>Placed</span><span>{new Date(order.createdAt).toLocaleString()}</span></div>
            <div className="admin-detail-row"><span>Updated</span><span>{new Date(order.updatedAt).toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </>
  )
}
