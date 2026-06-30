import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Something went wrong</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Please refresh the page or return home.</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
