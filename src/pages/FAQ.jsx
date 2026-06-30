import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { company, whatsappLink, formatMobile } from '../data/company'
import { FadeUp } from '../components/AnimatedReveal'
import './StaticPages.css'

const faqs = [
  {
    q: 'What products does Sarna Surgical Co. deal in?',
    a: 'We supply surgical instruments for Eye, ENT, Cardiovascular, Dermatology, Gynaecology, Obstetrics & Orthopaedic surgery; operation tables & OT lights; suction machines, autoclaves, ECG machines, pulse oximeters, nebulizers, BP monitors, physiotherapy equipment, and complete hospital solutions.',
  },
  {
    q: 'Where is your office located?',
    a: `Our office is at ${company.address.full}. We are located near Bhagirath Palace, Delhi.`,
  },
  {
    q: 'How can I contact you?',
    a: `Call ${company.phones.mobile.map((p) => formatMobile(p.number)).join(' or ')} (WhatsApp available), landline ${company.phones.landline[0].display}, or email ${company.email}.`,
  },
  {
    q: 'Is GST included in the listed price?',
    a: `Listed prices are exclusive of GST. We are registered under ${company.gstDisplay}. GST will be added on your invoice as per applicable rates. Transport is calculated separately.`,
  },
  {
    q: 'Do you deliver across India?',
    a: 'Yes, we offer pan-India delivery from our Delhi office. Shipping costs depend on your location and order size.',
  },
  {
    q: 'Are you a licensed medical supplier?',
    a: `${company.drugLicenses.join('. ')}. We are a registered supplier of surgical instruments and hospital equipment.`,
  },
  {
    q: 'How do I place an order online?',
    a: 'Visit any product page, select items, and click Place Order. You will receive an order number and confirmation email. You can also call or WhatsApp us for direct orders.',
  },
  {
    q: 'Can I request a quote?',
    a: 'Yes — use our Contact page, call us, or WhatsApp with the product name, quantity, and your hospital details. We will respond with pricing and delivery timelines.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <div className="static-page">
      <PageMeta
        title="FAQ"
        description={`FAQs about ${company.legalName} — products, GST, delivery, licenses & contact.`}
      />
      <div className="static-page__hero">
        <div className="container">
          <FadeUp>
            <span className="badge">Help Center</span>
            <h1 className="static-page__title display-title">Frequently Asked Questions</h1>
            <p className="static-page__lead">
              Quick answers about our products, ordering, GST, and delivery across India.
            </p>
          </FadeUp>
        </div>
      </div>

      <div className="container static-page__content static-page__content--narrow">
        <FadeUp>
          <div className="faq-list">
            {faqs.map((item, i) => (
              <div key={i} className={`faq-item glass-card ${open === i ? 'faq-item--open' : ''}`}>
                <button type="button" className="faq-item__question" onClick={() => setOpen(open === i ? -1 : i)}>
                  {item.q}
                  <span className="faq-item__icon">{open === i ? '−' : '+'}</span>
                </button>
                {open === i && <p className="faq-item__answer">{item.a}</p>}
              </div>
            ))}
          </div>
          <div className="static-cta">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Still have questions?</p>
            <a href={whatsappLink(company.phones.mobile[0].number)} className="btn btn-primary" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
            <Link to="/contact" className="btn btn-secondary">Contact Form</Link>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
