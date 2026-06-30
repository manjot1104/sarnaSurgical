import { useEffect } from 'react'

import { company } from '../data/company'

export default function PageMeta({ title, description }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${company.legalName}` : `${company.legalName} | ${company.tagline}`
    document.title = fullTitle

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    if (description) meta.content = description

    return () => {
      document.title = `${company.legalName} | ${company.tagline}`
    }
  }, [title, description])

  return null
}
