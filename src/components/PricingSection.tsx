import { useState, useRef, useEffect } from 'react'
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
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.24em', color: 'var(--accent)', textTransform: 'uppercase' }}>
            Pricing
          </span>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.6vw, 52px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.08, color: 'var(--text)' }}>
            Simple pricing.<br />No lock-in.
          </h2>
          <p style={{ margin: 0, fontSize: 'clamp(15px, 1.3vw, 18px)', lineHeight: 1.6, color: 'var(--text-dim)', maxWidth: '560px' }}>
            Start with a {trialDays}-day free trial. Upgrade, downgrade, or cancel anytime. Monthly billing via Razorpay.
          </p>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <BundleToggle value={view} onChange={setView} />
          </div>
        </motion.div>

        {/* Both views stay in DOM — cross-fade via CSS, no height collapse */}
        <div style={{ position: 'relative' }}>
          {(['individual', 'bundles'] as const).map((v) => {
            const isActive = view === v
            return (
              <div
                key={v}
                style={{
                  position: isActive ? 'relative' : 'absolute',
                  top: isActive ? undefined : 0,
                  left: isActive ? undefined : 0,
                  right: isActive ? undefined : 0,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                  pointerEvents: isActive ? 'auto' : 'none',
                  visibility: isActive ? 'visible' : 'hidden',
                  transition: 'opacity 280ms ease, transform 280ms ease',
                }}
              >
                {v === 'individual'
                  ? <IndividualView selectedAddons={selectedAddons} onToggleAddon={toggleAddon} />
                  : <BundlesView />
                }
              </div>
            )
          })}
        </div>

        {/* Add-ons — always visible */}
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
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px 24px', borderRight: '1px solid var(--border-subtle)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-mute)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              Add-ons
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ flex: 1, display: 'flex' }}
            >
              {addons.map((a, idx) => {
                const isIndividual = view === 'individual'
                const aiActive = selectedAddons.includes('ai')
                const isByok = a.id === 'byok'
                const isDisabled = isIndividual && isByok && aiActive
                const isActive = isIndividual && selectedAddons.includes(a.id)
                const isDiscount = a.priceDelta < 0

                const cellContent = (
                  <>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--text-mute)' }}>
                      {a.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: isDiscount ? 'var(--status-live)' : 'var(--text)' }}>
                        {isDiscount ? '−' : '+'}₹{Math.abs(a.priceDelta).toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-mute)' }}>/mo</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: 'var(--text-mute)', textAlign: 'center' as const, maxWidth: 200 }}>
                      {a.description.split('.')[0]}.
                    </p>
                  </>
                )

                if (isIndividual) {
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={!isDisabled ? () => toggleAddon(a.id) : undefined}
                      style={{
                        all: 'unset', boxSizing: 'border-box', flex: 1,
                        cursor: !isDisabled ? 'pointer' : 'default',
                        padding: '20px 24px', margin: '8px',
                        marginRight: idx < addons.length - 1 ? 0 : '8px',
                        borderRadius: 'var(--radius-md)', background: 'var(--bg)',
                        boxShadow: isActive ? 'var(--neu-inset)' : 'var(--neu-raised-sm)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                        opacity: isDisabled ? 0.35 : 1,
                        transition: 'box-shadow 160ms ease, opacity 160ms ease',
                      }}
                    >
                      {cellContent}
                    </button>
                  )
                }

                return (
                  <div
                    key={a.id}
                    style={{
                      flex: 1, padding: '28px 32px',
                      borderRight: idx < addons.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    }}
                  >
                    {cellContent}
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

// ─── IndividualView ────────────────────────────────────────────────────────────

function IndividualView({
  selectedAddons,
  onToggleAddon,
}: {
  selectedAddons: string[]
  onToggleAddon: (id: string) => void
}) {
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [pendingModules, setPendingModules] = useState<string[]>([])

  const moduleRowRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const cartRef       = useRef<HTMLDivElement | null>(null)
  const bounceRef     = useRef<HTMLDivElement | null>(null)

  // Cart squash-stretch bounce on item landing
  const bounceCart = () => {
    const el = bounceRef.current
    if (!el) return
    el.animate(
      [
        { transform: 'scaleY(1) scaleX(1)' },
        { transform: 'scaleY(0.88) scaleX(1.06)' },
        { transform: 'scaleY(1.08) scaleX(0.96)' },
        { transform: 'scaleY(0.97) scaleX(1.01)' },
        { transform: 'scaleY(1) scaleX(1)' },
      ],
      { duration: 450, easing: 'ease-out' }
    )
  }

  // Gentle wiggle on item removal
  const wiggleCart = () => {
    const el = bounceRef.current
    if (!el) return
    el.animate(
      [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(-3deg)' },
        { transform: 'rotate(3deg)' },
        { transform: 'rotate(-2deg)' },
        { transform: 'rotate(0deg)' },
      ],
      { duration: 320, easing: 'ease-out' }
    )
  }

  // Arc fly animation using Web Animations API
  const flyToCart = (moduleId: string) => {
    const sourceEl = moduleRowRefs.current[moduleId]
    if (!sourceEl || !cartRef.current) {
      // Fallback: no animation, just add to cart
      setPendingModules((prev) => prev.filter((id) => id !== moduleId))
      setSelectedModules((prev) => [...prev, moduleId])
      return
    }

    const mp  = modulePrices.find((m) => m.moduleId === moduleId)
    const mod = getModuleById(moduleId)
    if (!mp || !mod) return

    const sourceRect = sourceEl.getBoundingClientRect()
    const cartRect   = cartRef.current.getBoundingClientRect()

    // Create the fly card DOM element
    const flyEl = document.createElement('div')
    const startLeft = sourceRect.left + Math.min(80, sourceRect.width * 0.3)
    const startTop  = sourceRect.top + sourceRect.height / 2 - 22

    flyEl.style.cssText = [
      'position:fixed',
      `left:${startLeft}px`,
      `top:${startTop}px`,
      'width:80px',
      'height:44px',
      `border-left:3px solid ${mod.color}`,
      'border-radius:8px',
      'z-index:9999',
      'pointer-events:none',
      'box-shadow:0 4px 16px rgba(0,0,0,0.2)',
      'display:flex',
      'flex-direction:column',
      'gap:2px',
      'padding:7px 9px',
      'background:var(--bg)',
    ].join(';')

    const nameDiv = document.createElement('div')
    nameDiv.style.cssText = 'font-size:8px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(128,128,128,0.8);font-family:monospace'
    nameDiv.textContent = mp.moduleName

    const priceDiv = document.createElement('div')
    priceDiv.style.cssText = `font-size:12px;font-weight:700;color:${mod.color};font-family:monospace`
    priceDiv.textContent = `₹${mp.price?.toLocaleString('en-IN') ?? ''}`

    flyEl.appendChild(nameDiv)
    flyEl.appendChild(priceDiv)
    document.body.appendChild(flyEl)

    // Target: center of the cart tray (tray at x=28,y=54,w=132,h=66 in SVG coords)
    const trayX = cartRect.left + 28 + 66
    const trayY = cartRect.top  + 54 + 33
    const endX  = trayX - startLeft - 40
    const endY  = trayY - startTop  - 22

    const anim = flyEl.animate(
      [
        { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: '1' },
        { transform: `translate(${endX * 0.38}px,-70px) rotate(8deg) scale(0.88)`, opacity: '1', offset: 0.4 },
        { transform: `translate(${endX}px,${endY}px) rotate(15deg) scale(0.55)`, opacity: '0' },
      ],
      { duration: 530, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)', fill: 'forwards' }
    )

    anim.onfinish = () => {
      flyEl.remove()
      bounceCart()
      setPendingModules((prev) => prev.filter((id) => id !== moduleId))
      setSelectedModules((prev) => [...prev, moduleId])
    }
  }

  const toggleModule = (moduleId: string) => {
    if (selectedModules.includes(moduleId)) {
      setSelectedModules((prev) => prev.filter((id) => id !== moduleId))
      wiggleCart()
      return
    }
    if (pendingModules.includes(moduleId)) return // already flying
    setPendingModules((prev) => [...prev, moduleId])
    flyToCart(moduleId)
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
        style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}
      >
        {/* LEFT — clickable module rows */}
        <div style={{ borderRadius: '24px', background: 'var(--bg)', boxShadow: 'var(--neu-raised)', overflow: 'hidden' }}>
          {modulePrices.map((mp, idx) => {
            const mod        = getModuleById(mp.moduleId)
            const isSelected = selectedModules.includes(mp.moduleId) || pendingModules.includes(mp.moduleId)
            const clickable  = !mp.comingSoon

            return (
              <div
                key={mp.moduleId}
                ref={(el: HTMLDivElement | null) => { moduleRowRefs.current[mp.moduleId] = el }}
                onClick={clickable ? () => toggleModule(mp.moduleId) : undefined}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center',
                  padding: '18px 28px',
                  borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)',
                  borderLeft: isSelected ? `3px solid ${mod?.color ?? 'var(--accent)'}` : '3px solid transparent',
                  background: isSelected ? `${mod?.color ?? 'var(--accent)'}14` : 'transparent',
                  boxShadow: isSelected ? 'var(--neu-inset)' : 'none',
                  cursor: clickable ? 'pointer' : 'default',
                  opacity: mp.comingSoon ? 0.5 : 1,
                  transition: 'background 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
                }}
              >
                {/* Module identity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', boxShadow: 'var(--neu-inset)', color: mod?.color ?? 'var(--text-mute)' }}>
                    {mod && <ModuleIcon iconKey={mod.iconKey} size={20} />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                      {mp.moduleName}
                    </span>
                    {mod && (
                      <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>({mod.tagline})</span>
                    )}
                  </div>
                </div>

                {/* Price / badge / checkmark */}
                <div style={{ textAlign: 'right', paddingLeft: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {mp.comingSoon ? (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-mute)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg)', boxShadow: 'var(--neu-inset)' }}>
                      Coming soon
                    </span>
                  ) : (
                    <>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: 600, fontSize: 15 }}>
                        ₹{mp.price!.toLocaleString('en-IN')}
                        <span style={{ color: 'var(--text-mute)', fontWeight: 400, fontSize: 13 }}>/mo</span>
                      </span>
                      <span style={{ width: 20, textAlign: 'center', fontWeight: 700, fontSize: 16, color: isSelected ? (mod?.color ?? 'var(--accent)') : 'transparent', transition: 'color 160ms ease', userSelect: 'none' }}>
                        ✓
                      </span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* RIGHT — shopping cart */}
        <div style={{ position: 'sticky', top: 100 }}>
          <ShoppingCart
            selectedModules={selectedModules}
            selectedAddons={selectedAddons}
            onRemoveModule={toggleModule}
            onToggleAddon={onToggleAddon}
            total={total}
            cartRef={cartRef}
            bounceRef={bounceRef}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .individual-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes barIn {
          from { transform: translateY(-14px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </>
  )
}

// ─── ShoppingCart ──────────────────────────────────────────────────────────────

interface ShoppingCartProps {
  selectedModules: string[]
  selectedAddons:  string[]
  onRemoveModule:  (id: string) => void
  onToggleAddon:   (id: string) => void
  total:           number
  cartRef:         { current: HTMLDivElement | null }
  bounceRef:       { current: HTMLDivElement | null }
}

function ShoppingCart({
  selectedModules,
  selectedAddons,
  onRemoveModule,
  onToggleAddon,
  total,
  cartRef,
  bounceRef,
}: ShoppingCartProps) {
  const badgeRef = useRef<HTMLDivElement | null>(null)
  const hasModules = selectedModules.length > 0
  const count = selectedModules.length + selectedAddons.length
  const aiActive = selectedAddons.includes('ai')

  // Last-added module color for rim accent
  const rimColor = hasModules
    ? (getModuleById(selectedModules[selectedModules.length - 1])?.color ?? 'var(--accent)')
    : 'transparent'

  // Badge spring-pop on count change
  useEffect(() => {
    const el = badgeRef.current
    if (!el || count === 0) return
    el.animate(
      [
        { transform: 'scale(1.5)', opacity: '0.7' },
        { transform: 'scale(1)',   opacity: '1' },
      ],
      { duration: 220, easing: 'cubic-bezier(0.34,1.56,0.64,1)' }
    )
  }, [count])

  return (
    <div style={{ borderRadius: 'var(--radius-md)', background: 'var(--bg)', boxShadow: 'var(--neu-raised)', padding: '20px 20px 24px' }}>

      {/* ── Cart SVG ── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <div ref={cartRef} style={{ position: 'relative', width: 200, height: 160, flexShrink: 0 }}>

          {/* Bounce wrapper — transform-origin bottom so squash looks physical */}
          <div ref={bounceRef} style={{ width: '100%', height: '100%', transformOrigin: 'center bottom' }}>
            <svg viewBox="0 0 200 160" width="200" height="160" style={{ display: 'block' }}>
              {/* Body depth shadow */}
              <rect x="23" y="49" width="148" height="82" rx="12" fill="rgba(0,0,0,0.13)" />
              {/* Cart body */}
              <rect x="20" y="45" width="148" height="82" rx="12" fill="var(--bg)" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
              {/* Body top highlight */}
              <rect x="21" y="46" width="146" height="18" rx="11" fill="rgba(255,255,255,0.035)" />
              {/* Interior tray */}
              <rect x="28" y="54" width="132" height="66" rx="8" fill="rgba(0,0,0,0.18)" />
              {/* Tray top shadow */}
              <rect x="28" y="54" width="132" height="5" rx="4" fill="rgba(0,0,0,0.1)" />
              {/* Rim accent — colored when items present */}
              <rect x="20" y="45" width="148" height="6" rx="12" fill={rimColor} opacity="0.75" style={{ transition: 'fill 400ms ease' }} />
              {/* Handle */}
              <path d="M 147 46 Q 177 46 177 20 Q 177 5 163 5" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" strokeLinecap="round" />
              <path d="M 148 47 Q 175 47 175 20 Q 175 7 163 7" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="2.5" strokeLinecap="round" />
              {/* Axle */}
              <rect x="51" y="126" width="86" height="3" rx="1.5" fill="rgba(0,0,0,0.14)" />
              {/* Left wheel */}
              <circle cx="57"  cy="138" r="12" fill="var(--bg)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
              <circle cx="57"  cy="138" r="5"  fill="rgba(255,255,255,0.055)" />
              <circle cx="57"  cy="138" r="2"  fill="rgba(0,0,0,0.18)" />
              {/* Right wheel */}
              <circle cx="131" cy="138" r="12" fill="var(--bg)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
              <circle cx="131" cy="138" r="5"  fill="rgba(255,255,255,0.055)" />
              <circle cx="131" cy="138" r="2"  fill="rgba(0,0,0,0.18)" />
            </svg>
          </div>

          {/* ── Stacked bars overlay (positioned over cart tray) ── */}
          <div
            style={{
              position: 'absolute', left: 28, top: 54, width: 132, height: 66,
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              gap: 2, padding: '3px 4px', overflow: 'hidden', pointerEvents: 'none',
            }}
          >
            {selectedModules.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <span style={{ color: 'rgba(255,255,255,0.16)', fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>empty</span>
              </div>
            ) : (
              // Newest items appear nearest the rim (visually top), oldest at bottom
              [...selectedModules].reverse().map((id) => {
                const mod = getModuleById(id)
                return (
                  <div
                    key={id}
                    style={{
                      height: 11, flexShrink: 0, borderRadius: 3,
                      background: `${mod?.color ?? '#888'}cc`,
                      display: 'flex', alignItems: 'center', paddingLeft: 5,
                      animation: 'barIn 280ms cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                  >
                    <span style={{ color: '#fff', fontSize: 7, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.05em', opacity: 0.9 }}>
                      {id.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* ── Count badge ── */}
          {count > 0 && (
            <div
              ref={badgeRef}
              style={{
                position: 'absolute', top: 2, right: 14,
                minWidth: 22, height: 22, borderRadius: 11,
                background: 'var(--accent)', color: '#fff',
                fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 5px', pointerEvents: 'none',
              }}
            >
              {count}
            </div>
          )}
        </div>
      </div>

      {/* ── Status label ── */}
      <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: hasModules ? 14 : 0 }}>
        {hasModules ? 'Your cart' : 'Click a module to add it'}
      </div>

      {/* ── Add-on chips (fade in when modules present) ── */}
      <div style={{
        maxHeight: hasModules ? '80px' : '0',
        opacity: hasModules ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 300ms ease, opacity 240ms ease',
        marginBottom: hasModules ? 14 : 0,
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {addons
            .filter((a) => !(a.id === 'byok' && aiActive))
            .map((a) => {
              const isActive   = selectedAddons.includes(a.id)
              const isDiscount = a.priceDelta < 0
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onToggleAddon(a.id)}
                  style={{
                    all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                    padding: '5px 10px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg)',
                    boxShadow: isActive ? 'var(--neu-inset)' : 'var(--neu-raised-sm)',
                    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                    color: isDiscount ? 'var(--status-live)' : 'var(--text-dim)',
                    whiteSpace: 'nowrap',
                    transition: 'box-shadow 160ms ease',
                  }}
                >
                  {isDiscount ? '−' : '+'} ₹{Math.abs(a.priceDelta)} {a.name.split(' ')[0]}
                </button>
              )
            })}
        </div>
      </div>

      {/* ── Total + module list + CTA (slide in when modules present) ── */}
      <div style={{
        maxHeight: hasModules ? '400px' : '0',
        opacity: hasModules ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 320ms ease, opacity 240ms ease',
      }}>
        <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 12 }} />

        {/* Selected module rows with × remove */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
          {selectedModules.map((id) => {
            const mp  = modulePrices.find((m) => m.moduleId === id)
            const mod = getModuleById(id)
            if (!mp) return null
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: mod?.color ?? 'var(--accent)', flexShrink: 0, display: 'inline-block' }} />
                <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.01em' }}>{mp.moduleName}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>₹{mp.price!.toLocaleString('en-IN')}</span>
                <button
                  type="button"
                  onClick={() => onRemoveModule(id)}
                  style={{ all: 'unset', cursor: 'pointer', color: 'var(--text-mute)', fontSize: 14, lineHeight: 1, padding: '2px 4px', borderRadius: 3, transition: 'color 120ms ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-mute)' }}
                  aria-label={`Remove ${mp.moduleName}`}
                >×</button>
              </div>
            )
          })}
        </div>

        {/* Total row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--text-dim)' }}>Total</span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              ₹{Math.max(0, total).toLocaleString('en-IN')}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mute)' }}>per month</div>
          </div>
        </div>

        {/* Trial note */}
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mute)', marginBottom: 12 }}>
          {trialDays}-day free trial · Cancel anytime
        </div>

        {/* CTA */}
        <button
          type="button"
          style={{
            all: 'unset', cursor: 'pointer', display: 'block', width: '100%', boxSizing: 'border-box',
            textAlign: 'center', padding: '11px 0', borderRadius: '100px',
            background: 'var(--bg)', boxShadow: 'var(--neu-raised)',
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600,
            color: 'var(--accent)', letterSpacing: '-0.01em',
          }}
        >
          Subscribe →
        </button>
      </div>
    </div>
  )
}

// ─── Bundles ───────────────────────────────────────────────────────────────────

const bundleAddonNotes: Record<string, string> = {
  bundle_premium: 'AI Layer included · Mobile App included · BYOK −₹100/mo',
  bundle_trader:  'AI Layer included · Add Mobile App +₹200/mo · BYOK −₹100/mo',
  bundle_money:   'AI Layer included · Mobile App included · BYOK −₹100/mo',
}

function BundlesView() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
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
