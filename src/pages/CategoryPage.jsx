import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCategoryById } from '../data/machines'
import { useCatalog } from '../context/CatalogContext'
import MachineCard from '../components/MachineCard'
import PageMeta from '../components/PageMeta'
import { FadeUp } from '../components/AnimatedReveal'
import './CategoryPage.css'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const category = getCategoryById(categoryId)
  const { getMachinesByCategory, loading } = useCatalog()
  const machines = category ? getMachinesByCategory(categoryId) : []

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
      <PageMeta
        title={category.name}
        description={`Browse ${category.name} products at Sarna Surgical. ${category.description}`}
      />
      <div className="category-detail__hero">
        <div className="category-detail__hero-bg" />
        <div className="category-detail__hero-pattern" data-pattern={category.pattern} />
        <div className="container">
          <FadeUp>
            <Link to="/categories" className="category-detail__back">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Categories
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
                {machines.length} {machines.length === 1 ? 'Product' : 'Products'} Available
              </span>
            </div>
          </FadeUp>
        </div>
      </div>

      <div className="container category-detail__machines">
        {loading ? (
          <div className="category-detail__empty"><p>Loading products...</p></div>
        ) : (
          <>
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
                <p>Products in this category are coming soon.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
                  Need something now? <Link to="/contact">Request a quote</Link> and we&apos;ll help you.
                </p>
                <Link to="/categories" className="btn btn-secondary">Browse Other Categories</Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
