import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MachineVisual from './MachineVisual'
import { formatPrice } from '../data/machines'
import './MachineCard.css'

export default function MachineCard({ machine, category, index = 0 }) {
  const accent = category?.accent || '#0d9488'

  return (
    <motion.article
      className="machine-card glass-card"
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      style={{ '--machine-accent': accent, '--machine-glow': category?.glow || 'rgba(13,148,136,0.15)' }}
    >
      <Link to={`/machine/${machine.id}`} className="machine-card__link">
        <div className="machine-card__visual">
          {machine.badge && (
            <span className={`machine-card__badge badge ${machine.badge === 'Premium' ? 'badge-premium' : machine.badge === 'New' ? '' : 'badge-gold'}`}>
              {machine.badge}
            </span>
          )}
          <MachineVisual type={machine.image} accent={accent} />
        </div>
        <div className="machine-card__body">
          <span className="machine-card__category">{category?.shortName}</span>
          <h3 className="machine-card__name">{machine.name}</h3>
          <p className="machine-card__subtitle">{machine.subtitle}</p>
          <p className="machine-card__tagline">{machine.tagline}</p>
          <div className="machine-card__footer">
            <span className="machine-card__price price">From {formatPrice(machine.price)}</span>
            <span className="machine-card__cta">
              View Specs
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
