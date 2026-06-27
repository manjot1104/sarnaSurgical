import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCategoryById, getMachinesByCategory } from '../data/machines'
import MachineCard from '../components/MachineCard'
import { FadeUp } from '../components/AnimatedReveal'
import './CategoryPage.css'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const category = getCategoryById(categoryId)
  const machines = getMachinesByCategory(categoryId)

  if (!category) {
    return <Navigate to="/categories" replace />
  }

  return (
    <div
      className="category-detail"
      style={{
        '--cat-accent': category.accent,
        '--cat-glow': category.glow,
        '--cat-gradient': category.gradient,
      }}
    >
      <div className="category-detail__hero">
        <div className="category-detail__hero-bg" />
        <div className="category-detail__hero-pattern" data-pattern={category.pattern} />
        <div className="container">
          <FadeUp>
            <Link to="/categories" className="category-detail__back">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Specialties
            </Link>
            <div className="category-detail__hero-content">
              <motion.span
                className="category-detail__icon"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                {category.icon}
              </motion.span>
              <div>
                <h1 className="category-detail__title display-title">{category.name}</h1>
                <p className="category-detail__tagline">{category.tagline}</p>
                <p className="category-detail__desc">{category.description}</p>
              </div>
            </div>
            <div className="category-detail__meta">
              <span className="category-detail__count">
                {machines.length} {machines.length === 1 ? 'Machine' : 'Machines'} Available
              </span>
            </div>
          </FadeUp>
        </div>
      </div>

      <div className="container category-detail__machines">
        <div className="category-detail__grid">
          {machines.map((machine, i) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              category={category}
              index={i}
            />
          ))}
        </div>

        {machines.length === 0 && (
          <div className="category-detail__empty">
            <p>No machines listed in this category yet.</p>
            <Link to="/categories" className="btn btn-secondary">Browse Other Specialties</Link>
          </div>
        )}
      </div>
    </div>
  )
}
