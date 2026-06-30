import 'dotenv/config'
import { isEmailConfigured, sendEmail } from './server/services/email.js'

async function test() {
  console.log('Email configured:', isEmailConfigured())
  if (!isEmailConfigured()) {
    console.error('SMTP not configured — check .env')
    process.exit(1)
  }

  const to = process.env.ADMIN_EMAIL || process.env.SMTP_USER
  const result = await sendEmail({
    to,
    subject: 'Sarna Surgical — Email Test',
    html: '<p>If you received this, email is working correctly.</p>',
  })

  console.log('Result:', result)
  process.exit(result.success ? 0 : 1)
}

test()
