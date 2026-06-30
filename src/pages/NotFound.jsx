import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import './StaticPages.css'

export default function NotFound() {
  return (
    <div className="static-page not-found">
      <PageMeta title="Page Not Found" description="The page you are looking for does not exist." />
      <div className="container not-found__inner">
        <span className="not-found__code">404</span>
        <h1 className="display-title">Page Not Found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="static-cta">
          <Link to="/" className="btn btn-primary btn-lg">Go Home</Link>
          <Link to="/categories" className="btn btn-secondary btn-lg">Browse Products</Link>
        </div>
      </div>
    </div>
  )
}
