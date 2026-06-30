export const categories = [
  {
    id: 'neuro',
    name: 'Neurosurgery',
    shortName: 'Neuro',
    tagline: 'Precision for the most delicate procedures',
    description: 'Advanced components for cranial navigation, microsurgical drills, and neuro monitoring systems.',
    icon: '🧠',
    gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
    accent: '#0284c7',
    accentDark: '#0369a1',
    glow: 'rgba(2, 132, 199, 0.18)',
    pattern: 'neural',
  },
  {
    id: 'ent',
    name: 'ENT Surgery',
    shortName: 'ENT',
    tagline: 'Clarity in every incision',
    description: 'Microdebriders, laryngoscopes, and powered instrumentation parts for otolaryngology.',
    icon: '👂',
    gradient: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 50%, #5eead4 100%)',
    accent: '#0d9488',
    accentDark: '#0f766e',
    glow: 'rgba(13, 148, 136, 0.18)',
    pattern: 'wave',
  },
  {
    id: 'cardiac',
    name: 'Cardiac Surgery',
    shortName: 'Cardiac',
    tagline: 'Heartbeat of surgical precision',
    description: 'Heart-lung machine components, perfusion pumps, and cardiac monitoring assemblies.',
    icon: '❤️',
    gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 50%, #fca5a5 100%)',
    accent: '#dc2626',
    accentDark: '#991b1b',
    glow: 'rgba(220, 38, 38, 0.15)',
    pattern: 'pulse',
  },
  {
    id: 'orthopedic',
    name: 'Orthopedic Surgery',
    shortName: 'Orthopedic',
    tagline: 'Strength meets surgical finesse',
    description: 'Power tools, arthroscopy systems, and joint replacement instrumentation parts.',
    icon: '🦴',
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
    accent: '#d97706',
    accentDark: '#b45309',
    glow: 'rgba(217, 119, 6, 0.18)',
    pattern: 'grid',
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology',
    shortName: 'Ophthalmology',
    tagline: 'Vision restored, precision delivered',
    description: 'Phacoemulsification handpieces, vitrectomy cutters, and laser system components.',
    icon: '👁️',
    gradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)',
    accent: '#7c3aed',
    accentDark: '#5b21b6',
    glow: 'rgba(124, 58, 237, 0.15)',
    pattern: 'iris',
  },
  {
    id: 'general',
    name: 'General Surgery',
    shortName: 'General',
    tagline: 'The foundation of every OR',
    description: 'Electrosurgical units, insufflators, suction systems, operating tables, and universal surgical instruments.',
    icon: '⚕️',
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
    accent: '#2563eb',
    accentDark: '#1d4ed8',
    glow: 'rgba(37, 99, 235, 0.15)',
    pattern: 'cross',
  },
];

/** Offline fallback if API is unreachable */
export const SEED_MACHINES = [
  {
    id: 'ot-table-1201',
    categoryId: 'general',
    name: '1201 C-ARM Compatible Electric OT Table',
    subtitle: 'Model 1201 · Electric Operating Table',
    tagline: 'Five-sectional radiolucent top for seamless C-arm imaging',
    price: 125000,
    priceNote: 'GST and transport extra',
    photo: '/machines/ot-table-1201.png',
    image: 'ot-table',
    badge: 'New',
    published: true,
    specs: {
      'Model': '1201',
      'Material': '304 Medical Grade Stainless Steel',
      'Table Length': '2000 mm',
      'Table Width': '540 mm',
    },
    description:
      'The Model 1201 is a C-ARM compatible electric operating table built with 304 medical grade stainless steel.',
    parts: [
      { id: 'ot1201-unit', name: '1201 Electric OT Table (Complete Unit)', price: 125000, sku: 'OT1201' },
    ],
  },
  {
    id: 'ot-table-1202',
    categoryId: 'general',
    name: '1202 C-ARM Compatible Hydraulic OT Table',
    subtitle: 'Model 1202 · Hydraulic Operating Table',
    tagline: 'Reliable hydraulic positioning for every surgical procedure',
    price: 84000,
    priceNote: 'GST and transport extra',
    photo: '/machines/ot-table-1202.png',
    image: 'ot-table',
    badge: 'New',
    published: true,
    specs: {
      'Model': '1202',
      'Type': 'Hydraulic',
      'Material': '304 Medical Grade Stainless Steel',
    },
    description:
      'The Model 1202 is a C-ARM compatible hydraulic operating table crafted from 304 medical grade stainless steel.',
    parts: [
      { id: 'ot1202-unit', name: '1202 Hydraulic OT Table (Complete Unit)', price: 84000, sku: 'OT1202' },
    ],
  },
];

export function getCategoryById(id) {
  return categories.find((c) => c.id === id);
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
