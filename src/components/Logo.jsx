import './Logo.css'

const SIZES = {
  sm: 36,
  md: 44,
  lg: 56,
  xl: 72,
}

export default function Logo({ size = 'md', className = '' }) {
  const height = SIZES[size] || SIZES.md

  return (
    <img
      src="/logo.png"
      alt="Sarna Surgical Company — Advancing Surgical Excellence"
      className={`site-logo ${className}`}
      height={height}
      width="auto"
      decoding="async"
    />
  )
}
