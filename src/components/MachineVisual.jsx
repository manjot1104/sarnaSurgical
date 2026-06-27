import { motion } from 'framer-motion'
import './MachineVisual.css'

const machineVisuals = {
  'neuro-nav': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <defs>
        <radialGradient id="brain-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#brain-glow)" />
      <ellipse cx="100" cy="95" rx="55" ry="45" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.6" />
      <path d="M70 85 Q100 60 130 85 Q125 110 100 120 Q75 110 70 85" fill="none" stroke={accent} strokeWidth="2" />
      <path d="M75 95 Q100 75 125 95" fill="none" stroke={accent} strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="90" r="8" fill={accent} opacity="0.8">
        <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
      </circle>
      <line x1="100" y1="90" x2="140" y2="70" stroke={accent} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      <circle cx="140" cy="70" r="4" fill={accent} />
    </svg>
  ),
  'micro-drill': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <rect x="60" y="40" width="80" height="50" rx="8" fill="none" stroke={accent} strokeWidth="2" />
      <rect x="70" y="90" width="60" height="30" rx="4" fill={accent} opacity="0.2" stroke={accent} strokeWidth="1.5" />
      <line x1="100" y1="120" x2="100" y2="160" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <polygon points="95,160 100,175 105,160" fill={accent} />
      <circle cx="100" cy="65" r="12" fill="none" stroke={accent} strokeWidth="2">
        <animateTransform attributeName="transform" type="rotate" from="0 100 65" to="360 100 65" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  ),
  'neuro-monitor': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <rect x="30" y="50" width="140" height="90" rx="6" fill="none" stroke={accent} strokeWidth="2" />
      <polyline points="45,110 65,85 85,95 105,70 125,80 155,60" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="50" y="150" width="100" height="20" rx="4" fill={accent} opacity="0.15" stroke={accent} strokeWidth="1" />
      <circle cx="70" cy="160" r="4" fill="#34d399" />
      <circle cx="90" cy="160" r="4" fill={accent} />
      <circle cx="110" cy="160" r="4" fill="#fbbf24" />
    </svg>
  ),
  'ent-debrider': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <path d="M80 50 L80 130 Q80 150 100 150 Q120 150 120 130 L120 50" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="100" cy="50" rx="20" ry="8" fill={accent} opacity="0.3" stroke={accent} strokeWidth="1.5" />
      <line x1="100" y1="150" x2="100" y2="170" stroke={accent} strokeWidth="2" />
      <path d="M85 80 Q100 75 115 80" fill="none" stroke={accent} strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="3" fill={accent}>
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  ),
  'laryngoscope': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <path d="M60 160 L60 80 Q60 40 100 40 Q140 40 140 80 L140 160" fill="none" stroke={accent} strokeWidth="2.5" />
      <circle cx="100" cy="90" r="25" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.5" />
      <circle cx="100" cy="90" r="12" fill={accent} opacity="0.4" />
      <rect x="85" y="155" width="30" height="15" rx="3" fill={accent} opacity="0.2" stroke={accent} strokeWidth="1" />
    </svg>
  ),
  'co2-laser': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <rect x="40" y="70" width="80" height="60" rx="6" fill="none" stroke={accent} strokeWidth="2" />
      <line x1="120" y1="100" x2="170" y2="100" stroke={accent} strokeWidth="2" strokeDasharray="6 4">
        <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.5s" repeatCount="indefinite" />
      </line>
      <circle cx="175" cy="100" r="6" fill={accent}>
        <animate attributeName="r" values="4;8;4" dur="1s" repeatCount="indefinite" />
      </circle>
      <path d="M55 85 L65 85 M55 100 L70 100 M55 115 L65 115" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  ),
  'heart-lung': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <path d="M100 50 C80 50 60 70 60 95 C60 130 100 160 100 160 C100 160 140 130 140 95 C140 70 120 50 100 50" fill={accent} opacity="0.15" stroke={accent} strokeWidth="2" />
      <path d="M100 70 C90 70 80 80 80 95 C80 115 100 135 100 135 C100 135 120 115 120 95 C120 80 110 70 100 70" fill={accent} opacity="0.3" />
      <circle cx="100" cy="95" r="8" fill={accent}>
        <animate attributeName="r" values="6;10;6" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <rect x="145" y="60" width="35" height="80" rx="4" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.6" />
    </svg>
  ),
  'cardiac-monitor': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <rect x="35" y="45" width="130" height="100" rx="8" fill="none" stroke={accent} strokeWidth="2" />
      <polyline points="50,100 60,100 65,70 75,130 85,85 95,115 105,60 115,100 150,100" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="50" y="65" fill={accent} fontSize="12" fontFamily="sans-serif" opacity="0.7">HR 72</text>
      <rect x="55" y="155" width="90" height="8" rx="4" fill={accent} opacity="0.2" />
    </svg>
  ),
  'ortho-power': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <rect x="50" y="80" width="100" height="50" rx="6" fill="none" stroke={accent} strokeWidth="2" />
      <rect x="70" y="130" width="20" height="40" rx="3" fill={accent} opacity="0.2" stroke={accent} strokeWidth="1.5" />
      <rect x="110" y="130" width="20" height="40" rx="3" fill={accent} opacity="0.2" stroke={accent} strokeWidth="1.5" />
      <circle cx="100" cy="55" r="20" fill="none" stroke={accent} strokeWidth="2">
        <animateTransform attributeName="transform" type="rotate" from="0 100 55" to="360 100 55" dur="2s" repeatCount="indefinite" />
      </circle>
      <line x1="100" y1="35" x2="100" y2="45" stroke={accent} strokeWidth="2" />
      <line x1="100" y1="65" x2="100" y2="75" stroke={accent} strokeWidth="2" />
    </svg>
  ),
  'arthroscope': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <circle cx="100" cy="100" r="50" fill="none" stroke={accent} strokeWidth="2" />
      <circle cx="100" cy="100" r="30" fill={accent} opacity="0.1" stroke={accent} strokeWidth="1" />
      <circle cx="100" cy="100" r="10" fill={accent} opacity="0.5" />
      <line x1="100" y1="50" x2="100" y2="30" stroke={accent} strokeWidth="2" />
      <rect x="85" y="150" width="30" height="25" rx="4" fill="none" stroke={accent} strokeWidth="1.5" />
      <line x1="100" y1="150" x2="100" y2="130" stroke={accent} strokeWidth="2" />
    </svg>
  ),
  'phaco': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <ellipse cx="100" cy="100" rx="40" ry="30" fill="none" stroke={accent} strokeWidth="2" />
      <ellipse cx="100" cy="100" rx="15" ry="12" fill={accent} opacity="0.3" />
      <line x1="100" y1="130" x2="100" y2="165" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M90 165 Q100 175 110 165" fill="none" stroke={accent} strokeWidth="2" />
      <circle cx="100" cy="100" r="5" fill={accent}>
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  ),
  'vitrectomy': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <circle cx="100" cy="100" r="45" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.4" />
      <circle cx="100" cy="100" r="25" fill="none" stroke={accent} strokeWidth="2" />
      <circle cx="100" cy="100" r="8" fill={accent} />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <line
          key={i}
          x1="100" y1="100"
          x2={100 + 40 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 40 * Math.sin((angle * Math.PI) / 180)}
          stroke={accent}
          strokeWidth="1"
          opacity="0.3"
        />
      ))}
      <line x1="100" y1="55" x2="100" y2="35" stroke={accent} strokeWidth="2" />
    </svg>
  ),
  'electrosurg': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <rect x="45" y="60" width="110" height="70" rx="8" fill="none" stroke={accent} strokeWidth="2" />
      <rect x="60" y="75" width="40" height="25" rx="3" fill={accent} opacity="0.2" />
      <circle cx="130" cy="87" r="10" fill="none" stroke={accent} strokeWidth="2" />
      <path d="M100 130 L100 160" stroke={accent} strokeWidth="2" />
      <path d="M90 160 L100 175 L110 160" fill={accent} opacity="0.6" />
      <path d="M125 87 L135 77 M125 87 L135 97" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="1;0.3;1" dur="0.6s" repeatCount="indefinite" />
      </path>
    </svg>
  ),
  'insufflator': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <rect x="55" y="50" width="90" height="100" rx="8" fill="none" stroke={accent} strokeWidth="2" />
      <circle cx="100" cy="90" r="25" fill="none" stroke={accent} strokeWidth="1.5" />
      <text x="88" y="95" fill={accent} fontSize="14" fontFamily="sans-serif" fontWeight="bold">CO₂</text>
      <path d="M75 130 Q100 145 125 130" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.5">
        <animate attributeName="d" values="M75 130 Q100 145 125 130;M75 125 Q100 150 125 125;M75 130 Q100 145 125 130" dur="2s" repeatCount="indefinite" />
      </path>
      <rect x="70" y="155" width="60" height="15" rx="3" fill={accent} opacity="0.15" />
    </svg>
  ),
  'suction': ({ accent }) => (
    <svg viewBox="0 0 200 200" className="machine-visual__svg">
      <rect x="60" y="70" width="80" height="70" rx="6" fill="none" stroke={accent} strokeWidth="2" />
      <circle cx="100" cy="105" r="20" fill={accent} opacity="0.15" stroke={accent} strokeWidth="1.5" />
      <path d="M100 125 L100 155" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M85 155 Q100 170 115 155" fill="none" stroke={accent} strokeWidth="2" />
      <circle cx="75" cy="85" r="3" fill={accent} opacity="0.5">
        <animate attributeName="cy" values="85;75;85" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  ),
}

export default function MachineVisual({ type, accent = '#2dd4bf', className = '' }) {
  const Visual = machineVisuals[type] || machineVisuals['electrosurg']

  return (
    <motion.div
      className={`machine-visual ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="machine-visual__glow" style={{ background: `radial-gradient(circle, ${accent}33 0%, transparent 70%)` }} />
      <Visual accent={accent} />
    </motion.div>
  )
}
