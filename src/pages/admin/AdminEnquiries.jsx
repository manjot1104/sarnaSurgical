import { useEffect, useState } from 'react'
import { contactApi } from '../../services/api'
import './admin.css'

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    contactApi.adminList()
      .then(setEnquiries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const markRead = async (id) => {
    try {
      const updated = await contactApi.markRead(id)
      setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)))
    } catch {
      /* ignore */
    }
  }

  if (loading) return <div className="admin-loading">Loading enquiries...</div>

  return (
    <div>
      <h2 className="admin-page-title">Contact Enquiries</h2>
      <p className="admin-page-desc">Messages submitted through the contact form.</p>
      {error && <div className="admin-login__error">{error}</div>}

      {enquiries.length === 0 ? (
        <div className="admin-empty">No enquiries yet.</div>
      ) : (
        <div className="admin-enquiries-list">
          {enquiries.map((e) => (
            <div key={e.id} className={`admin-card admin-enquiry ${e.read ? '' : 'admin-enquiry--unread'}`}>
              <div className="admin-enquiry__header">
                <div>
                  <strong>{e.name}</strong>
                  <span className="admin-enquiry__subject">{e.subject}</span>
                </div>
                <time>{new Date(e.createdAt).toLocaleString('en-IN')}</time>
              </div>
              <p className="admin-enquiry__meta">
                <a href={`mailto:${e.email}`}>{e.email}</a>
                {e.phone && <> · {e.phone}</>}
              </p>
              <p className="admin-enquiry__message">{e.message}</p>
              {!e.read && (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => markRead(e.id)}>
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
