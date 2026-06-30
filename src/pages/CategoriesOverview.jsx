import { categories } from '../data/machines'
import { company } from '../data/company'
import CategoryCard from '../components/CategoryCard'
import PageMeta from '../components/PageMeta'
import { FadeUp } from '../components/AnimatedReveal'
import './CategoriesOverview.css'

export default function CategoriesOverview() {
  return (
    <div className="categories-page">
      <PageMeta
        title="Product Categories"
        description={`${company.legalName} — surgical instruments & hospital equipment by specialty. Operation tables, ECG, pulse oximeters & more.`}
      />
      <div className="categories-page__hero">
        <div className="categories-page__hero-bg" />
        <div className="container">
          <FadeUp>
            <span className="badge">All Specialties</span>
            <h1 className="categories-page__title display-title">
              Product <span className="text-gradient">Categories</span>
            </h1>
            <p className="categories-page__desc">
              Browse our catalog organized by surgical specialty. Each category contains
              equipment and products ready to order with pan-India delivery.
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
