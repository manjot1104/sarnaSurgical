export const company = {
  name: 'Sarna Surgical Co.',
  legalName: 'SARNA SURGICAL CO.',
  tagline: 'Complete Hospital Solutions',
  specialty: 'Surgical Instruments',
  gst: '07AARFS5718G1ZS',
  gstDisplay: 'GST-07AARFS5718G1ZS',
  drugLicenses: [
    'DL No. DL-CHC-132754, 20B',
    'DL No. DL-CHC-132755, 21B',
  ],
  address: {
    lines: [
      '1696/2, Gali Jog Dhian, Mohan Building',
      'Near Scooter Parking Bhagirath Palace',
      'Back Side of Sarvodaya Kanya Vidyalaya',
    ],
    city: 'Delhi',
    pincode: '110006',
    pincodeDisplay: '110 006',
    get full() {
      return [...this.lines, `${this.city}-${this.pincodeDisplay}`].join(', ')
    },
    get mapsQuery() {
      return encodeURIComponent(this.full)
    },
  },
  phones: {
    mobile: [
      { number: '9910364660', display: '9910364660', whatsapp: true },
      { number: '9899994840', display: '9899994840', whatsapp: true },
    ],
    landline: [
      { number: '011-47563082', display: '011-47563082' },
      { number: '011-40394785', display: '011-40394785' },
      { number: '23868691', display: '23868691' },
    ],
  },
  email: 'sarnasurgical@gmail.com',
  website: 'https://www.sarnasurgical.com',
  websiteDisplay: 'www.sarnasurgical.com',
  hours: 'Monday – Saturday, 9:00 AM – 7:00 PM IST',
  location: 'Bhagirath Palace, Delhi',
}

export const productsDealtIn = [
  'Surgical Instruments for Eye, E.N.T., Cardio Vascular, Dermatology',
  'Gynaecology Obstetrics and Orthopaedic Surgery instruments',
  'Operation Tables, OT Lights & Diathermy units',
  'Suction Machines, Autoclaves & Hospital Nursing Models',
  'Diamond B.P. Apparatus, Weighing Scales & Vapour Sterilizers',
  'Fumigators, S.S. Laryngoscopes & Pulse Oximeters',
  'E.C.G. Machines, Nebulizers & Digital BP Monitors',
  'Physiotherapy, Slimming & Acupuncture equipment',
]

export function telLink(number) {
  return `tel:+91${number.replace(/\D/g, '').replace(/^91/, '')}`
}

export function whatsappLink(number = company.phones.mobile[0].number, message = '') {
  const phone = `91${number.replace(/\D/g, '').replace(/^91/, '')}`
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${text}`
}

export function formatMobile(number) {
  const d = number.replace(/\D/g, '')
  if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`
  return number
}
