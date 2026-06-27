// Local dev: Vite proxy forwards /api → localhost:3001
// Vercel production: vercel.json proxies /api → Render (no VITE_API_URL needed)
// Optional override: set VITE_API_URL to call Render directly
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api'

async function request(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

function adminHeaders() {
  const token = sessionStorage.getItem('adminToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const ordersApi = {
  create: (orderData) =>
    request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),

  getById: (id) => request(`/orders/${id}`),

  track: (orderNumber, email) => {
    const params = email ? `?email=${encodeURIComponent(email)}` : ''
    return request(`/orders/track/${orderNumber}${params}`)
  },

  markReceived: (id, email) =>
    request(`/orders/${id}/receive`, {
      method: 'PATCH',
      body: JSON.stringify({ email }),
    }),

  list: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.search) params.set('search', filters.search)
    const qs = params.toString()
    return request(`/orders${qs ? `?${qs}` : ''}`, { headers: adminHeaders() })
  },

  updateStatus: (id, data) =>
    request(`/orders/${id}/status`, {
      method: 'PATCH',
      headers: adminHeaders(),
      body: JSON.stringify(data),
    }),
}

export const adminApi = {
  login: (password) =>
    request('/admin/login', { method: 'POST', body: JSON.stringify({ password }) }),

  logout: () =>
    request('/admin/logout', { method: 'POST', headers: adminHeaders() }).catch(() => {}),

  verify: () =>
    request('/admin/verify', { headers: adminHeaders() }),

  stats: () =>
    request('/admin/stats', { headers: adminHeaders() }),
}

export function saveOrderToHistory(order) {
  try {
    const key = 'sarna_order_history'
    const history = JSON.parse(localStorage.getItem(key) || '[]')
    const entry = {
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      machineName: order.machine.name,
      createdAt: order.createdAt,
    }
    const filtered = history.filter((h) => h.id !== order.id)
    localStorage.setItem(key, JSON.stringify([entry, ...filtered].slice(0, 20)))
  } catch {
    /* ignore */
  }
}

export function getOrderHistory() {
  try {
    return JSON.parse(localStorage.getItem('sarna_order_history') || '[]')
  } catch {
    return []
  }
}

export function updateOrderInHistory(order) {
  try {
    const key = 'sarna_order_history'
    const history = JSON.parse(localStorage.getItem(key) || '[]')
    const updated = history.map((h) =>
      h.id === order.id
        ? { ...h, status: order.status, total: order.total }
        : h
    )
    localStorage.setItem(key, JSON.stringify(updated))
  } catch {
    /* ignore */
  }
}

export const SHIPPING_THRESHOLD = 500
export const SHIPPING_COST = 29

export function calcShipping(subtotal) {
  return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
}
