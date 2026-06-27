import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ordersApi } from '../services/api'
import { FadeUp } from '../components/AnimatedReveal'
import './TrackOrder.css'

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const order = await ordersApi.track(orderNumber.trim(), email.trim())
      navigate(`/order/${order.id}`, { state: { email: email.trim() } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="track-page">
      <div className="track-page__bg" />
      <div className="container track-page__inner">
        <FadeUp>
          <div className="track-page__card glass-card">
            <span className="badge">Order Tracking</span>
            <h1 className="track-page__title display-title">
              Track Your <span className="text-gradient">Order</span>
            </h1>
            <p className="track-page__desc">
              Enter your order number and email to view status, shipping details, and confirm receipt.
            </p>

            <form onSubmit={handleSubmit} className="track-page__form">
              {error && <div className="track-page__error">{error}</div>}
              <div className="track-page__field">
                <label htmlFor="orderNumber">Order Number</label>
                <input
                  id="orderNumber"
                  type="text"
                  required
                  placeholder="SS-20250627-A1B2"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                />
              </div>
              <div className="track-page__field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Searching...' : 'Track Order'}
              </button>
            </form>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
