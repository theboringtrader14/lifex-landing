import { useEffect, useRef, useState } from 'react'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState({ left: 4, width: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const btn = container.querySelector<HTMLButtonElement>('[aria-selected="true"]')
    if (!btn) return
    setPill({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, [value])

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Pricing view"
      style={{
        position: 'relative',
        display: 'inline-flex',
        padding: 4,
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--neu-inset)',
        background: 'var(--bg)',
      }}
    >
      {/* Single persistent pill — slides via CSS transition */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: pill.left,
          width: pill.width,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--bg)',
          boxShadow: 'var(--neu-raised-sm)',
          opacity: pill.width > 0 ? 1 : 0,
          transition: 'left 240ms cubic-bezier(0.4, 0, 0.2, 1), width 240ms cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
        }}
      />

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
              zIndex: 1,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              color: active ? 'var(--accent)' : 'var(--text-mute)',
              background: 'transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 200ms ease',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
