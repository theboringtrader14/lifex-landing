import { motion } from 'framer-motion'

export type PricingView = 'individual' | 'bundles'

interface Props {
  value: PricingView
  onChange: (v: PricingView) => void
}

const options: { id: PricingView; label: string }[] = [
  { id: 'individual', label: 'Individual modules' },
  { id: 'bundles', label: 'Bundles' },
]

export default function BundleToggle({ value, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Pricing view"
      style={{
        position: 'relative',
        display: 'inline-flex',
        padding: 4,
        borderRadius: 'var(--radius-full)',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {options.map((o) => {
        const active = value === o.id
        return (
          <button
            key={o.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(o.id)}
            style={{
              position: 'relative',
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 'var(--radius-full)',
              color: active ? 'var(--text-primary)' : 'var(--text-muted)',
              background: 'transparent',
              cursor: 'pointer',
              zIndex: 1,
              transition: 'color 180ms ease',
            }}
          >
            {active && (
              <motion.span
                layoutId="bundleToggleSlider"
                transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: -1,
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.22) 0%, rgba(167,139,250,0.22) 100%)',
                  border: '1px solid rgba(167,139,250,0.35)',
                  boxShadow: '0 0 0 1px rgba(99,102,241,0.1), 0 8px 24px -8px rgba(99,102,241,0.35)',
                }}
              />
            )}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
