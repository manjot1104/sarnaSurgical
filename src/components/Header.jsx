import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import './Header.css'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/categories', label: 'Specialties' },
  { to: '/track', label: 'Track Order' },
  { to: '/my-orders', label: 'My Orders' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <Link to="/" className="header__logo">
          <Logo size="md" />
        </Link>

        <nav className="header__nav hide-mobile">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`header__nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header__actions hide-mobile">
          <Link to="/categories" className="btn btn-primary btn-sm">
            Browse Parts
          </Link>
        </div>

        <button
          className={`header__burger hide-desktop ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="header__mobile-menu hide-desktop"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={link.to} className="header__mobile-link">
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <Link to="/categories" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Browse Parts
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
