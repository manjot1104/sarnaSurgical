import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './CategoryCard.css'

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/category/${category.id}`}
        className="category-card"
        style={{
          '--cat-accent': category.accent,
          '--cat-glow': category.glow,
          '--cat-gradient': category.gradient,
        }}
      >
        <div className="category-card__bg" />
        <div className="category-card__pattern" data-pattern={category.pattern} />
        <div className="category-card__content">
          <span className="category-card__icon">{category.icon}</span>
          <h3 className="category-card__name">{category.name}</h3>
          <p className="category-card__tagline">{category.tagline}</p>
          <span className="category-card__arrow">
            Explore
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className="category-card__shine" />
      </Link>
    </motion.div>
  )
}
