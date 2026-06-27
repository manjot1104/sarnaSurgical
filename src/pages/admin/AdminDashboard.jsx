import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi, ordersApi } from '../../services/api'
import { formatPrice } from '../../data/machines'
import OrderStatusBadge from '../../components/OrderStatusBadge'
import './admin.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminApi.stats(), ordersApi.list()])
      .then(([statsData, orders]) => {
        setStats(statsData)
        setRecentOrders(orders.slice(0, 8))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Loading dashboard...</div>

  return (
    <>
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Total Orders</div>
          <div className="admin-stat-card__value">{stats.total}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Pending Action</div>
          <div className="admin-stat-card__value admin-stat-card__value--warn">{stats.pendingAction}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Dispatched</div>
          <div className="admin-stat-card__value admin-stat-card__value--purple">{stats.dispatched}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Total Revenue</div>
          <div className="admin-stat-card__value admin-stat-card__value--accent">
            {formatPrice(stats.revenue)}
          </div>
        </div>
      </div>

      <div className="admin-stats" style={{ marginBottom: '2rem' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Today's Orders</div>
          <div className="admin-stat-card__value admin-stat-card__value--gold">{stats.todayOrders}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Completed</div>
          <div className="admin-stat-card__value admin-stat-card__value--accent">{stats.completed}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">In Transit</div>
          <div className="admin-stat-card__value admin-stat-card__value--purple">{stats.dispatched}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Cancelled</div>
          <div className="admin-stat-card__value admin-stat-card__value--danger">{stats.cancelled}</div>
        </div>
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 className="admin-card__title" style={{ margin: 0, border: 'none', padding: 0 }}>Recent Orders</h2>
          <Link to="/admin/orders" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="admin-empty">No orders yet. Orders will appear here when customers place them.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Machine</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/admin/orders/${order.id}`} className="admin-table__link">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td>{order.customer.name}</td>
                    <td>{order.machine.name}</td>
                    <td className="price">{formatPrice(order.total)}</td>
                    <td><OrderStatusBadge status={order.status} /></td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
