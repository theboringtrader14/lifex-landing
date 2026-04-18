import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'

interface Props {
  title: string
  tagline?: string
  price: number | null
  priceSuffix?: string
  bullets: string[]
  cta?: string
  featured?: boolean
  tierLabel?: string
  disabled?: boolean
}

export default function PricingCard({
  title,
  tagline,
  price,
  priceSuffix = '/mo',
  bullets,
  cta = 'Start 3-day trial',
  featured = false,
  tierLabel,
  disabled = false,
}: Props) {
  return (
    <motion.div
      whileHover={disabled ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        padding: 'var(--space-8)',
        borderRadius: 'var(--radius-lg)',
        background: featured
          ? 'linear-gradient(180deg, rgba(99,102,241,0.08) 0%, rgba(6,6,12,0.6) 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.012) 100%)',
        border: featured ? '1px solid rgba(167,139,250,0.4)' : '1px solid var(--border-subtle)',
        boxShadow: featured
          ? '0 0 0 1px rgba(99,102,241,0.15), 0 20px 60px -20px rgba(99,102,241,0.35)'
          : 'none',
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {featured && (
        <span
          style={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#fff',
            background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 6px 20px -4px rgba(99,102,241,0.6)',
          }}
        >
          Most popular
        </span>
      )}

      {tierLabel && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {tierLabel}
        </span>
      )}

      <div>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h3>
        {tagline && (
          <p style={{ margin: '6px 0 0 0', fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {tagline}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {price === null ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 24, color: 'var(--text-muted)' }}>
            Not available
          </span>
        ) : (
          <>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 40,
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              ₹{price.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{priceSuffix}</span>
          </>
        )}
      </div>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {bullets.map((b) => (
          <li
            key={b}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              fontSize: 13.5,
              lineHeight: 1.5,
              color: 'var(--text-secondary)',
            }}
          >
            <Check size={15} strokeWidth={2.5} style={{ marginTop: 2, flexShrink: 0, color: featured ? '#a78bfa' : '#34d399' }} />
            {b}
          </li>
        ))}
      </ul>

      <a
        href={disabled ? undefined : '#'}
        aria-disabled={disabled || price === null}
        onClick={(e) => {
          if (disabled || price === null) e.preventDefault()
        }}
        style={{
          marginTop: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          height: 44,
          padding: '0 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: 13.5,
          fontWeight: 600,
          textAlign: 'center',
          color: featured ? '#fff' : 'var(--text-primary)',
          background: featured
            ? 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)'
            : 'rgba(255,255,255,0.04)',
          border: featured ? 'none' : '1px solid var(--border-default)',
          boxShadow: featured ? '0 10px 28px -8px rgba(99,102,241,0.5)' : 'none',
          pointerEvents: (disabled || price === null) ? 'none' : 'auto',
          opacity: (disabled || price === null) ? 0.5 : 1,
          transition: 'transform 180ms ease, box-shadow 180ms ease',
        }}
      >
        {price === null ? 'Contact sales' : cta}
        {price !== null && <ArrowRight size={15} strokeWidth={2} />}
      </a>
    </motion.div>
  )
}
