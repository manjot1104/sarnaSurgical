import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ENQUIRIES_FILE = path.join(__dirname, '../data/enquiries.json')

async function readEnquiries() {
  try {
    const data = await fs.readFile(ENQUIRIES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeEnquiries(enquiries) {
  await fs.mkdir(path.dirname(ENQUIRIES_FILE), { recursive: true })
  await fs.writeFile(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2))
}

export async function createEnquiry(data) {
  const enquiries = await readEnquiries()
  const enquiry = {
    id: crypto.randomUUID(),
    name: data.name?.trim() || '',
    email: data.email?.trim() || '',
    phone: data.phone?.trim() || '',
    subject: data.subject?.trim() || 'General Enquiry',
    message: data.message?.trim() || '',
    read: false,
    createdAt: new Date().toISOString(),
  }

  if (!enquiry.name || !enquiry.email || !enquiry.message) {
    throw new Error('Name, email, and message are required')
  }

  enquiries.unshift(enquiry)
  await writeEnquiries(enquiries)
  return enquiry
}

export async function getAllEnquiries() {
  const enquiries = await readEnquiries()
  return enquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function markEnquiryRead(id) {
  const enquiries = await readEnquiries()
  const index = enquiries.findIndex((e) => e.id === id)
  if (index === -1) return null
  enquiries[index].read = true
  await writeEnquiries(enquiries)
  return enquiries[index]
}
