import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../../services/api'
import { formatPrice } from '../../data/machines'
import './admin.css'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await productsApi.adminList()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await productsApi.delete(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div className="admin-loading">Loading products...</div>

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Products</h2>
          <p className="admin-page-desc">Manage your website catalog — add, edit, or remove products.</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      {error && <div className="admin-login__error" style={{ marginBottom: '1rem' }}>{error}</div>}

      {products.length === 0 ? (
        <div className="admin-empty">
          <p>No products yet. Add your first product to show it on the website.</p>
          <Link to="/admin/products/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Add Product
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <br />
                    <small style={{ color: 'var(--text-muted)' }}>{p.id}</small>
                  </td>
                  <td>{p.categoryId}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>
                    <span className={`admin-status-pill ${p.published !== false ? 'admin-status-pill--live' : 'admin-status-pill--draft'}`}>
                      {p.published !== false ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link to={`/admin/products/${p.id}`} className="admin-table__link">Edit</Link>
                      <a href={`/machine/${p.id}`} target="_blank" rel="noreferrer" className="admin-table__link">View</a>
                      <button type="button" className="admin-table__danger" onClick={() => handleDelete(p.id, p.name)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
