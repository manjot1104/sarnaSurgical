import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ordersApi } from '../../services/api'
import { formatPrice } from '../../data/machines'
import OrderStatusBadge from '../../components/OrderStatusBadge'
import './admin.css'

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'placed', label: 'Placed' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const fetchOrders = () => {
    setLoading(true)
    ordersApi
      .list({ status: statusFilter, search: search || undefined })
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const timer = setTimeout(fetchOrders, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [statusFilter, search])

  return (
    <>
      <div className="admin-filters">
        <input
          type="search"
          placeholder="Search orders, customers, machines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="admin-filter-tabs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`admin-filter-tab ${statusFilter === tab.value ? 'active' : ''}`}
            onClick={() => setStatusFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">No orders found matching your filters.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Hospital</th>
                <th>Machine</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link to={`/admin/orders/${order.id}`} className="admin-table__link">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td>
                    <div>{order.customer.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customer.email}</div>
                  </td>
                  <td>{order.customer.hospital}</td>
                  <td>{order.machine.name}</td>
                  <td>{order.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="price">{formatPrice(order.total)}</td>
                  <td><OrderStatusBadge status={order.status} /></td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <Link to={`/admin/orders/${order.id}`} className="btn btn-secondary btn-sm">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
