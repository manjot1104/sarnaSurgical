import nodemailer from 'nodemailer'
import { companyInfo } from '../config/company.js'

let transporter = null

function getConfig() {
  const user = process.env.SMTP_USER || process.env.EMAIL_FROM
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD
  if (!user || !pass) return null

  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  }
}

function getTransporter() {
  if (transporter) return transporter
  const config = getConfig()
  if (!config) return null
  transporter = nodemailer.createTransport(config)
  return transporter
}

export function isEmailConfigured() {
  return Boolean(getConfig())
}

function fromAddress() {
  const name = process.env.EMAIL_FROM_NAME || companyInfo.legalName
  const email = process.env.SMTP_USER || process.env.EMAIL_FROM || companyInfo.email
  return `"${name}" <${email}>`
}

function adminEmail() {
  return process.env.ADMIN_EMAIL || process.env.SMTP_USER || process.env.EMAIL_FROM
}

function siteUrl() {
  return (process.env.FRONTEND_URL || 'https://sarna-surgical.vercel.app').replace(/\/$/, '')
}

export function formatInr(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

function baseLayout(title, bodyHtml) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
        <tr><td style="background:#0f766e;padding:24px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;">${companyInfo.legalName}</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">${companyInfo.tagline}</p>
        </td></tr>
        <tr><td style="padding:32px;">${bodyHtml}</td></tr>
        <tr><td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
            © ${new Date().getFullYear()} ${companyInfo.legalName}<br>
            ${companyInfo.gst} · Delhi-110 006<br>
            <a href="tel:+919910364660" style="color:#0d9488;">${companyInfo.phones}</a> ·
            <a href="mailto:${companyInfo.email}" style="color:#0d9488;">${companyInfo.email}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendEmail({ to, subject, html, text }) {
  const transport = getTransporter()
  if (!transport) {
    console.warn('Email not configured — skipping:', subject)
    return { skipped: true }
  }

  try {
    const info = await transport.sendMail({
      from: fromAddress(),
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    })
    console.log(`📧 Email sent to ${to}: ${subject}`)
    return { success: true, messageId: info.messageId }
  } catch (err) {
    console.error(`Email failed (${subject} → ${to}):`, err.message)
    return { success: false, error: err.message }
  }
}

/** Fire-and-forget — never blocks the API response */
export function sendEmailAsync(payload) {
  sendEmail(payload).catch((err) => console.error('Email async error:', err.message))
}

export function buildOrderPlacedCustomerEmail(order) {
  const items = order.items
    .map((i) => `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${i.name} × ${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;text-align:right;">${formatInr(i.subtotal)}</td>
    </tr>`)
    .join('')

  const body = `
    <h2 style="margin:0 0 8px;color:#0f172a;">Order Confirmed!</h2>
    <p style="color:#475569;line-height:1.6;">Hi ${order.customer.name}, thank you for your order. We've received it and will confirm shortly.</p>
    <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;padding:16px;margin:20px 0;text-align:center;">
      <p style="margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Order Number</p>
      <p style="margin:6px 0 0;font-size:24px;font-weight:700;color:#0f766e;">${order.orderNumber}</p>
    </div>
    <table width="100%" style="margin:16px 0;">
      <tr><td colspan="2" style="padding-bottom:8px;font-weight:600;color:#0f172a;">Order Summary</td></tr>
      <tr><td style="padding:4px 0;color:#64748b;">Product</td><td style="text-align:right;">${order.machine.name}</td></tr>
      ${items}
      <tr><td style="padding:8px 0;color:#64748b;">Shipping</td><td style="text-align:right;">${order.shipping ? formatInr(order.shipping) : 'FREE'}</td></tr>
      <tr><td style="padding:12px 0;font-weight:700;color:#0f172a;">Total</td><td style="text-align:right;font-weight:700;font-size:18px;">${formatInr(order.total)}</td></tr>
    </table>
    <p style="color:#475569;font-size:14px;">Hospital: ${order.customer.hospital}<br>Delivery: ${order.customer.address}</p>
    <a href="${siteUrl()}/order/${order.id}" style="display:inline-block;margin-top:16px;background:#0d9488;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Track Your Order</a>
  `
  return {
    subject: `Order Confirmed — ${order.orderNumber} | Sarna Surgical`,
    html: baseLayout('Order Confirmed', body),
  }
}

export function buildOrderPlacedAdminEmail(order) {
  const body = `
    <h2 style="margin:0 0 8px;color:#0f172a;">New Order Received</h2>
    <p style="color:#475569;">A new order has been placed on the website.</p>
    <table width="100%" style="margin:16px 0;font-size:14px;">
      <tr><td style="color:#64748b;padding:4px 0;">Order #</td><td><strong>${order.orderNumber}</strong></td></tr>
      <tr><td style="color:#64748b;padding:4px 0;">Customer</td><td>${order.customer.name}</td></tr>
      <tr><td style="color:#64748b;padding:4px 0;">Email</td><td><a href="mailto:${order.customer.email}">${order.customer.email}</a></td></tr>
      <tr><td style="color:#64748b;padding:4px 0;">Phone</td><td>${order.customer.phone || '—'}</td></tr>
      <tr><td style="color:#64748b;padding:4px 0;">Hospital</td><td>${order.customer.hospital}</td></tr>
      <tr><td style="color:#64748b;padding:4px 0;">Product</td><td>${order.machine.name}</td></tr>
      <tr><td style="color:#64748b;padding:4px 0;">Total</td><td><strong>${formatInr(order.total)}</strong></td></tr>
    </table>
    ${order.customer.notes ? `<p style="background:#f8fafc;padding:12px;border-radius:8px;font-size:14px;"><strong>Notes:</strong> ${order.customer.notes}</p>` : ''}
    <a href="${siteUrl()}/admin/orders/${order.id}" style="display:inline-block;margin-top:16px;background:#0f766e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View in Admin Panel</a>
  `
  return {
    subject: `🆕 New Order ${order.orderNumber} — ${formatInr(order.total)}`,
    html: baseLayout('New Order', body),
  }
}

const STATUS_SUBJECTS = {
  confirmed: 'Order Confirmed — Being Prepared',
  dispatched: 'Order Dispatched — On Its Way',
  cancelled: 'Order Cancelled',
  completed: 'Order Completed — Thank You!',
  received: 'Order Received — Thank You',
}

export function buildOrderStatusEmail(order, status, message) {
  const labels = {
    confirmed: 'Your order has been confirmed and is being prepared for dispatch.',
    dispatched: 'Great news! Your order has been dispatched.',
    cancelled: 'Your order has been cancelled.',
    completed: 'Your order is complete. Thank you for choosing Sarna Surgical!',
    received: 'We have recorded that you received your order.',
  }

  let tracking = ''
  if (status === 'dispatched' && (order.trackingNumber || order.courierName)) {
    tracking = `<div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0 0 4px;font-weight:600;color:#5b21b6;">Tracking Details</p>
      ${order.courierName ? `<p style="margin:4px 0;color:#475569;">Courier: ${order.courierName}</p>` : ''}
      ${order.trackingNumber ? `<p style="margin:4px 0;color:#475569;">Tracking #: <strong>${order.trackingNumber}</strong></p>` : ''}
    </div>`
  }

  const body = `
    <h2 style="margin:0 0 8px;color:#0f172a;">${STATUS_SUBJECTS[status] || 'Order Update'}</h2>
    <p style="color:#475569;line-height:1.6;">Hi ${order.customer.name},</p>
    <p style="color:#475569;line-height:1.6;">${message || labels[status] || 'Your order status has been updated.'}</p>
    <p style="color:#64748b;font-size:14px;">Order: <strong>${order.orderNumber}</strong> · ${order.machine.name}</p>
    ${tracking}
    <a href="${siteUrl()}/order/${order.id}" style="display:inline-block;margin-top:16px;background:#0d9488;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Order Details</a>
  `
  return {
    subject: `${STATUS_SUBJECTS[status] || 'Order Update'} — ${order.orderNumber} | Sarna Surgical`,
    html: baseLayout('Order Update', body),
  }
}

export function buildContactAdminEmail(enquiry) {
  const body = `
    <h2 style="margin:0 0 8px;color:#0f172a;">New Contact Enquiry</h2>
    <table width="100%" style="font-size:14px;margin:16px 0;">
      <tr><td style="color:#64748b;padding:4px 0;">Name</td><td>${enquiry.name}</td></tr>
      <tr><td style="color:#64748b;padding:4px 0;">Email</td><td><a href="mailto:${enquiry.email}">${enquiry.email}</a></td></tr>
      <tr><td style="color:#64748b;padding:4px 0;">Phone</td><td>${enquiry.phone || '—'}</td></tr>
      <tr><td style="color:#64748b;padding:4px 0;">Subject</td><td>${enquiry.subject}</td></tr>
    </table>
    <div style="background:#f8fafc;padding:16px;border-radius:8px;">
      <p style="margin:0;color:#0f172a;white-space:pre-wrap;">${enquiry.message}</p>
    </div>
    <a href="${siteUrl()}/admin/enquiries" style="display:inline-block;margin-top:16px;background:#0f766e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View in Admin</a>
  `
  return {
    subject: `📩 Enquiry: ${enquiry.subject} — ${enquiry.name}`,
    html: baseLayout('New Enquiry', body),
  }
}

export function buildContactCustomerEmail(enquiry) {
  const body = `
    <h2 style="margin:0 0 8px;color:#0f172a;">We Received Your Message</h2>
    <p style="color:#475569;line-height:1.6;">Hi ${enquiry.name},</p>
    <p style="color:#475569;line-height:1.6;">Thank you for contacting Sarna Surgical. We've received your enquiry and will get back to you within 1–2 business days.</p>
    <div style="background:#f8fafc;padding:16px;border-radius:8px;margin:16px 0;">
      <p style="margin:0 0 4px;font-size:12px;color:#64748b;">Your message:</p>
      <p style="margin:0;color:#0f172a;white-space:pre-wrap;">${enquiry.message}</p>
    </div>
    <p style="color:#475569;font-size:14px;">For urgent enquiries, reply to this email or browse our products at <a href="${siteUrl()}/categories">${siteUrl()}</a></p>
  `
  return {
    subject: `We received your enquiry | Sarna Surgical`,
    html: baseLayout('Enquiry Received', body),
  }
}

export function notifyOrderPlaced(order) {
  const customer = buildOrderPlacedCustomerEmail(order)
  sendEmailAsync({ to: order.customer.email, ...customer })

  const admin = buildOrderPlacedAdminEmail(order)
  sendEmailAsync({ to: adminEmail(), ...admin })
}

export function notifyOrderStatus(order, status, message) {
  if (!order?.customer?.email) return
  const skip = ['placed']
  if (skip.includes(status)) return
  const email = buildOrderStatusEmail(order, status, message)
  sendEmailAsync({ to: order.customer.email, ...email })
}

export function notifyContactEnquiry(enquiry) {
  const admin = buildContactAdminEmail(enquiry)
  sendEmailAsync({ to: adminEmail(), ...admin })

  const customer = buildContactCustomerEmail(enquiry)
  sendEmailAsync({ to: enquiry.email, ...customer })
}
