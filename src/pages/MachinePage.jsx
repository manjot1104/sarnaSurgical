import { useState } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getMachineById, getCategoryById, formatPrice } from '../data/machines'
import { ordersApi, saveOrderToHistory, calcShipping, SHIPPING_THRESHOLD } from '../services/api'
import MachineVisual from '../components/MachineVisual'
import { FadeUp } from '../components/AnimatedReveal'
import './MachinePage.css'

export default function MachinePage() {
  const { machineId } = useParams()
  const navigate = useNavigate()
  const machine = getMachineById(machineId)
  const category = machine ? getCategoryById(machine.categoryId) : null

  const [cart, setCart] = useState({})
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', hospital: '', address: '', notes: '',
  })

  if (!machine || !category) {
    return <Navigate to="/categories" replace />
  }

  const updateQty = (partId, delta) => {
    setCart((prev) => {
      const current = prev[partId] || 0
      const next = Math.max(0, current + delta)
      if (next === 0) {
        const { [partId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [partId]: next }
    })
  }

  const cartTotal = machine.parts.reduce((sum, part) => {
    const qty = cart[part.id] || 0
    return sum + part.price * qty
  }, 0)

  const shipping = calcShipping(cartTotal)
  const grandTotal = cartTotal + shipping

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)

  const handleOrder = async (e) => {
    e.preventDefault()
    setOrderError('')
    setSubmitting(true)

    const items = machine.parts
      .filter((p) => cart[p.id])
      .map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: p.price,
        quantity: cart[p.id],
        subtotal: p.price * cart[p.id],
      }))

    try {
      const order = await ordersApi.create({
        customer: formData,
        machine: {
          id: machine.id,
          name: machine.name,
          categoryId: category.id,
          categoryName: category.name,
        },
        items,
        subtotal: cartTotal,
        shipping,
        total: grandTotal,
      })

      saveOrderToHistory(order)
      setShowOrderForm(false)
      setCart({})
      navigate('/order-confirmation', { state: { order } })
    } catch (err) {
      setOrderError(err.message || 'Failed to place order. Is the server running?')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="machine-detail"
      style={{
        '--cat-accent': category.accent,
        '--cat-glow': category.glow,
      }}
    >
      {/* Breadcrumb */}
      <div className="container machine-detail__breadcrumb-wrap">
        <nav className="machine-detail__breadcrumb">
          <Link to="/categories">Specialties</Link>
          <span>/</span>
          <Link to={`/category/${category.id}`}>{category.shortName}</Link>
          <span>/</span>
          <span>{machine.name}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="machine-detail__hero">
        <div className="machine-detail__hero-glow" />
        <div className="container machine-detail__hero-grid">
          <motion.div
            className="machine-detail__visual-wrap glass-card"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {machine.badge && (
              <span className={`machine-detail__badge badge ${machine.badge === 'Premium' ? 'badge-premium' : machine.badge === 'New' ? '' : 'badge-gold'}`}>
                {machine.badge}
              </span>
            )}
            <MachineVisual type={machine.image} accent={category.accent} />
          </motion.div>

          <motion.div
            className="machine-detail__info"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="machine-detail__category">{category.name}</span>
            <h1 className="machine-detail__name display-title">{machine.name}</h1>
            <p className="machine-detail__subtitle">{machine.subtitle}</p>
            <p className="machine-detail__tagline">{machine.tagline}</p>
            <p className="machine-detail__desc">{machine.description}</p>
            <div className="machine-detail__price-block">
              <span className="machine-detail__price-label">System Price</span>
              <span className="machine-detail__price price price-large">{formatPrice(machine.price)}</span>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                document.getElementById('parts-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Order Parts
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Specs */}
      <section className="machine-detail__specs">
        <div className="container">
          <FadeUp>
            <h2 className="section-title machine-detail__section-title">Technical Specifications</h2>
          </FadeUp>
          <div className="machine-detail__specs-grid">
            {Object.entries(machine.specs).map(([key, value], i) => (
              <motion.div
                key={key}
                className="spec-item glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              >
                <span className="spec-item__label">{key}</span>
                <span className="spec-item__value">{value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parts & Order */}
      <section className="machine-detail__parts" id="parts-section">
        <div className="container">
          <FadeUp>
            <h2 className="section-title machine-detail__section-title">Replacement Parts</h2>
            <p className="section-subtitle machine-detail__parts-desc">
              OEM-compatible components for {machine.name}. Add parts to your order below.
            </p>
          </FadeUp>

          <div className="machine-detail__parts-layout">
            <div className="machine-detail__parts-list">
              {machine.parts.map((part, i) => (
                <motion.div
                  key={part.id}
                  className="part-item glass-card"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <div className="part-item__info">
                    <h4 className="part-item__name">{part.name}</h4>
                    <span className="part-item__sku">SKU: {part.sku}</span>
                  </div>
                  <div className="part-item__actions">
                    <span className="part-item__price price">{formatPrice(part.price)}</span>
                    <div className="part-item__qty">
                      <button
                        className="part-item__qty-btn"
                        onClick={() => updateQty(part.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="part-item__qty-value">{cart[part.id] || 0}</span>
                      <button
                        className="part-item__qty-btn"
                        onClick={() => updateQty(part.id, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="machine-detail__order-panel">
              <div className="order-panel glass-card">
                <h3 className="order-panel__title">Order Summary</h3>
                <div className="order-panel__machine">
                  <span className="order-panel__machine-name">{machine.name}</span>
                  <span className="order-panel__machine-cat">{category.shortName}</span>
                </div>

                {cartCount === 0 ? (
                  <p className="order-panel__empty">Select parts to begin your order</p>
                ) : (
                  <ul className="order-panel__items">
                    {machine.parts
                      .filter((p) => cart[p.id])
                      .map((part) => (
                        <li key={part.id} className="order-panel__item">
                          <span>{part.name} × {cart[part.id]}</span>
                          <span className="price">{formatPrice(part.price * cart[part.id])}</span>
                        </li>
                      ))}
                  </ul>
                )}

                <div className="order-panel__total">
                  <span>Subtotal</span>
                  <span className="price">{formatPrice(cartTotal)}</span>
                </div>
                <div className="order-panel__total order-panel__total--sub">
                  <span>Shipping {cartTotal >= SHIPPING_THRESHOLD ? '(Free!)' : ''}</span>
                  <span className="price">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="order-panel__total order-panel__total--grand">
                  <span>Total</span>
                  <span className="price price-large">{formatPrice(grandTotal)}</span>
                </div>

                <button
                  className="btn btn-primary btn-lg order-panel__submit"
                  disabled={cartCount === 0}
                  onClick={() => setShowOrderForm(true)}
                >
                  Place Order
                </button>

                <p className="order-panel__note">
                  Free shipping on orders over $500. 30-day return policy on unused parts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Modal */}
      <AnimatePresence>
        {showOrderForm && (
          <motion.div
            className="order-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOrderForm(false)}
          >
            <motion.div
              className="order-modal glass-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="order-modal__close" onClick={() => setShowOrderForm(false)} aria-label="Close">
                ×
              </button>
              <h3 className="order-modal__title">Complete Your Order</h3>
              <p className="order-modal__subtitle">
                {cartCount} items · {formatPrice(grandTotal)} (incl. shipping)
              </p>
              <form onSubmit={handleOrder} className="order-modal__form">
                {orderError && <div className="order-modal__error">{orderError}</div>}
                <div className="order-modal__field">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Dr. Jane Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="order-modal__field">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="jane@hospital.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="order-modal__field">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="order-modal__field">
                  <label htmlFor="hospital">Hospital / Facility *</label>
                  <input
                    id="hospital"
                    type="text"
                    required
                    placeholder="Metro General Hospital"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  />
                </div>
                <div className="order-modal__field">
                  <label htmlFor="address">Shipping Address *</label>
                  <textarea
                    id="address"
                    required
                    rows={2}
                    placeholder="123 Medical Center Dr, City, State, ZIP"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="order-modal__field">
                  <label htmlFor="notes">Order Notes (optional)</label>
                  <textarea
                    id="notes"
                    rows={2}
                    placeholder="Special delivery instructions..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                  {submitting ? 'Placing Order...' : `Confirm Order — ${formatPrice(grandTotal)}`}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
