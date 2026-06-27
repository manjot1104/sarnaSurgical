import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../data/machines'
import CategoryCard from '../components/CategoryCard'
import { FadeUp, StaggerContainer, StaggerItem } from '../components/AnimatedReveal'
import './Home.css'

const stats = [
  { value: '2,400+', label: 'Parts in Stock' },
  { value: '48hr', label: 'Global Shipping' },
  { value: '99.2%', label: 'Compatibility Rate' },
  { value: '24/7', label: 'Technical Support' },
]

const features = [
  {
    icon: '🔬',
    title: 'OEM Quality',
    desc: 'Every part meets or exceeds original manufacturer specifications with full traceability.',
  },
  {
    icon: '🚀',
    title: 'Fast Delivery',
    desc: 'Same-day shipping on in-stock items. Critical parts delivered within 48 hours worldwide.',
  },
  {
    icon: '🛡️',
    title: 'Certified & Compliant',
    desc: 'ISO 13485 certified facility. FDA registered. CE marked components available.',
  },
  {
    icon: '🔧',
    title: 'Expert Support',
    desc: 'Dedicated biomedical engineers available 24/7 for compatibility and installation guidance.',
  },
]

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
          <div className="hero__grid" />
        </div>

        <div className="container hero__content">
          <motion.div
            className="hero__text"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero__eyebrow badge">Precision Surgical Parts</span>
            <h1 className="hero__title display-title">
              Parts That Keep
              <br />
              <span className="text-gradient">Surgery Moving</span>
            </h1>
            <p className="hero__desc">
              Premium replacement components for neuro, ENT, cardiac, orthopedic, and ophthalmology
              surgical systems. OEM-quality parts, delivered when you need them most.
            </p>
            <div className="hero__actions">
              <Link to="/categories" className="btn btn-primary btn-lg">
                Explore Specialties
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a href="#specialties" className="btn btn-secondary btn-lg">
                View Categories
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero__device">
              <div className="hero__device-ring hero__device-ring--1" />
              <div className="hero__device-ring hero__device-ring--2" />
              <div className="hero__device-ring hero__device-ring--3" />
              <div className="hero__device-core">
                <svg viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="50" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
                  <circle cx="60" cy="60" r="35" stroke="var(--accent)" strokeWidth="1.5" opacity="0.5" />
                  <path d="M60 25v70M35 45h50M35 75h50" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="60" cy="60" r="8" fill="var(--accent)">
                    <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
              <div className="hero__floating-parts">
                {['🧠', '❤️', '👁️', '🦴'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="hero__floating-part"
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                    style={{ '--part-angle': `${i * 90}deg` }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero__stats container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="hero__stat">
              <span className="hero__stat-value">{stat.value}</span>
              <span className="hero__stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Specialties */}
      <section className="specialties" id="specialties">
        <div className="container">
          <FadeUp className="specialties__header">
            <span className="badge">Surgical Specialties</span>
            <h2 className="section-title">Find Parts by Discipline</h2>
            <p className="section-subtitle">
              Select your surgical specialty to browse compatible machines and components
            </p>
          </FadeUp>

          <div className="specialties__grid">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <FadeUp className="features__header">
            <h2 className="section-title">Why Surgeons Trust Sarna</h2>
            <p className="section-subtitle">Built for the demands of modern operating rooms</p>
          </FadeUp>

          <StaggerContainer className="features__grid">
            {features.map((feat) => (
              <StaggerItem key={feat.title}>
                <div className="feature-card glass-card">
                  <span className="feature-card__icon">{feat.icon}</span>
                  <h3 className="feature-card__title">{feat.title}</h3>
                  <p className="feature-card__desc">{feat.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <FadeUp>
            <div className="cta-banner glass-card">
              <div className="cta-banner__glow" />
              <div className="cta-banner__content">
                <h2 className="cta-banner__title display-title">
                  Ready to Order?
                </h2>
                <p className="cta-banner__desc">
                  Browse our catalog of 2,400+ surgical machine parts. Same-day shipping on in-stock items.
                </p>
                <Link to="/categories" className="btn btn-primary btn-lg">
                  Start Browsing
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
