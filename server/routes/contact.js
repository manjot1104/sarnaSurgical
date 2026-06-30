import { Router } from 'express'
import { createEnquiry, getAllEnquiries, markEnquiryRead } from '../store/enquiriesStore.js'
import { requireAdmin } from '../middleware/auth.js'
import { notifyContactEnquiry } from '../services/email.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const enquiry = await createEnquiry(req.body)
    notifyContactEnquiry(enquiry)
    res.status(201).json({ message: 'Thank you! We will get back to you soon.', enquiry })
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to submit enquiry' })
  }
})

router.get('/', requireAdmin, async (_req, res) => {
  try {
    const enquiries = await getAllEnquiries()
    res.json(enquiries)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enquiries' })
  }
})

router.patch('/:id/read', requireAdmin, async (req, res) => {
  try {
    const enquiry = await markEnquiryRead(req.params.id)
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' })
    res.json(enquiry)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update enquiry' })
  }
})

export default router
