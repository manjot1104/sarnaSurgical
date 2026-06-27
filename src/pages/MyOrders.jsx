import { Link } from 'react-router-dom'
import { getOrderHistory } from '../services/api'
import OrderStatusBadge from '../components/OrderStatusBadge'
import { formatPrice } from '../data/machines'
import { FadeUp } from '../components/AnimatedReveal'
import './MyOrders.css'

export default function MyOrders() {
  const history = getOrderHistory()

  return (
    <div className="my-orders-page">
      <div className="container">
        <FadeUp>
          <span className="badge">Order History</span>
          <h1 className="my-orders__title display-title">My Orders</h1>
          <p className="my-orders__desc">Orders placed from this browser are saved here for quick access.</p>
        </FadeUp>

        {history.length === 0 ? (
          <div className="my-orders__empty glass-card">
            <p>No orders yet on this device.</p>
            <Link to="/categories" className="btn btn-primary">Browse Parts</Link>
          </div>
        ) : (
          <div className="my-orders__list">
            {history.map((order, i) => (
              <FadeUp key={order.id} delay={i * 0.05}>
                <Link to={`/order/${order.id}`} className="my-orders__card glass-card">
                  <div className="my-orders__card-left">
                    <span className="my-orders__num">{order.orderNumber}</span>
                    <span className="my-orders__machine">{order.machineName}</span>
                    <span className="my-orders__date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="my-orders__card-right">
                    <OrderStatusBadge status={order.status} />
                    <span className="price my-orders__total">{formatPrice(order.total)}</span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        )}

        <div className="my-orders__track">
          <Link to="/track" className="btn btn-secondary">Track Order by Number →</Link>
        </div>
      </div>
    </div>
  )
}
