import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { addons, bundles, modulePrices, trialDays } from '@/data/pricing'
import { getModuleById } from '@/data/modules'
import BundleToggle, { type PricingView } from './BundleToggle'
import PricingCard from './PricingCard'
import { ModuleIcon } from './icons/ModuleIcons'

export interface CartData {
  moduleNames: string[]
  addonNames: string[]
  bundleName: string | null
  total: number
}

export default function PricingSection({
  compact = false,
  onCartChange,
}: {
  compact?: boolean
  onCartChange?: (cart: CartData) => void
}) {
  const [view, setView] = useState<PricingView>('individual')

  // ── Selection state (all lifted here so we can compute total) ──
  const [selectedModuleIds, setSelectedModuleIds] = useState<Set<string>>(new Set())
  const [staaxPlan, setStaaxPlan]                 = useState<1500 | 4000>(1500)
  const [selectedBundleId, setSelectedBundleId]   = useState<string | null>(null)
  const [selectedAddons, setSelectedAddons]        = useState<Set<string>>(new Set())

  // Reset module/bundle selection when switching views
  useEffect(() => {
    setSelectedModuleIds(new Set())
    setSelectedBundleId(null)
    // Bundles only allow BYOK — clear AI Layer and Mobile App when switching to bundles
    if (view === 'bundles') {
      setSelectedAddons(prev => {
        const next = new Set(prev)
        for (const id of next) { if (id !== 'byok') next.delete(id) }
        return next
      })
    }
  }, [view])

  // Compute and report CartData whenever anything changes
  useEffect(() => {
    if (!onCartChange) return
    const addonNames = [...selectedAddons].map(id => addons.find(a => a.id === id)?.name ?? id)
    const addonTotal = [...selectedAddons].reduce((s, id) => s + (addons.find(a => a.id === id)?.priceDelta ?? 0), 0)

    if (view === 'bundles') {
      const bundle = bundles.find(b => b.id === selectedBundleId)
      onCartChange({ moduleNames: [], addonNames, bundleName: bundle?.name ?? null, total: (bundle?.price ?? 0) + addonTotal })
    } else {
      const moduleNames = modulePrices.filter(mp => selectedModuleIds.has(mp.moduleId)).map(mp => mp.moduleName)
      const moduleTotal = [...selectedModuleIds].reduce((s, id) => {
        if (id === 'staax') return s + staaxPlan
        return s + (modulePrices.find(m => m.moduleId === id)?.price ?? 0)
      }, 0)
      onCartChange({ moduleNames, addonNames, bundleName: null, total: moduleTotal + addonTotal })
    }
  }, [selectedModuleIds, staaxPlan, selectedBundleId, selectedAddons, view]) // eslint-disable-line react-hooks/exhaustive-deps

  function toggleAddon(id: string) {
    setSelectedAddons(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (id === 'ai')   next.delete('byok')
        if (id === 'byok') next.delete('ai')
        next.add(id)
      }
      return next
    })
  }

  function toggleRow(id: string) {
    setSelectedModuleIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else {
        next.add(id)
        if (id === 'staax') setStaaxPlan(1500)
      }
      return next
    })
  }

  function toggleStaaxChip(plan: 1500 | 4000, e: React.MouseEvent) {
    e.stopPropagation()
    setSelectedModuleIds(prev => {
      const next = new Set(prev)
      if (next.has('staax') && staaxPlan === plan) { next.delete('staax') } else {
        next.add('staax')
        setStaaxPlan(plan)
      }
      return next
    })
  }

  function toggleBundle(id: string) {
    setSelectedBundleId(prev => prev === id ? null : id)
  }

  return (
    <section
      id="pricing"
      style={{
        position: 'relative',
        padding: compact ? 0 : 'var(--space-30) var(--space-8)',
        background: 'var(--bg)',
      }}
    >
      <div style={{ maxWidth: compact ? 'none' : 1200, margin: compact ? 0 : '0 auto' }}>
        {/* Header — hidden in compact mode */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: 'var(--space-6)',
            display: compact ? 'none' : 'flex',
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

        {/* Toggle visible in compact mode at the top */}
        {compact && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
            <BundleToggle value={view} onChange={setView} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {view === 'individual' ? (
            <motion.div
              key="individual"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <IndividualView
                selectable={compact}
                selectedIds={selectedModuleIds}
                staaxPlan={staaxPlan}
                onToggleRow={toggleRow}
                onToggleStaaxChip={toggleStaaxChip}
              />
            </motion.div>
          ) : (
            <motion.div
              key="bundles"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <BundlesView
                selectable={compact}
                selectedBundleId={selectedBundleId}
                onToggleBundle={toggleBundle}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add-ons — Bundles view shows BYOK only; Modules view shows all three */}
        {(() => {
          const visibleAddons = view === 'bundles' ? addons.filter(a => a.id === 'byok') : addons
          return (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              style={compact ? {
                marginTop: 'var(--space-8)',
                display: 'flex',
                alignItems: 'stretch',
                gap: 'var(--space-4)',
              } : {
                marginTop: 'var(--space-8)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg)',
                boxShadow: 'var(--neu-inset)',
                display: 'grid',
                gridTemplateColumns: `max-content repeat(${visibleAddons.length}, 1fr)`,
              }}
            >
              {/* "Add-ons" side label */}
              <div
                style={compact ? {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px 16px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg)',
                  boxShadow: 'var(--neu-inset)',
                  flexShrink: 0,
                } : {
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
                  Add-ons<sup style={{ color: 'var(--accent)', fontSize: 8, verticalAlign: 'super', lineHeight: 0, opacity: 0.75 }}>*</sup>
                </span>
              </div>

              {visibleAddons.map((a, idx) => {
                const addonSelected = selectedAddons.has(a.id)
                // AI Layer and BYOK are mutually exclusive — only relevant in Modules view
                const isDisabled =
                  (a.id === 'byok' && selectedAddons.has('ai')) ||
                  (a.id === 'ai'   && selectedAddons.has('byok'))

                return (
                  <div
                    key={a.id}
                    onClick={compact && !isDisabled ? () => toggleAddon(a.id) : undefined}
                    style={compact ? {
                      flex: 1,
                      padding: '24px 28px',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--bg)',
                      boxShadow: addonSelected ? 'var(--neu-inset)' : 'var(--neu-raised)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 10,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.35 : 1,
                      transition: 'box-shadow 220ms ease, opacity 220ms ease',
                    } : {
                      padding: '28px 32px',
                      borderRight: idx < visibleAddons.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: addonSelected ? 'var(--text-dim)' : 'var(--text-mute)',
                        transition: 'color 200ms ease',
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
                          color: a.priceDelta < 0 ? 'var(--status-live)' : 'var(--text)',
                        }}
                      >
                        {a.priceDelta < 0 ? '−' : '+'}₹{Math.abs(a.priceDelta).toLocaleString('en-IN')}
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
                  </div>
                )
              })}
            </motion.div>
          )
        })()}

        {/* Footnote */}
        <p
          style={{
            marginTop: 'var(--space-4)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-mute)',
            textAlign: 'right',
          }}
        >
          * Module prices are exclusive of add-ons listed below.
        </p>
      </div>
    </section>
  )
}

function IndividualView({
  selectable = false,
  selectedIds,
  staaxPlan,
  onToggleRow,
  onToggleStaaxChip,
}: {
  selectable?: boolean
  selectedIds: Set<string>
  staaxPlan: 1500 | 4000
  onToggleRow?: (id: string) => void
  onToggleStaaxChip?: (plan: 1500 | 4000, e: React.MouseEvent) => void
}) {
  return (
    <div
      style={{
        borderRadius: '24px',
        background: 'var(--bg)',
        boxShadow: 'var(--neu-raised)',
        overflow: 'hidden',
      }}
    >
      {modulePrices.map((mp, idx) => {
        const mod        = getModuleById(mp.moduleId)
        const isSelected = selectedIds.has(mp.moduleId)
        const isStaax    = mp.moduleId === 'staax'
        const clickable  = !mp.comingSoon
        const accent     = mod?.color ?? 'var(--accent)'
        // 8-digit hex = #RRGGBBAA — adds ~8% opacity tint for selection bg
        const accentBg   = accent.startsWith('#') ? accent + '14' : 'rgba(139,92,246,0.06)'

        return (
          <div
            key={mp.moduleId}
            onClick={selectable && clickable ? () => onToggleRow?.(mp.moduleId) : undefined}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
              padding: '18px 28px',
              borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)',
              cursor: selectable && clickable ? 'pointer' : 'default',
              background: selectable && isSelected ? accentBg : 'transparent',
              transition: 'background 200ms ease',
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

            {/* Price or Coming soon */}
            <div style={{ textAlign: 'right', paddingLeft: 24 }}>
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
              ) : isStaax ? (
                /* STAAX — two chips; navigate on landing page, toggle on start page */
                <div style={{ display: 'flex', gap: 12 }}>
                  {([
                    { price: 1500 as const, desc: '10 algos' },
                    { price: 4000 as const, desc: '30 algos' },
                  ]).map((plan) => {
                    const chipActive = selectable && isSelected && staaxPlan === plan.price
                    const chipStyle: React.CSSProperties = {
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg)',
                      boxShadow: chipActive ? 'var(--neu-inset)' : 'var(--neu-raised-sm)',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 5,
                      cursor: 'pointer',
                      opacity: selectable && isSelected && !chipActive ? 0.4 : 1,
                      transition: 'box-shadow 200ms ease, opacity 200ms ease',
                      textDecoration: 'none',
                    }
                    const inner = (
                      <>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                          ₹{plan.price.toLocaleString('en-IN')}
                          <sup style={{ fontSize: 9, verticalAlign: 'super', lineHeight: 0, color: 'var(--accent)', opacity: 0.75 }}>*</sup>
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mute)', fontWeight: 400 }}>
                          /mo ({plan.desc})
                        </span>
                      </>
                    )
                    return selectable ? (
                      <div key={plan.price} onClick={(e) => onToggleStaaxChip?.(plan.price, e)} style={chipStyle}>
                        {inner}
                      </div>
                    ) : (
                      <Link key={plan.price} to="/start" style={chipStyle}>{inner}</Link>
                    )
                  })}
                </div>
              ) : (
                /* Non-STAAX chip — navigate on landing page, flat+selectable on start page */
                (() => {
                  const chipStyle: React.CSSProperties = {
                    display: 'inline-flex',
                    alignItems: 'baseline',
                    gap: 5,
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg)',
                    boxShadow: 'var(--neu-raised-sm)',
                    textDecoration: 'none',
                    cursor: selectable ? 'default' : 'pointer',
                  }
                  const inner = (
                    <>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                        ₹{mp.price!.toLocaleString('en-IN')}
                        <sup style={{ fontSize: 9, verticalAlign: 'super', lineHeight: 0, color: 'var(--accent)', opacity: 0.75 }}>*</sup>
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 400, color: 'var(--text-mute)' }}>
                        /mo
                      </span>
                    </>
                  )
                  return selectable
                    ? <div style={chipStyle}>{inner}</div>
                    : <Link to="/start" style={chipStyle}>{inner}</Link>
                })()
              )}
            </div>

          </div>
        )
      })}
    </div>
  )
}

function BundlesView({
  selectable = false,
  selectedBundleId,
  onToggleBundle,
}: {
  selectable?: boolean
  selectedBundleId: string | null
  onToggleBundle?: (id: string) => void
}) {

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        alignItems: 'stretch',
        gap: 'var(--space-5)',
      }}
    >
      {bundles.map((b) => {
        const moduleBullets = b.includedModules
          .map((id) => getModuleById(id)?.name)
          .filter(Boolean) as string[]
        const addonBullets = b.includedAddons.map((id) => {
          const a = addons.find((x) => x.id === id)
          return a ? `${a.name}` : id
        })
        const isSelected = selectedBundleId === b.id
        return (
          <div
            key={b.id}
            onClick={() => onToggleBundle?.(b.id)}
            style={{
              borderRadius: 24,
              height: '100%',
              boxSizing: 'border-box',
              cursor: selectable ? 'pointer' : 'default',
            }}
          >
          <PricingCard
            title={b.name}
            tagline={b.tagline}
            price={b.price}
            featured={b.featured}
            tierLabel="Bundle"
            selected={selectable && isSelected}
            hideCta={selectable}
            bullets={[
              `Modules: ${b.id === 'bundle_premium' ? 'All modules' : moduleBullets.join(', ')}`,
              ...addonBullets.map((x) => `Includes ${x}`),
              '3-day free trial',
              'Cancel anytime',
            ]}
          />
          </div>
        )
      })}
    </div>
  )
}
