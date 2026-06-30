import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../data/machines'
import { company } from '../data/company'
import { useCatalog } from '../context/CatalogContext'
import CategoryCard from '../components/CategoryCard'
import PageMeta from '../components/PageMeta'
import { FadeUp, StaggerContainer, StaggerItem } from '../components/AnimatedReveal'
import './Home.css'

const features = [
  {
    icon: '🏥',
    title: 'Complete Hospital Solutions',
    desc: 'Operation tables, OT lights, surgical instruments, diagnostic & nursing equipment — all under one roof.',
  },
  {
    icon: '📋',
    title: 'Licensed & Compliant',
    desc: `${company.gstDisplay}. Registered drug licenses for wholesale distribution of medical supplies.`,
  },
  {
    icon: '🚀',
    title: 'Pan-India Delivery',
    desc: 'Based in Delhi (Bhagirath Palace), we supply hospitals and clinics across India with GST invoicing.',
  },
  {
    icon: '🔧',
    title: 'Expert Support',
    desc: `Call ${company.phones.mobile[0].display} or WhatsApp us for product enquiries, quotes & orders.`,
  },
]

export default function Home() {
  const { machines } = useCatalog()

  const stats = [
    { value: String(machines.length), label: 'Products Online' },
    { value: '6+', label: 'Specialties' },
    { value: 'Delhi', label: 'Bhagirath Palace' },
    { value: 'Pan India', label: 'Delivery' },
  ]

  return (
    <div className="home">
      <PageMeta
        description={`${company.legalName} — ${company.tagline}. Surgical instruments, OT tables, hospital equipment. Delhi. Call ${company.phones.mobile[0].display}.`}
      />
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
            initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero__eyebrow badge">{company.legalName}</span>
            <h1 className="hero__title display-title">
              {company.tagline.split(' ')[0]}
              <br />
              <span className="text-gradient">{company.tagline.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="hero__desc">
              Speciality in surgical instruments — operation tables, OT lights, ECG machines,
              pulse oximeters, autoclaves & complete hospital equipment. Based in Delhi, serving all of India.
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
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
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
            <span className="badge">Product Categories</span>
            <h2 className="section-title">Browse by Specialty</h2>
            <p className="section-subtitle">
              Select your surgical specialty to browse compatible equipment and products
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
                  Browse our catalog or contact us for quotes on surgical instruments, OT tables, and hospital equipment.
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
