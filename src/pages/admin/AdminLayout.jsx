import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { adminApi } from '../../services/api'
import './admin.css'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/orders', label: 'All Orders', icon: '📦' },
]

export default function AdminLayout() {
  const [checking, setChecking] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const isLogin = location.pathname === '/admin' || location.pathname === '/admin/'

  useEffect(() => {
    if (isLogin) {
      setChecking(false)
      return
    }
    const token = sessionStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    adminApi.verify()
      .then(() => setChecking(false))
      .catch(() => {
        sessionStorage.removeItem('adminToken')
        navigate('/admin')
      })
  }, [navigate, isLogin, location.pathname])

  const handleLogout = async () => {
    await adminApi.logout()
    sessionStorage.removeItem('adminToken')
    navigate('/admin')
  }

  if (isLogin) return <Outlet />

  if (checking) {
    return <div className="admin-loading">Verifying session...</div>
  }

  const pageTitle = location.pathname.includes('/orders/')
    ? 'Order Details'
    : location.pathname.includes('/orders')
      ? 'All Orders'
      : 'Dashboard'

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <NavLink to="/admin/dashboard">
            ⚕️ Sarna <span>Admin</span>
          </NavLink>
        </div>
        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `admin-sidebar__link ${isActive ? 'active' : ''}`
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <NavLink to="/" className="admin-sidebar__link">← Back to Store</NavLink>
          <button onClick={handleLogout} className="admin-sidebar__link" style={{ width: '100%', marginTop: '0.25rem' }}>
            🚪 Logout
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-header">
          <h1 className="admin-header__title">{pageTitle}</h1>
          <span className="badge">Admin Panel</span>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
