import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Module } from '@/data/modules'
import { ModuleIcon } from './icons/ModuleIcons'

interface Props {
  module: Module
  onOpen: (id: string) => void
}

export default function ModuleCard({ module, onOpen }: Props) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(module.id)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onMouseEnter={(e) => {
        setIsHovered(true)
        e.currentTarget.style.boxShadow = 'var(--neu-raised-lg)'
      }}
      onMouseLeave={(e) => {
        setIsHovered(false)
        e.currentTarget.style.boxShadow = 'var(--neu-raised)'
      }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        padding: '32px',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        background: 'var(--bg)',
        border: 'none',
        borderRadius: '24px',
        boxShadow: 'var(--neu-raised)',
        overflow: 'hidden',
        transition: 'box-shadow 200ms ease, transform 300ms ease',
      }}
    >
      {/* Hover colour wash */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, right: 0,
          width: 300, height: 300,
          background: `radial-gradient(circle at top right, ${module.color}40, transparent 72%)`,
          borderRadius: 'inherit',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 400ms ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Icon + Name + Price ── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* icon well */}
        <div
          style={{
            flexShrink: 0,
            width: 52,
            height: 52,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg)',
            boxShadow: 'var(--neu-inset)',
            color: module.color,
          }}
        >
          <ModuleIcon iconKey={module.iconKey} size={26} />
        </div>
        {/* name + price stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <h3
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              lineHeight: 1,
            }}
          >
            {module.name}
          </h3>
          <span style={{ fontSize: 12.5, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
            {module.startingPrice
              ? <>From <span style={{ color: 'var(--text)', fontWeight: 600 }}>₹{module.startingPrice}</span>/mo</>
              : <span style={{ letterSpacing: '0.04em' }}>Pricing TBD</span>}
          </span>
        </div>
      </div>

      {/* Tagline */}
      <p style={{ position: 'relative', zIndex: 1, margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.5 }}>
        {module.tagline}
      </p>

      {/* Short features */}
      <ul style={{ position: 'relative', zIndex: 1, listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {module.shortFeatures.map((f) => (
          <li
            key={f}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}
          >
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'var(--bg)',
                boxShadow: 'inset 2px 2px 4px var(--shadow-dark), inset -1px -1px 3px var(--shadow-light)',
              }}
            />
            {f}
          </li>
        ))}
      </ul>
    </motion.button>
  )
}
