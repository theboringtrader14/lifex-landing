import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Module } from '@/data/modules'
import { statusLabel } from '@/data/modules'
import { ModuleIcon } from './icons/ModuleIcons'

interface Props {
  module: Module
  onOpen: (id: string) => void
}

const statusColor: Record<string, { fg: string; bg: string; border: string }> = {
  LIVE: { fg: '#34d399', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.28)' },
  BETA: { fg: '#fbbf24', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.28)' },
  BUILDING: { fg: '#60a5fa', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.28)' },
  COMING_SOON: { fg: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.24)' },
}

export default function ModuleCard({ module, onOpen }: Props) {
  const sc = statusColor[module.status]
  const accent = module.gradient ?? module.color

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(module.id)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        padding: 'var(--space-7)',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.012) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
        e.currentTarget.style.boxShadow = `0 20px 60px -20px ${module.color}33, inset 0 0 0 1px rgba(255,255,255,0.02)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Accent top bar */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: module.gradient ?? `linear-gradient(90deg, ${module.color}00 0%, ${module.color} 50%, ${module.color}00 100%)`,
          opacity: 0.7,
        }}
      />

      {/* Top row — icon + status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${module.color}14`,
            border: `1px solid ${module.color}30`,
            color: module.color,
            backgroundImage: module.gradient ? module.gradient : undefined,
            ...(module.gradient
              ? { WebkitBackgroundClip: 'padding-box', color: '#fff' }
              : {}),
          }}
        >
          <ModuleIcon iconKey={module.iconKey} size={26} />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.12em',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            color: sc.fg,
            background: sc.bg,
            border: `1px solid ${sc.border}`,
          }}
        >
          {statusLabel[module.status]}
        </span>
      </div>

      {/* Name + tagline */}
      <div>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--text-primary)',
            background: accent === module.gradient ? accent : 'none',
            WebkitBackgroundClip: accent === module.gradient ? 'text' : 'border-box',
            WebkitTextFillColor: accent === module.gradient ? 'transparent' : 'var(--text-primary)',
          }}
        >
          {module.name}
        </h3>
        <p style={{ margin: '6px 0 0 0', fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {module.tagline}
        </p>
      </div>

      {/* Short features */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {module.shortFeatures.map((f) => (
          <li
            key={f}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <span
              aria-hidden
              style={{
                marginTop: 7,
                flexShrink: 0,
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: module.color,
                opacity: 0.8,
              }}
            />
            {f}
          </li>
        ))}
      </ul>

      {/* Footer — price + CTA */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
          {module.startingPrice
            ? <>From <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>₹{module.startingPrice}</span>/mo</>
            : <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>Pricing TBD</span>}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12.5,
            fontWeight: 500,
            color: 'var(--text-secondary)',
          }}
        >
          Details
          <ArrowUpRight size={14} strokeWidth={2} />
        </span>
      </div>
    </motion.button>
  )
}
