import { Check } from 'lucide-react'

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
  cta = 'Start free trial',
  featured = false,
  tierLabel,
  disabled = false,
}: Props) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        padding: '36px 28px',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'var(--bg)',
        boxShadow: 'var(--neu-raised)',
        opacity: disabled ? 0.55 : 1,
        transition: 'box-shadow 200ms ease, transform 200ms ease',
      }}
    >
      {featured && (
        <span
          style={{
            position: 'absolute',
            top: 26,
            right: -34,
            width: 148,
            padding: '6px 0',
            textAlign: 'center',
            background: 'var(--bg)',
            boxShadow: 'var(--neu-inset)',
            transform: 'rotate(45deg)',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, var(--accent), #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Most popular
          </span>
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
            color: 'var(--text-mute)',
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
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--text)',
          }}
        >
          {title}
        </h3>
        {tagline && (
          <p style={{ margin: '6px 0 0 0', fontSize: 13.5, color: 'var(--text-dim)', lineHeight: 1.5 }}>
            {tagline}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {price === null ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 24, color: 'var(--text-mute)' }}>
            Not available
          </span>
        ) : (
          <>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 40,
                fontWeight: 600,
                color: 'var(--text)',
                letterSpacing: '-0.02em',
              }}
            >
              ₹{price.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: 14, color: 'var(--text-mute)' }}>{priceSuffix}</span>
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
              color: 'var(--text-dim)',
            }}
          >
            <Check size={15} strokeWidth={2.5} style={{ marginTop: 2, flexShrink: 0, color: 'var(--status-live)' }} />
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
          borderRadius: 'var(--radius-pill)',
          fontSize: 13.5,
          fontWeight: 600,
          textAlign: 'center',
          color: 'var(--accent)',
          background: 'var(--bg)',
          border: 'none',
          boxShadow: 'var(--neu-raised-sm)',
          pointerEvents: (disabled || price === null) ? 'none' : 'auto',
          opacity: (disabled || price === null) ? 0.5 : 1,
          transition: 'box-shadow 180ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--neu-pressed)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'var(--neu-raised-sm)'
        }}
      >
        {price === null ? 'Contact sales' : cta}
      </a>
    </div>
  )
}
