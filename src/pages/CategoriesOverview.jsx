import { categories } from '../data/machines'
import CategoryCard from '../components/CategoryCard'
import { FadeUp } from '../components/AnimatedReveal'
import './CategoriesOverview.css'

export default function CategoriesOverview() {
  return (
    <div className="categories-page">
      <div className="categories-page__hero">
        <div className="categories-page__hero-bg" />
        <div className="container">
          <FadeUp>
            <span className="badge">All Specialties</span>
            <h1 className="categories-page__title display-title">
              Surgical Machine <span className="text-gradient">Categories</span>
            </h1>
            <p className="categories-page__desc">
              Browse our complete catalog organized by surgical discipline. Each category contains
              machines with OEM-compatible replacement parts ready to ship.
            </p>
          </FadeUp>
        </div>
      </div>

      <div className="container categories-page__grid-wrap">
        <div className="categories-page__grid">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
