import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { company, productsDealtIn, telLink, whatsappLink, formatMobile } from '../data/company'
import { FadeUp } from '../components/AnimatedReveal'
import './StaticPages.css'

export default function About() {
  return (
    <div className="static-page">
      <PageMeta
        title="About Us"
        description={`${company.legalName} — ${company.tagline}. Licensed dealer of surgical instruments, OT tables & hospital equipment in Delhi since Bhagirath Palace.`}
      />
      <div className="static-page__hero">
        <div className="container">
          <FadeUp>
            <span className="badge">Our Story</span>
            <h1 className="static-page__title display-title">
              {company.tagline.split(' ').slice(0, 2).join(' ')}{' '}
              <span className="text-gradient">{company.tagline.split(' ').slice(2).join(' ')}</span>
            </h1>
            <p className="static-page__lead">
              {company.legalName} is a Delhi-based supplier specialising in {company.specialty.toLowerCase()},
              operation tables, hospital equipment, and complete surgical solutions for hospitals and clinics across India.
            </p>
          </FadeUp>
        </div>
      </div>

      <div className="container static-page__content">
        <FadeUp>
          <section className="static-section glass-card">
            <h2>Who We Are</h2>
            <p>
              Based at Bhagirath Palace, Delhi, {company.legalName} has been serving the medical community with
              quality surgical instruments and hospital equipment. We supply everything from specialty surgical
              instruments to operation tables, OT lights, diagnostic devices, and nursing equipment.
            </p>
            <p style={{ marginTop: '1rem' }}>
              Our registered office: {company.address.full}.
            </p>
          </section>

          <section className="static-section glass-card">
            <h2>What We Deal In</h2>
            <ul className="static-list">
              {productsDealtIn.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="static-section glass-card">
            <h2>Licenses & Compliance</h2>
            <ul className="static-list">
              <li>{company.gstDisplay}</li>
              {company.drugLicenses.map((dl) => (
                <li key={dl}>{dl}</li>
              ))}
            </ul>
          </section>

          <section className="static-section glass-card">
            <h2>Contact</h2>
            <p>
              <strong>Mobile:</strong>{' '}
              {company.phones.mobile.map((p, i) => (
                <span key={p.number}>
                  {i > 0 && ' / '}
                  <a href={telLink(p.number)}>{formatMobile(p.number)}</a>
                </span>
              ))}
              <br />
              <strong>Landline:</strong>{' '}
              {company.phones.landline.map((p, i) => (
                <span key={p.number}>
                  {i > 0 && ' / '}
                  <a href={telLink(p.number)}>{p.display}</a>
                </span>
              ))}
              <br />
              <strong>Email:</strong> <a href={`mailto:${company.email}`}>{company.email}</a>
              <br />
              <strong>Website:</strong>{' '}
              <a href={company.website} target="_blank" rel="noopener noreferrer">{company.websiteDisplay}</a>
            </p>
          </section>

          <div className="static-cta">
            <Link to="/categories" className="btn btn-primary btn-lg">Browse Products</Link>
            <a
              href={whatsappLink(company.phones.mobile[0].number)}
              className="btn btn-secondary btn-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us
            </a>
            <Link to="/contact" className="btn btn-secondary btn-lg">Contact Form</Link>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
