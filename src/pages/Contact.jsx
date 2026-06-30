import { useState } from 'react'
import PageMeta from '../components/PageMeta'
import { contactApi } from '../services/api'
import { company, telLink, whatsappLink, formatMobile } from '../data/company'
import { FadeUp } from '../components/AnimatedReveal'
import './StaticPages.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Product Enquiry', message: '' })
  const [status, setStatus] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus({ type: '', text: '' })
    try {
      const res = await contactApi.submit(form)
      setStatus({ type: 'success', text: res.message })
      setForm({ name: '', email: '', phone: '', subject: 'Product Enquiry', message: '' })
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="static-page">
      <PageMeta
        title="Contact"
        description={`Contact ${company.legalName} — ${company.location}. Surgical instruments, OT tables & hospital equipment. Call ${company.phones.mobile[0].display}.`}
      />
      <div className="static-page__hero">
        <div className="container">
          <FadeUp>
            <span className="badge">Get in Touch</span>
            <h1 className="static-page__title display-title">Contact Us</h1>
            <p className="static-page__lead">
              {company.legalName} — {company.tagline}. Visit us at Bhagirath Palace, Delhi or reach out by phone, WhatsApp, or email.
            </p>
          </FadeUp>
        </div>
      </div>

      <div className="container static-page__content">
        <div className="contact-grid">
          <FadeUp>
            <div className="contact-info glass-card">
              <h2>{company.legalName}</h2>
              <p className="contact-info__subtitle">{company.specialty} · {company.tagline}</p>

              <div className="contact-info__item">
                <strong>Address</strong>
                <p>
                  {company.address.lines.map((line) => (
                    <span key={line}>{line}<br /></span>
                  ))}
                  {company.address.city}-{company.address.pincodeDisplay}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${company.address.mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-info__map-link"
                >
                  Open in Google Maps →
                </a>
              </div>

              <div className="contact-info__item">
                <strong>Mobile / WhatsApp</strong>
                {company.phones.mobile.map((p) => (
                  <p key={p.number}>
                    <a href={telLink(p.number)}>{formatMobile(p.number)}</a>
                    {' · '}
                    <a href={whatsappLink(p.number)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  </p>
                ))}
              </div>

              <div className="contact-info__item">
                <strong>Landline</strong>
                {company.phones.landline.map((p) => (
                  <p key={p.number}><a href={telLink(p.number)}>{p.display}</a></p>
                ))}
              </div>

              <div className="contact-info__item">
                <strong>Email</strong>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </div>

              <div className="contact-info__item">
                <strong>Website</strong>
                <a href={company.website} target="_blank" rel="noopener noreferrer">{company.websiteDisplay}</a>
              </div>

              <div className="contact-info__item">
                <strong>Business Hours</strong>
                <p>{company.hours}</p>
              </div>

              <div className="contact-info__licenses">
                <p><strong>{company.gstDisplay}</strong></p>
                {company.drugLicenses.map((dl) => (
                  <p key={dl}>{dl}</p>
                ))}
              </div>

              <a
                href={whatsappLink(company.phones.mobile[0].number, 'Hello, I would like to enquire about your surgical products.')}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
              >
                Chat on WhatsApp
              </a>
            </div>
          </FadeUp>

          <FadeUp>
            <form onSubmit={handleSubmit} className="contact-form glass-card">
              <h2>Send a Message</h2>
              {status.text && (
                <div className={status.type === 'success' ? 'admin-login__success' : 'admin-login__error'}>
                  {status.text}
                </div>
              )}
              <div className="contact-form__field">
                <label htmlFor="name">Full Name *</label>
                <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="email">Email *</label>
                <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@hospital.com" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 99103 64660" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="subject">Subject</label>
                <select id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                  <option>Product Enquiry</option>
                  <option>Request a Quote</option>
                  <option>OT Table / Operation Equipment</option>
                  <option>Surgical Instruments</option>
                  <option>Order Support</option>
                  <option>General Question</option>
                </select>
              </div>
              <div className="contact-form__field">
                <label htmlFor="message">Message *</label>
                <textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you need..." />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
