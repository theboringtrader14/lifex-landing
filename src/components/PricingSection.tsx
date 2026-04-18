import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { addons, bundles, moduleTiers, trialDays } from '@/data/pricing'
import { getModuleById } from '@/data/modules'
import BundleToggle, { type PricingView } from './BundleToggle'
import PricingCard from './PricingCard'

export default function PricingSection() {
  const [view, setView] = useState<PricingView>('individual')

  return (
    <section
      id="pricing"
      style={{
        position: 'relative',
        padding: 'var(--space-30) var(--space-8)',
        background: 'linear-gradient(180deg, rgba(10,10,20,0) 0%, rgba(10,10,20,0.4) 100%)',
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
            marginBottom: 'var(--space-12)',
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
              color: 'var(--text-muted)',
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
              color: 'var(--text-primary)',
            }}
          >
            Pay for what you use. Or bundle and save.
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(15px, 1.3vw, 18px)',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: 640,
            }}
          >
            {trialDays}-day free trial on every plan. No card required. Cancel anytime. All prices in INR, billed monthly via Razorpay.
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
            marginTop: 'var(--space-16)',
            padding: 'var(--space-8)',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-4)',
            }}
          >
            Add-ons
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'var(--space-5)',
            }}
          >
            {addons.map((a) => (
              <div key={a.id}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{a.name}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      fontWeight: 600,
                      color: a.priceDelta < 0 ? '#34d399' : 'var(--text-secondary)',
                    }}
                  >
                    {a.priceDelta < 0 ? '−' : '+'}₹{Math.abs(a.priceDelta)}/mo
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--text-muted)' }}>
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function IndividualView() {
  return (
    <div
      style={{
        overflowX: 'auto',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <table
        style={{
          width: '100%',
          minWidth: 720,
          borderCollapse: 'collapse',
          fontSize: 14,
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <th style={thStyle('left')}>Module</th>
            <th style={thStyle('right')}>Starter</th>
            <th style={thStyle('right')}>Pro</th>
            <th style={thStyle('right')}>Premium</th>
          </tr>
        </thead>
        <tbody>
          {moduleTiers.map((mt) => {
            const mod = getModuleById(mt.moduleId)
            return (
              <tr
                key={mt.moduleId}
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <td style={tdLabelStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      aria-hidden
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: mod?.color ?? 'var(--text-muted)',
                        boxShadow: `0 0 8px ${mod?.color ?? 'var(--text-muted)'}66`,
                      }}
                    />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                      {mt.moduleName}
                    </span>
                  </div>
                </td>
                <td style={tdValStyle}>{fmtPrice(mt.starter)}</td>
                <td style={tdValStyle}>{fmtPrice(mt.pro)}</td>
                <td style={tdValStyle}>{fmtPrice(mt.premium)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
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
        paddingTop: 'var(--space-4)',
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
              `Modules: ${moduleBullets.join(', ')}`,
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

function fmtPrice(p: number | null): React.ReactNode {
  if (p === null) {
    return <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>—</span>
  }
  return (
    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 500 }}>
      ₹{p.toLocaleString('en-IN')}<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span>
    </span>
  )
}

const thStyle = (align: 'left' | 'right'): React.CSSProperties => ({
  textAlign: align,
  padding: 'var(--space-4) var(--space-5)',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
})

const tdLabelStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: 'var(--space-4) var(--space-5)',
}

const tdValStyle: React.CSSProperties = {
  textAlign: 'right',
  padding: 'var(--space-4) var(--space-5)',
}
