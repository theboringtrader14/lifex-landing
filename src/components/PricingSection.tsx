import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { addons, bundles, modulePrices, trialDays } from '@/data/pricing'
import { getModuleById } from '@/data/modules'
import BundleToggle, { type PricingView } from './BundleToggle'
import PricingCard from './PricingCard'
import { ModuleIcon } from './icons/ModuleIcons'

export default function PricingSection() {
  const [view, setView] = useState<PricingView>('individual')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) => {
      if (prev.includes(addonId)) return prev.filter((id) => id !== addonId)
      const next = [...prev, addonId]
      // Selecting AI Layer: auto-deselect BYOK (they're mutually exclusive)
      if (addonId === 'ai') return next.filter((id) => id !== 'byok')
      return next
    })
  }

  return (
    <section
      id="pricing"
      style={{
        position: 'relative',
        padding: 'var(--space-30) var(--space-8)',
        background: 'var(--bg)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.24em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
            }}
          >
            Pricing
          </span>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(34px, 4.6vw, 52px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.08,
              color: 'var(--text)',
            }}
          >
            Simple pricing.<br />No lock-in.
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(15px, 1.3vw, 18px)',
              lineHeight: 1.6,
              color: 'var(--text-dim)',
              maxWidth: '560px',
            }}
          >
            Start with a {trialDays}-day free trial. Upgrade, downgrade, or cancel anytime. Monthly billing via Razorpay.
          </p>

          <div style={{ marginTop: 'var(--space-4)' }}>
            <BundleToggle value={view} onChange={setView} />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'individual' ? (
            <motion.div
              key="individual"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <IndividualView selectedAddons={selectedAddons} onToggleAddon={toggleAddon} />
            </motion.div>
          ) : (
            <motion.div
              key="bundles"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <BundlesView />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add-ons — always visible, selectable */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: 'var(--space-8)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg)',
            boxShadow: 'var(--neu-inset)',
            display: 'grid',
            gridTemplateColumns: `max-content repeat(${addons.length}, 1fr)`,
          }}
        >
          {/* "Add-ons" side label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '28px 24px',
              borderRight: '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text-mute)',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              Add-ons
            </span>
          </div>

          {addons.map((a, idx) => {
            const isIndividual = view === 'individual'
            const aiActive = selectedAddons.includes('ai')
            const isByok = a.id === 'byok'
            const isDisabled = isIndividual && isByok && aiActive
            const isActive = isIndividual && selectedAddons.includes(a.id)
            const isDiscount = a.priceDelta < 0
            const Tag = isIndividual && !isDisabled ? 'button' : 'div'
            return (
              <Tag
                key={a.id}
                {...(isIndividual && !isDisabled ? { type: 'button' as const, onClick: () => toggleAddon(a.id) } : {})}
                style={{
                  all: 'unset',
                  cursor: isIndividual && !isDisabled ? 'pointer' : 'default',
                  padding: '20px 24px',
                  margin: '8px',
                  marginRight: idx < addons.length - 1 ? '0' : '8px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg)',
                  boxShadow: isActive ? 'var(--neu-inset)' : 'var(--neu-raised-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  opacity: isDisabled ? 0.35 : 1,
                  transition: 'box-shadow 160ms ease, opacity 160ms ease',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--text-mute)',
                  }}
                >
                  {a.name}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 28,
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: isDiscount ? 'var(--status-live)' : 'var(--text)',
                    }}
                  >
                    {isDiscount ? '−' : '+'}₹{Math.abs(a.priceDelta).toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-mute)' }}>
                    /mo
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    lineHeight: 1.55,
                    color: 'var(--text-mute)',
                    textAlign: 'center',
                    maxWidth: 200,
                  }}
                >
                  {a.description.split('.')[0]}.
                </p>
              </Tag>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function IndividualView({
  selectedAddons,
  onToggleAddon,
}: {
  selectedAddons: string[]
  onToggleAddon: (id: string) => void
}) {
  const [selectedModules, setSelectedModules] = useState<string[]>([])

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    )
  }

  const total =
    selectedModules.reduce((sum, id) => {
      const mp = modulePrices.find((m) => m.moduleId === id)
      return sum + (mp?.price ?? 0)
    }, 0) +
    selectedAddons.reduce((sum, id) => {
      const a = addons.find((x) => x.id === id)
      return sum + (a?.priceDelta ?? 0)
    }, 0)

  return (
    <>
      <div
        className="individual-grid"
        style={{ display: 'grid', gridTemplateColumns: '65% 35%', gap: 24, alignItems: 'start' }}
      >
        {/* LEFT — clickable module list */}
        <div
          style={{
            borderRadius: '24px',
            background: 'var(--bg)',
            boxShadow: 'var(--neu-raised)',
            overflow: 'hidden',
          }}
        >
          {modulePrices.map((mp, idx) => {
            const mod = getModuleById(mp.moduleId)
            const isSelected = selectedModules.includes(mp.moduleId)
            const clickable = !mp.comingSoon

            return (
              <div
                key={mp.moduleId}
                onClick={clickable ? () => toggleModule(mp.moduleId) : undefined}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  padding: '18px 28px',
                  borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)',
                  borderLeft: isSelected
                    ? `3px solid ${mod?.color ?? 'var(--accent)'}`
                    : '3px solid transparent',
                  background: isSelected ? `${mod?.color ?? 'var(--accent)'}14` : 'transparent',
                  boxShadow: isSelected ? 'var(--neu-inset)' : 'none',
                  cursor: clickable ? 'pointer' : 'default',
                  opacity: mp.comingSoon ? 0.5 : 1,
                  transition: 'background 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
                }}
              >
                {/* Module identity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      flexShrink: 0,
                      width: 40,
                      height: 40,
                      borderRadius: 11,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--bg)',
                      boxShadow: 'var(--neu-inset)',
                      color: mod?.color ?? 'var(--text-mute)',
                    }}
                  >
                    {mod && <ModuleIcon iconKey={mod.iconKey} size={20} />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 15,
                        fontWeight: 600,
                        color: 'var(--text)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {mp.moduleName}
                    </span>
                    {mod && (
                      <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>
                        ({mod.tagline})
                      </span>
                    )}
                  </div>
                </div>

                {/* Price / badge / checkmark */}
                <div
                  style={{
                    textAlign: 'right',
                    paddingLeft: 24,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  {mp.comingSoon ? (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--text-mute)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg)',
                        boxShadow: 'var(--neu-inset)',
                      }}
                    >
                      Coming soon
                    </span>
                  ) : (
                    <>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text)',
                          fontWeight: 600,
                          fontSize: 15,
                        }}
                      >
                        ₹{mp.price!.toLocaleString('en-IN')}
                        <span style={{ color: 'var(--text-mute)', fontWeight: 400, fontSize: 13 }}>
                          /mo
                        </span>
                      </span>
                      <span
                        style={{
                          width: 20,
                          textAlign: 'center',
                          fontWeight: 700,
                          fontSize: 16,
                          color: isSelected ? (mod?.color ?? 'var(--accent)') : 'transparent',
                          transition: 'color 160ms ease',
                          userSelect: 'none',
                        }}
                      >
                        ✓
                      </span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* RIGHT — sticky cart */}
        <div style={{ position: 'sticky', top: 100, paddingRight: 16 }}>
          <CartPanel
            selectedModules={selectedModules}
            selectedAddons={selectedAddons}
            onRemoveModule={toggleModule}
            onToggleAddon={onToggleAddon}
            total={total}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .individual-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

interface CartPanelProps {
  selectedModules: string[]
  selectedAddons: string[]
  onRemoveModule: (id: string) => void
  onToggleAddon: (id: string) => void
  total: number
}

function CartPanel({
  selectedModules,
  selectedAddons,
  onRemoveModule,
  onToggleAddon,
  total,
}: CartPanelProps) {
  const isEmpty = selectedModules.length === 0

  return (
    <div
      style={{
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg)',
        boxShadow: 'var(--neu-raised)',
        padding: 28,
        minWidth: 240,
      }}
    >
      {isEmpty ? (
        /* State A — empty */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            padding: '24px 0',
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-mute)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-dim)',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            Select modules to build your plan
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-mute)',
              textAlign: 'center',
            }}
          >
            Click any module to add it
          </span>
        </div>
      ) : (
        /* State B — modules selected */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header */}
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text)',
              letterSpacing: '-0.01em',
            }}
          >
            Your Plan
          </span>

          {/* Selected modules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selectedModules.map((id) => {
              const mp = modulePrices.find((m) => m.moduleId === id)
              const mod = getModuleById(id)
              if (!mp) return null
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: mod?.color ?? 'var(--accent)',
                      flexShrink: 0,
                      display: 'inline-block',
                    }}
                  />
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--text)',
                    }}
                  >
                    {mp.moduleName}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      color: 'var(--text-dim)',
                    }}
                  >
                    ₹{mp.price!.toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveModule(id)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      color: 'var(--text-mute)',
                      fontSize: 15,
                      lineHeight: 1,
                      padding: '2px 5px',
                      borderRadius: 4,
                      transition: 'color 120ms ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-mute)' }}
                    aria-label={`Remove ${mp.moduleName}`}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>

          {/* Selected add-ons — plain rows, same style as modules */}
          {selectedAddons.length > 0 && (
            <>
              {selectedAddons.map((id) => {
                const a = addons.find((x) => x.id === id)
                if (!a) return null
                const isDiscount = a.priceDelta < 0
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: 'var(--text-mute)',
                        flexShrink: 0,
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                      <span style={{ color: 'var(--text-mute)', fontWeight: 400 }}>Add-on  </span>
                      {a.name}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        color: isDiscount ? 'var(--status-live)' : 'var(--text-dim)',
                      }}
                    >
                      {isDiscount ? '−' : '+'}₹{Math.abs(a.priceDelta)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleAddon(id)}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        color: 'var(--text-mute)',
                        fontSize: 15,
                        lineHeight: 1,
                        padding: '2px 5px',
                        borderRadius: 4,
                        transition: 'color 120ms ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-mute)' }}
                      aria-label={`Remove ${a.name}`}
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </>
          )}

          <div style={{ height: 1, background: 'var(--border-subtle)' }} />

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-dim)',
              }}
            >
              Total
            </span>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--text)',
                  letterSpacing: '-0.02em',
                }}
              >
                ₹{Math.max(0, total).toLocaleString('en-IN')}
              </div>
              <div
                style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mute)' }}
              >
                per month
              </div>
            </div>
          </div>

          {/* Trial note */}
          <div
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-mute)',
            }}
          >
            {trialDays}-day free trial · Cancel anytime
          </div>

          {/* CTA */}
          <button
            type="button"
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'block',
              textAlign: 'center',
              padding: '12px 0',
              borderRadius: '100px',
              background: 'var(--bg)',
              boxShadow: 'var(--neu-raised)',
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--accent)',
              letterSpacing: '-0.01em',
            }}
          >
            Subscribe →
          </button>
        </div>
      )}
    </div>
  )
}

const bundleAddonNotes: Record<string, string> = {
  bundle_premium: 'AI Layer included · Mobile App included · BYOK −₹100/mo',
  bundle_trader:  'AI Layer included · Add Mobile App +₹200/mo · BYOK −₹100/mo',
  bundle_money:   'AI Layer included · Mobile App included · BYOK −₹100/mo',
}

function BundlesView() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--space-5)',
      }}
    >
      {bundles.map((b) => {
        const moduleBullets = b.includedModules
          .map((id) => getModuleById(id)?.name)
          .filter(Boolean) as string[]

        return (
          <PricingCard
            key={b.id}
            title={b.name}
            tagline={b.tagline}
            price={b.price}
            featured={b.featured}
            tierLabel="Bundle"
            bullets={[
              `Modules: ${b.id === 'bundle_premium' ? 'All modules' : moduleBullets.join(', ')}`,
              bundleAddonNotes[b.id] ?? '',
              '3-day free trial',
              'Cancel anytime',
            ].filter(Boolean)}
          />
        )
      })}
    </div>
  )
}
