import { ORDER_STATUS, STATUS_STEPS, getStatusIndex } from '../constants/orderStatus'
import './OrderTimeline.css'

export default function OrderTimeline({ timeline, currentStatus }) {
  const currentIdx = getStatusIndex(currentStatus)

  if (currentStatus === 'cancelled') {
    return (
      <div className="order-timeline order-timeline--cancelled">
        {timeline.map((event, i) => (
          <div key={i} className="order-timeline__event order-timeline__event--active">
            <div className="order-timeline__marker" />
            <div className="order-timeline__content">
              <span className="order-timeline__message">{event.message}</span>
              <span className="order-timeline__time">
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="order-timeline">
      <div className="order-timeline__steps">
        {STATUS_STEPS.map((step, i) => {
          const config = ORDER_STATUS[step]
          const isDone = i <= currentIdx
          const isCurrent = i === currentIdx
          return (
            <div
              key={step}
              className={`order-timeline__step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div className="order-timeline__step-icon" style={{ '--step-color': config.color }}>
                {isDone ? '✓' : i + 1}
              </div>
              <span className="order-timeline__step-label">{config.label}</span>
            </div>
          )
        })}
      </div>

      <div className="order-timeline__events">
        {[...timeline].reverse().map((event, i) => (
          <div key={i} className="order-timeline__event">
            <div className="order-timeline__marker" />
            <div className="order-timeline__content">
              <span className="order-timeline__message">{event.message}</span>
              <span className="order-timeline__meta">
                {new Date(event.timestamp).toLocaleString()} · {event.by}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
