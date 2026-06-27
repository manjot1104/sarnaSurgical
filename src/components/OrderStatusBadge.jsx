import { ORDER_STATUS } from '../constants/orderStatus'
import './OrderStatusBadge.css'

export default function OrderStatusBadge({ status, size = 'md' }) {
  const config = ORDER_STATUS[status] || { label: status, color: '#94a3b8', icon: '•' }

  return (
    <span
      className={`status-badge status-badge--${size}`}
      style={{ '--status-color': config.color }}
    >
      <span className="status-badge__dot" />
      {config.icon} {config.label}
    </span>
  )
}
