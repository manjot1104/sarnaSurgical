import { Link } from 'react-router-dom'
import { categories } from '../data/machines'
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
            <p className="footer__tagline">
              Precision-engineered parts for every surgical specialty. OEM quality, global delivery.
            </p>
          </div>

          <div className="footer__col">
            <h4>Specialties</h4>
            <ul>
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>More</h4>
            <ul>
              {categories.slice(4).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`}>{cat.name}</Link>
                </li>
              ))}
              <li><Link to="/categories">All Specialties</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:orders@sarnasurgical.com">orders@sarnasurgical.com</a></li>
              <li><a href="tel:+18005551234">+1 (800) 555-1234</a></li>
              <li>Mon–Fri, 8am–6pm EST</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Sarna Surgical. All rights reserved.</p>
          <p className="footer__cert">304 Medical Grade Stainless Steel · C-ARM Compatible</p>
        </div>
      </div>
    </footer>
  )
}
