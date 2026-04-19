import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { addons, bundles, modulePrices, trialDays } from '@/data/pricing'
import { getModuleById } from '@/data/modules'
import BundleToggle, { type PricingView } from './BundleToggle'
import PricingCard from './PricingCard'
import { ModuleIcon } from './icons/ModuleIcons'

export default function PricingSection() {
  const [view, setView] = useState<PricingView>('individual')

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
              <IndividualView />
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

        {/* Add-ons */}
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

          {addons.map((a, idx) => (
            <div
              key={a.id}
              style={{
                padding: '28px 32px',
                borderRight: idx < addons.length - 1
                  ? '1px solid var(--border-subtle)'
                  : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {/* Name label */}
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
              {/* Price */}
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
              {/* Brief description */}
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
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function IndividualView() {
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
        const mod = getModuleById(mp.moduleId)
        return (
          <div
            key={mp.moduleId}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
              padding: '18px 28px',
              borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)',
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
              ) : mp.moduleId === 'staax' ? (
                /* STAAX — two plan chips */
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { price: 1500, desc: '10 algos' },
                    { price: 4000, desc: '30 algos' },
                  ].map((plan) => (
                    <div
                      key={plan.price}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg)',
                        boxShadow: 'var(--neu-raised-sm)',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 5,
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mute)', fontWeight: 400 }}>
                        /mo ({plan.desc})
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: 600, fontSize: 15 }}>
                  ₹{mp.price!.toLocaleString('en-IN')}
                  <span style={{ color: 'var(--text-mute)', fontWeight: 400, fontSize: 13 }}>/mo</span>
                </span>
              )}
            </div>

          </div>
        )
      })}
    </div>
  )
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
        const addonBullets = b.includedAddons.map((id) => {
          const a = addons.find((x) => x.id === id)
          return a ? `${a.name}` : id
        })
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
              ...addonBullets.map((x) => `Includes ${x}`),
              '3-day free trial',
              'Cancel anytime',
            ]}
          />
        )
      })}
    </div>
  )
}
