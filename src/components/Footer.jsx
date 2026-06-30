import { Link } from 'react-router-dom'
import { company, productsDealtIn, telLink, whatsappLink, formatMobile } from '../data/company'
import Logo from './Logo'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <Logo size="lg" />
            </Link>
            <p className="footer__company-name">{company.legalName}</p>
            <p className="footer__tagline">
              {company.tagline}. Speciality in {company.specialty.toLowerCase()} — operation tables,
              hospital equipment & complete surgical solutions across India.
            </p>
          </div>

          <div className="footer__col">
            <h4>Products</h4>
            <ul>
              <li><Link to="/categories">All Categories</Link></li>
              <li><Link to="/category/general">General Surgery</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/track">Track Order</Link></li>
              <li><Link to="/my-orders">My Orders</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Contact</h4>
            <ul className="footer__contact-list">
              <li>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
              {company.phones.mobile.map((p) => (
                <li key={p.number}>
                  <a href={telLink(p.number)}>{formatMobile(p.number)}</a>
                  {p.whatsapp && (
                    <> · <a href={whatsappLink(p.number)} target="_blank" rel="noopener noreferrer">WhatsApp</a></>
                  )}
                </li>
              ))}
              {company.phones.landline.map((p) => (
                <li key={p.number}>
                  <a href={telLink(p.number)}>{p.display}</a>
                </li>
              ))}
              <li className="footer__address">{company.address.full}</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} {company.legalName}. All rights reserved.</p>
          <p className="footer__cert">
            {company.gstDisplay} · {company.drugLicenses.join(' · ')}
          </p>
        </div>
      </div>
    </footer>
  )
}
