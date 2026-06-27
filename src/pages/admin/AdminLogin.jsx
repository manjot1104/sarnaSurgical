import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { adminApi } from '../../services/api'
import './admin.css'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await adminApi.login(password)
      sessionStorage.setItem('adminToken', token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__bg" />
      <motion.div
        className="admin-login__card glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="admin-login__title">
          Sarna <span className="text-gradient">Admin</span>
        </h1>
        <p className="admin-login__subtitle">Sign in to manage orders & inventory</p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          {error && <div className="admin-login__error">{error}</div>}
          <div className="admin-login__field">
            <label htmlFor="password">Admin Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="admin-login__hint">Default password: sarna2024</p>
      </motion.div>
    </div>
  )
}
