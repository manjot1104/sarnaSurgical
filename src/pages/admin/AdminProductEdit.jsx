import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { productsApi } from '../../services/api'
import { categories } from '../../data/machines'
import './admin.css'

const IMAGE_TYPES = [
  'ot-table', 'neuro-nav', 'micro-drill', 'neuro-monitor', 'ent-debrider',
  'laryngoscope', 'heart-lung', 'perfusion', 'arthro-pump', 'power-tool',
  'phaco', 'vitrectomy', 'electrosurg', 'insufflator', 'suction',
]

const EMPTY_PRODUCT = {
  name: '',
  subtitle: '',
  tagline: '',
  description: '',
  categoryId: 'general',
  price: '',
  priceNote: 'GST and transport extra',
  photo: '',
  image: 'ot-table',
  badge: '',
  published: true,
  specs: [{ key: '', value: '' }],
  parts: [{ id: '', name: '', price: '', sku: '' }],
}

function specsToRows(specs) {
  const entries = Object.entries(specs || {})
  return entries.length ? entries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]
}

function rowsToSpecs(rows) {
  const specs = {}
  rows.forEach(({ key, value }) => {
    if (key.trim()) specs[key.trim()] = value.trim()
  })
  return specs
}

export default function AdminProductEdit() {
  const { productId } = useParams()
  const isNew = productId === 'new'
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew) return
    setLoading(true)
    productsApi.adminList()
      .then((list) => {
        const product = list.find((p) => p.id === productId)
        if (!product) throw new Error('Product not found')
        setForm({
          ...product,
          price: String(product.price),
          specs: specsToRows(product.specs),
          parts: product.parts?.length
            ? product.parts.map((p) => ({ ...p, price: String(p.price) }))
            : [{ id: '', name: '', price: '', sku: '' }],
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [isNew, productId])

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const updateSpec = (index, field, value) => {
    setForm((f) => {
      const specs = [...f.specs]
      specs[index] = { ...specs[index], [field]: value }
      return { ...f, specs }
    })
  }

  const addSpec = () => setForm((f) => ({ ...f, specs: [...f.specs, { key: '', value: '' }] }))
  const removeSpec = (i) => setForm((f) => ({ ...f, specs: f.specs.filter((_, idx) => idx !== i) }))

  const updatePart = (index, field, value) => {
    setForm((f) => {
      const parts = [...f.parts]
      parts[index] = { ...parts[index], [field]: value }
      return { ...f, parts }
    })
  }

  const addPart = () => setForm((f) => ({ ...f, parts: [...f.parts, { id: '', name: '', price: '', sku: '' }] }))
  const removePart = (i) => setForm((f) => ({ ...f, parts: f.parts.filter((_, idx) => idx !== i) }))

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const { url } = await productsApi.uploadImage(file)
      update('photo', url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: form.name,
      subtitle: form.subtitle,
      tagline: form.tagline,
      description: form.description,
      categoryId: form.categoryId,
      price: Number(form.price) || 0,
      priceNote: form.priceNote,
      photo: form.photo,
      image: form.image,
      badge: form.badge,
      published: form.published,
      specs: rowsToSpecs(form.specs),
      parts: form.parts
        .filter((p) => p.name.trim())
        .map((p, i) => ({
          id: p.id || `part-${i + 1}`,
          name: p.name.trim(),
          price: Number(p.price) || 0,
          sku: p.sku.trim(),
        })),
    }

    try {
      if (isNew) {
        const created = await productsApi.create(payload)
        navigate(`/admin/products/${created.id}`)
      } else {
        await productsApi.update(productId, payload)
        navigate('/admin/products')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Loading product...</div>

  return (
    <div className="admin-product-form-page">
      <Link to="/admin/products" className="admin-back-link">← Back to Products</Link>
      <h2 className="admin-page-title">{isNew ? 'Add New Product' : 'Edit Product'}</h2>

      {error && <div className="admin-login__error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="admin-product-form">
        <section className="admin-card">
          <h3 className="admin-card__title">Basic Information</h3>
          <div className="admin-form-grid">
            <div className="admin-form-field admin-form-field--full">
              <label>Product Name *</label>
              <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="1201 C-ARM Compatible Electric OT Table" />
            </div>
            <div className="admin-form-field admin-form-field--full">
              <label>Subtitle</label>
              <input value={form.subtitle} onChange={(e) => update('subtitle', e.target.value)} placeholder="Model 1201 · Electric Operating Table" />
            </div>
            <div className="admin-form-field admin-form-field--full">
              <label>Tagline</label>
              <input value={form.tagline} onChange={(e) => update('tagline', e.target.value)} placeholder="Short catchy line shown on product page" />
            </div>
            <div className="admin-form-field">
              <label>Category *</label>
              <select required value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-field">
              <label>Badge</label>
              <input value={form.badge} onChange={(e) => update('badge', e.target.value)} placeholder="New, Premium, etc." />
            </div>
            <div className="admin-form-field">
              <label>Price (INR) *</label>
              <input type="number" required min="0" value={form.price} onChange={(e) => update('price', e.target.value)} />
            </div>
            <div className="admin-form-field">
              <label>Price Note</label>
              <input value={form.priceNote} onChange={(e) => update('priceNote', e.target.value)} placeholder="GST and transport extra" />
            </div>
            <div className="admin-form-field admin-form-field--full">
              <label className="admin-checkbox-label">
                <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} />
                Published (visible on website)
              </label>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <h3 className="admin-card__title">Full Description</h3>
          <div className="admin-form-field admin-form-field--full">
            <label>Detailed Product Description *</label>
            <textarea
              required
              rows={8}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Write a complete description — features, materials, use cases, positioning capabilities, etc."
            />
          </div>
        </section>

        <section className="admin-card">
          <h3 className="admin-card__title">Product Image</h3>
          <div className="admin-form-grid">
            <div className="admin-form-field admin-form-field--full">
              <label>Photo URL</label>
              <input value={form.photo} onChange={(e) => update('photo', e.target.value)} placeholder="/machines/product.png or https://..." />
            </div>
            <div className="admin-form-field">
              <label>Upload Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              {uploading && <small>Uploading...</small>}
            </div>
            <div className="admin-form-field">
              <label>SVG Fallback Type</label>
              <select value={form.image} onChange={(e) => update('image', e.target.value)}>
                {IMAGE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {form.photo && (
              <div className="admin-form-field admin-form-field--full">
                <img src={form.photo} alt="Preview" className="admin-product-preview" />
              </div>
            )}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header-row">
            <h3 className="admin-card__title">Technical Specifications</h3>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addSpec}>+ Add Spec</button>
          </div>
          {form.specs.map((spec, i) => (
            <div key={i} className="admin-repeat-row">
              <input placeholder="Label (e.g. Material)" value={spec.key} onChange={(e) => updateSpec(i, 'key', e.target.value)} />
              <input placeholder="Value (e.g. 304 SS)" value={spec.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} />
              <button type="button" className="admin-repeat-row__remove" onClick={() => removeSpec(i)}>×</button>
            </div>
          ))}
        </section>

        <section className="admin-card">
          <div className="admin-card__header-row">
            <h3 className="admin-card__title">Order Items / Parts</h3>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addPart}>+ Add Item</button>
          </div>
          <p className="admin-form-hint">These appear on the product page for customers to add to their order.</p>
          {form.parts.map((part, i) => (
            <div key={i} className="admin-repeat-row admin-repeat-row--parts">
              <input placeholder="Item name" value={part.name} onChange={(e) => updatePart(i, 'name', e.target.value)} />
              <input placeholder="SKU" value={part.sku} onChange={(e) => updatePart(i, 'sku', e.target.value)} />
              <input type="number" placeholder="Price" value={part.price} onChange={(e) => updatePart(i, 'price', e.target.value)} />
              <button type="button" className="admin-repeat-row__remove" onClick={() => removePart(i)}>×</button>
            </div>
          ))}
        </section>

        <div className="admin-form-actions">
          <Link to="/admin/products" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
