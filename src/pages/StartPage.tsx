import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { modulePrices, addons, bundles } from '../data/pricing'
import { modules } from '../data/modules'

// ─── Types ───────────────────────────────────────────────────────────────────

type StepState = 'upcoming' | 'active' | 'completed'
type StaaxPlan = 'lite' | 'pro'

const STEP_LABELS = ['Choose Plan', 'Sign Up', 'Verify', 'Review', 'Payment', 'Welcome']
const NODE_VH = [0.14, 0.30, 0.46, 0.62, 0.78, 0.94]

// STAAX plans
const STAAX_PLANS = [
  { id: 'lite' as StaaxPlan, label: 'Lite', price: 1000, desc: '10 algos' },
  { id: 'pro'  as StaaxPlan, label: 'Pro',  price: 4000, desc: '30 algos' },
]

// ─── Pipe path builder ────────────────────────────────────────────────────────

function buildPipePath(nodeYs: number[], totalH: number): string {
  if (!nodeYs.length) return ''
  const cx = 80
  let d = `M ${cx} 0 L ${cx} ${nodeYs[0] - 30}`
  for (let i = 0; i < nodeYs.length; i++) {
    const y = nodeYs[i]
    // smooth arrival at node
    d += ` C ${cx} ${y - 10}, ${cx} ${y + 10}, ${cx} ${y}`
    if (i < nodeYs.length - 1) {
      const yn = nodeYs[i + 1]
      const mid = (y + yn) / 2
      d += ` C ${cx} ${y + 20}, ${cx - 20} ${mid}, ${cx} ${yn - 20}`
    }
  }
  d += ` L ${cx} ${totalH}`
  return d
}

// ─── Stepper SVG ──────────────────────────────────────────────────────────────

interface StepperProps {
  nodeYs: number[]
  stepStates: StepState[]
  pipePath: string
  totalH: number
  ballRef: React.RefObject<SVGCircleElement>
  highlightRef: React.RefObject<SVGCircleElement>
  progressRef: React.RefObject<SVGPathElement>
  pipeRef: React.RefObject<SVGPathElement>
  goToStep: (idx: number) => void
}

function StepperSVG({
  nodeYs, stepStates, pipePath, totalH,
  ballRef, highlightRef, progressRef, pipeRef,
  goToStep,
}: StepperProps) {
  if (!pipePath) return null
  return (
    <svg
      width="160"
      height={totalH}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="ballGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.8)" />
          <stop offset="30%"  stopColor="rgba(220,220,235,1)" />
          <stop offset="70%"  stopColor="rgba(140,140,165,1)" />
          <stop offset="100%" stopColor="rgba(60,60,80,1)" />
        </radialGradient>
        <filter id="ballShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="rgba(0,0,0,0.8)" />
        </filter>
      </defs>

      {/* Pipe layers — groove carved into bg */}
      <path d={pipePath} stroke="#0a0c12"                  strokeWidth="20" fill="none" />
      <path d={pipePath} stroke="#13151e"                  strokeWidth="16" fill="none" />
      <path d={pipePath} stroke="rgba(255,255,255,0.03)"   strokeWidth="15" fill="none" />
      <path d={pipePath} stroke="#1a1d25"                  strokeWidth="11" fill="none" />

      {/* Progress fill — purple fluid */}
      <path
        ref={progressRef}
        d={pipePath}
        stroke="url(#purpleGrad)"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />

      {/* Invisible path for ball positioning (getTotalLength / getPointAtLength) */}
      <path ref={pipeRef} d={pipePath} stroke="transparent" strokeWidth="1" fill="none" />

      {/* Step nodes */}
      {nodeYs.map((y, i) => {
        const state = stepStates[i]
        const label = STEP_LABELS[i]
        return (
          <g
            key={i}
            onClick={() => state === 'completed' ? goToStep(i) : undefined}
            style={{ cursor: state === 'completed' ? 'pointer' : 'default' }}
          >
            {state === 'upcoming' && (
              <>
                <circle cx="80" cy={y} r="12" fill="#1e2128" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <text x="80" y={y} fill="rgba(229,231,235,0.35)" fontSize="11" fontFamily="JetBrains Mono, monospace" textAnchor="middle" dy="4">{i + 1}</text>
              </>
            )}
            {state === 'active' && (
              <>
                <circle cx="80" cy={y} r="12" fill="#0a0a0f" stroke="#8b5cf6" strokeWidth="1.5" />
                <circle cx="80" cy={y} r="12" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.4">
                  <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x="80" y={y} fill="#e5e7eb" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="600" textAnchor="middle" dy="4">{i + 1}</text>
              </>
            )}
            {state === 'completed' && (
              <>
                <circle cx="80" cy={y} r="12" fill="#8b5cf6" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" filter="url(#ballShadow)" />
                <text x="80" y={y} fill="white" fontSize="11" textAnchor="middle" dy="4">✓</text>
              </>
            )}
            {/* Label right of node */}
            <text
              x="100"
              y={y + 4}
              fontSize="11"
              fontFamily="JetBrains Mono, monospace"
              fontWeight={state === 'active' ? '600' : '400'}
              fill={
                state === 'completed' ? '#8b5cf6'
                : state === 'active'  ? '#e5e7eb'
                : 'rgba(229,231,235,0.35)'
              }
            >
              {label}
            </text>
          </g>
        )
      })}

      {/* Steel ball */}
      <circle
        ref={ballRef}
        cx="80"
        cy={nodeYs[0] ?? 0}
        r="9"
        fill="url(#ballGrad)"
        filter="url(#ballShadow)"
      />
      {/* Specular highlight */}
      <circle
        ref={highlightRef}
        cx={80 - 3}
        cy={(nodeYs[0] ?? 0) - 3}
        r="3"
        fill="rgba(255,255,255,0.65)"
        style={{ pointerEvents: 'none' }}
      />
    </svg>
  )
}

// ─── Step 1: Choose Plan ──────────────────────────────────────────────────────

interface Step1Props {
  selectedModules: string[]
  toggleModule: (id: string) => void
  selectedBundle: string | null
  setSelectedBundle: (id: string | null) => void
  staaxPlan: StaaxPlan
  setStaaxPlan: (p: StaaxPlan) => void
  onContinue: () => void
}

function Step1({
  selectedModules, toggleModule,
  selectedBundle, setSelectedBundle,
  staaxPlan, setStaaxPlan,
  onContinue,
}: Step1Props) {
  const availableModules = modulePrices.filter(m => !m.comingSoon)

  function selectBundle(bid: string) {
    if (selectedBundle === bid) {
      setSelectedBundle(null)
      return
    }
    setSelectedBundle(bid)
    const b = bundles.find(x => x.id === bid)
    if (b) {
      b.includedModules.forEach(mid => {
        if (!selectedModules.includes(mid)) toggleModule(mid)
      })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>
        Select individual modules or pick a bundle below.
      </p>

      {/* Module rows */}
      {availableModules.map(mp => {
        const mod = modules.find(m => m.id === mp.moduleId)
        const selected = selectedModules.includes(mp.moduleId)
        return (
          <div key={mp.moduleId}>
            <div
              onClick={() => toggleModule(mp.moduleId)}
              style={{
                padding: '14px 18px',
                borderRadius: 16,
                cursor: 'pointer',
                transition: 'all 200ms',
                borderLeft: selected ? `3px solid ${mod?.color ?? 'var(--accent)'}` : '3px solid transparent',
                background: selected
                  ? `color-mix(in srgb, ${mod?.color ?? '#8b5cf6'} 8%, var(--bg-surface))`
                  : 'var(--bg-surface)',
                boxShadow: 'var(--neu-raised)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              } as React.CSSProperties}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: mod?.color ?? 'var(--text-mute)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{mp.moduleName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 2 }}>{mod?.tagline}</div>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: selected ? mod?.color ?? 'var(--accent)' : 'var(--text-dim)', flexShrink: 0, marginLeft: 16 }}>
                {mp.moduleId === 'staax'
                  ? `₹${(staaxPlan === 'lite' ? 1000 : 4000).toLocaleString('en-IN')}/mo`
                  : `₹${mp.price!.toLocaleString('en-IN')}/mo`}
              </div>
            </div>

            {/* STAAX plan inline expansion */}
            {mp.moduleId === 'staax' && selected && (
              <div style={{ display: 'flex', gap: 8, marginTop: 6, marginLeft: 20, marginBottom: 4 }}>
                {STAAX_PLANS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setStaaxPlan(p.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-pill)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      background: staaxPlan === p.id ? 'var(--accent)' : 'var(--bg)',
                      color: staaxPlan === p.id ? 'white' : 'var(--text-dim)',
                      boxShadow: staaxPlan === p.id ? '0 0 12px rgba(139,92,246,0.4)' : 'var(--neu-raised-sm)',
                      transition: 'all 200ms',
                    }}
                  >
                    {p.label} — ₹{p.price.toLocaleString('en-IN')}/mo ({p.desc})
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Bundles */}
      <div style={{ marginTop: 24, marginBottom: 4 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: 12 }}>
          Or choose a bundle
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {bundles.map(b => {
            const sel = selectedBundle === b.id
            return (
              <div
                key={b.id}
                onClick={() => selectBundle(b.id)}
                style={{
                  padding: '16px 18px',
                  background: 'var(--bg-surface)',
                  borderRadius: 16,
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  boxShadow: sel ? '0 0 0 1.5px var(--accent), var(--neu-raised)' : 'var(--neu-raised)',
                  position: 'relative',
                }}
              >
                {b.featured && (
                  <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                    Popular
                  </div>
                )}
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-mute)', marginBottom: 10 }}>{b.tagline}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: sel ? 'var(--accent)' : 'var(--text)' }}>
                  ₹{b.price.toLocaleString('en-IN')}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-mute)' }}>/mo</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Continue button (shown when nothing selected — always shown) */}
      {selectedModules.length === 0 && !selectedBundle && (
        <p style={{ fontSize: 12, color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', marginTop: 8 }}>
          Select at least one module or bundle to continue.
        </p>
      )}

      <button
        onClick={onContinue}
        disabled={selectedModules.length === 0 && !selectedBundle}
        style={{
          marginTop: 16,
          height: 46,
          padding: '0 28px',
          borderRadius: 'var(--radius-pill)',
          border: 'none',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--accent)',
          background: 'var(--bg)',
          boxShadow: 'var(--neu-raised)',
          alignSelf: 'flex-start',
          transition: 'all 200ms',
          opacity: (selectedModules.length === 0 && !selectedBundle) ? 0.4 : 1,
        }}
      >
        Continue →
      </button>
    </div>
  )
}

// ─── Step 2: Sign Up ──────────────────────────────────────────────────────────

interface Step2Props {
  email: string
  setEmail: (v: string) => void
  onContinue: () => void
}

function Step2({ email, setEmail, onContinue }: Step2Props) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: 'none',
    background: '#1a1d25',
    color: 'var(--text)',
    fontSize: 15,
    boxShadow: 'inset -4px -4px 8px rgba(255,255,255,0.03), inset 4px 4px 8px rgba(0,0,0,0.5)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const canContinue = name.trim() && email.trim() && password.length >= 8 && password === confirm

  return (
    <div style={{ maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input style={inputStyle} placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
      <input style={inputStyle} placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input style={inputStyle} placeholder="Password (min 8 chars)" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <input style={inputStyle} placeholder="Confirm password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
      {confirm && password !== confirm && (
        <p style={{ margin: 0, fontSize: 12, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>Passwords don't match.</p>
      )}
      <button
        onClick={onContinue}
        disabled={!canContinue}
        style={{
          marginTop: 8,
          height: 46,
          padding: '0 28px',
          borderRadius: 'var(--radius-pill)',
          border: 'none',
          cursor: canContinue ? 'pointer' : 'not-allowed',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--accent)',
          background: 'var(--bg)',
          boxShadow: 'var(--neu-raised)',
          alignSelf: 'flex-start',
          opacity: canContinue ? 1 : 0.4,
          transition: 'all 200ms',
        }}
      >
        Continue →
      </button>
    </div>
  )
}

// ─── Step 3: Verify ───────────────────────────────────────────────────────────

interface Step3Props {
  email: string
  onContinue: () => void
}

function Step3({ email, onContinue }: Step3Props) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  function handleChange(i: number, val: string) {
    if (val.length > 1) {
      // paste support
      const digits = val.replace(/\D/g, '').slice(0, 6)
      const next = [...otp]
      for (let j = 0; j < digits.length; j++) next[i + j < 6 ? i + j : 5] = digits[j]
      setOtp(next)
      inputRefs.current[Math.min(i + digits.length, 5)]?.focus()
      return
    }
    const next = [...otp]
    next[i] = val.replace(/\D/g, '')
    setOtp(next)
    if (val && i < 5) inputRefs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const boxStyle: React.CSSProperties = {
    width: 40, height: 48,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    borderRadius: 12,
    border: 'none',
    background: '#1a1d25',
    color: 'var(--text)',
    boxShadow: 'inset -4px -4px 8px rgba(255,255,255,0.03), inset 4px 4px 8px rgba(0,0,0,0.5)',
    outline: 'none',
  }

  const filled = otp.every(d => d !== '')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
      <div>
        <p style={{ margin: 0, fontSize: 16, color: 'var(--text)' }}>Check your inbox</p>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>{email || 'your email'}</p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {otp.map((d, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el }}
            style={boxStyle}
            value={d}
            maxLength={6}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            inputMode="numeric"
          />
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>
        {canResend
          ? <button onClick={() => { setCountdown(30); setCanResend(false) }} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, padding: 0 }}>Resend code</button>
          : `Resend in ${countdown}s`}
      </div>
      <button
        onClick={onContinue}
        disabled={!filled}
        style={{
          height: 46, padding: '0 28px',
          borderRadius: 'var(--radius-pill)', border: 'none',
          cursor: filled ? 'pointer' : 'not-allowed',
          fontSize: 14, fontWeight: 600,
          color: 'var(--accent)', background: 'var(--bg)',
          boxShadow: 'var(--neu-raised)',
          opacity: filled ? 1 : 0.4,
          transition: 'all 200ms',
        }}
      >
        Verify →
      </button>
    </div>
  )
}

// ─── Step 4: Review ───────────────────────────────────────────────────────────

interface Step4Props {
  selectedModules: string[]
  selectedBundle: string | null
  staaxPlan: StaaxPlan
  selectedAddons: string[]
  toggleAddon: (id: string) => void
  total: number
  onContinue: () => void
}

function Step4({ selectedModules, selectedBundle, staaxPlan, selectedAddons, toggleAddon, total, onContinue }: Step4Props) {
  const addonDefs = [
    { id: 'ai',     label: 'AI Layer',      delta: '+₹300' },
    { id: 'mobile', label: 'Mobile App',    delta: '+₹200' },
    { id: 'byok',   label: 'BYOK discount', delta: '−₹100' },
  ]

  const displayModules = selectedBundle
    ? (bundles.find(b => b.id === selectedBundle)?.includedModules ?? [])
    : selectedModules

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
      {/* Selected modules */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {displayModules.map(mid => {
          const mod = modules.find(m => m.id === mid)
          const mp  = modulePrices.find(m => m.moduleId === mid)
          const price = mid === 'staax' ? (staaxPlan === 'lite' ? 1000 : 4000) : mp?.price ?? 0
          return (
            <div key={mid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-surface)', borderRadius: 14, boxShadow: 'var(--neu-raised)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: mod?.color ?? 'var(--accent)' }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{mod?.name ?? mid.toUpperCase()}</span>
                {mid === 'staax' && <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-mute)' }}>({staaxPlan === 'lite' ? '10 algos' : '30 algos'})</span>}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-dim)' }}>₹{price.toLocaleString('en-IN')}/mo</span>
            </div>
          )
        })}
      </div>

      {/* Add-on chips */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: 10 }}>Add-ons</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {addonDefs.map(a => {
            const active = selectedAddons.includes(a.id)
            return (
              <button
                key={a.id}
                onClick={() => toggleAddon(a.id)}
                style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600,
                  background: active ? 'var(--accent)' : 'var(--bg)',
                  color: active ? 'white' : 'var(--text-dim)',
                  boxShadow: active ? '0 0 12px rgba(139,92,246,0.4)' : 'var(--neu-raised-sm)',
                  transition: 'all 200ms',
                }}
              >
                {a.label} <span style={{ opacity: 0.7 }}>{a.delta}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Total */}
      <div style={{ padding: '20px 24px', background: 'var(--bg-surface)', borderRadius: 16, boxShadow: 'var(--neu-inset)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-mute)' }}>Total / month</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>₹{total.toLocaleString('en-IN')}</span>
      </div>

      <button
        onClick={onContinue}
        style={{
          height: 46, padding: '0 28px', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer',
          fontSize: 14, fontWeight: 600, color: 'var(--accent)', background: 'var(--bg)',
          boxShadow: 'var(--neu-raised)', alignSelf: 'flex-start', transition: 'all 200ms',
        }}
      >
        Confirm →
      </button>
    </div>
  )
}

// ─── Step 5: Payment ──────────────────────────────────────────────────────────

interface Step5Props {
  total: number
  selectedModules: string[]
  selectedBundle: string | null
  onContinue: () => void
}

function Step5({ total, selectedModules, selectedBundle, onContinue }: Step5Props) {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: 'none',
    background: '#1a1d25',
    color: 'var(--text)',
    fontSize: 15,
    boxShadow: 'inset -4px -4px 8px rgba(255,255,255,0.03), inset 4px 4px 8px rgba(0,0,0,0.5)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Order summary */}
      <div style={{ padding: '20px 24px', background: 'var(--bg-surface)', borderRadius: 16, boxShadow: 'var(--neu-raised)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: 12 }}>Order Summary</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 14, color: 'var(--text-dim)' }}>
            {selectedBundle
              ? bundles.find(b => b.id === selectedBundle)?.name
              : `${selectedModules.length} module${selectedModules.length !== 1 ? 's' : ''}`}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>₹{total.toLocaleString('en-IN')}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-mute)' }}>/mo</span></span>
        </div>
        <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>3-day free trial · cancel anytime</p>
      </div>

      {/* Card form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input style={inputStyle} placeholder="Cardholder name" />
        <input style={inputStyle} placeholder="Card number" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <input style={inputStyle} placeholder="MM / YY" />
          <input style={inputStyle} placeholder="CVV" />
        </div>
      </div>

      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>
        Razorpay integration coming soon. Your card will not be charged.
      </p>

      <button
        onClick={onContinue}
        style={{
          height: 46, padding: '0 28px', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer',
          fontSize: 14, fontWeight: 600, color: 'white', background: 'var(--accent)',
          boxShadow: '0 0 20px rgba(139,92,246,0.4)', alignSelf: 'flex-start', transition: 'all 200ms',
        }}
      >
        Subscribe Now →
      </button>
    </div>
  )
}

// ─── Step 6: Welcome ──────────────────────────────────────────────────────────

interface Step6Props {
  selectedModules: string[]
  selectedBundle: string | null
}

function Step6({ selectedModules, selectedBundle }: Step6Props) {
  const navigate = useNavigate()
  const displayModules = selectedBundle
    ? (bundles.find(b => b.id === selectedBundle)?.includedModules ?? [])
    : selectedModules

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 28 }}>
      {/* Check circle */}
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'var(--bg-surface)',
        boxShadow: '0 0 40px rgba(139,92,246,0.6), var(--neu-raised)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32,
      }}>
        ✓
      </div>
      <div>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>
          You're in.
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: 16, color: 'var(--text-mute)' }}>Your LIFEX OS is ready.</p>
      </div>

      {/* Module list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {displayModules.map(mid => {
          const mod = modules.find(m => m.id === mid)
          return (
            <div key={mid} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-dim)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: mod?.color ?? 'var(--accent)', flexShrink: 0 }} />
              {mod?.name ?? mid.toUpperCase()} — {mod?.tagline}
            </div>
          )
        })}
      </div>

      <button
        onClick={() => navigate('/')}
        style={{
          height: 52, padding: '0 36px', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer',
          fontSize: 15, fontWeight: 700, color: 'white', background: 'var(--accent)',
          boxShadow: '0 0 30px rgba(139,92,246,0.5)', transition: 'all 200ms',
        }}
      >
        Open LIFEX OS →
      </button>
    </div>
  )
}

// ─── Mobile Dot Stepper ───────────────────────────────────────────────────────

function MobileStepper({ stepStates }: { stepStates: StepState[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', padding: '12px 0' }}>
      {stepStates.map((s, i) => (
        <div
          key={i}
          style={{
            width: s === 'active' ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: s === 'completed' ? 'var(--accent)' : s === 'active' ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
            transition: 'all 300ms ease',
          }}
        />
      ))}
    </div>
  )
}

// ─── Step Section Wrapper ─────────────────────────────────────────────────────

interface StepSectionProps {
  stepNum: number
  title: string
  state: StepState
  goToStep: (idx: number) => void
  children: React.ReactNode
}

function StepSection({ stepNum, title, state, goToStep, children }: StepSectionProps) {
  const isActive    = state === 'active'
  const isCompleted = state === 'completed'

  return (
    <section
      id={`step-${stepNum}`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 0 40px',
      }}
    >
      {/* Header */}
      <div
        onClick={() => isCompleted ? goToStep(stepNum - 1) : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: isActive ? 28 : 0,
          cursor: isCompleted ? 'pointer' : 'default',
          opacity: state === 'upcoming' ? 0.4 : 1,
          transition: 'opacity 300ms ease',
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isCompleted ? 'var(--accent)' : isActive ? 'var(--bg-elevated)' : 'var(--bg-surface)',
          boxShadow: isActive ? 'var(--neu-raised)' : 'none',
          fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)',
          color: isCompleted ? 'white' : isActive ? 'var(--accent)' : 'var(--text-mute)',
          flexShrink: 0,
        }}>
          {isCompleted ? '✓' : stepNum}
        </div>
        <h2 style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontSize: isActive ? 'clamp(28px, 3.5vw, 42px)' : 20,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: isActive ? 'var(--text)' : isCompleted ? 'var(--accent)' : 'var(--text-mute)',
          transition: 'font-size 400ms ease, color 300ms ease',
        }}>
          {title}
        </h2>
      </div>

      {/* Body */}
      <div style={{
        maxHeight: isActive ? 900 : 0,
        opacity: isActive ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 600ms ease, opacity 500ms ease',
      }}>
        {children}
      </div>
    </section>
  )
}

// ─── Main StartPage ───────────────────────────────────────────────────────────

export default function StartPage() {
  // Pipe / animation state
  const [nodeYs, setNodeYs]         = useState<number[]>([])
  const [pipePath, setPipePath]     = useState('')
  const [totalH, setTotalH]         = useState(0)

  // Step state
  const [currentStep, setCurrentStep] = useState(0)
  const [stepStates, setStepStates]   = useState<StepState[]>(
    ['active', 'upcoming', 'upcoming', 'upcoming', 'upcoming', 'upcoming']
  )

  // Cart state
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [selectedBundle, setSelectedBundle]   = useState<string | null>(null)
  const [selectedAddons, setSelectedAddons]   = useState<string[]>([])
  const [staaxPlan, setStaaxPlan]             = useState<StaaxPlan>('lite')
  const [email, setEmail]                     = useState('')

  // Refs for animation
  const ballRef      = useRef<SVGCircleElement>(null) as React.RefObject<SVGCircleElement>
  const highlightRef = useRef<SVGCircleElement>(null) as React.RefObject<SVGCircleElement>
  const progressRef  = useRef<SVGPathElement>(null) as React.RefObject<SVGPathElement>
  const pipeRef      = useRef<SVGPathElement>(null) as React.RefObject<SVGPathElement>

  const currentProgressRef = useRef(0)
  const isAnimatingRef     = useRef(false)

  // Compute step fractions after path is known
  const stepFractionsRef = useRef<number[]>([0, 0.2, 0.4, 0.6, 0.8, 1.0])

  // Build pipe on mount and resize
  useEffect(() => {
    function build() {
      const h = window.innerHeight
      const ys = NODE_VH.map(f => f * h)
      const path = buildPipePath(ys, h)
      setNodeYs(ys)
      setPipePath(path)
      setTotalH(h)
    }
    build()
    window.addEventListener('resize', build)
    return () => window.removeEventListener('resize', build)
  }, [])

  // After path renders, set up total length and initialize ball + progress
  useEffect(() => {
    if (!pipeRef.current || !pipePath) return
    const len = pipeRef.current.getTotalLength()
    if (!len) return

    // Place ball at step 0
    const pt = pipeRef.current.getPointAtLength(0)
    if (ballRef.current) {
      ballRef.current.setAttribute('cx', String(pt.x))
      ballRef.current.setAttribute('cy', String(pt.y))
    }
    if (highlightRef.current) {
      highlightRef.current.setAttribute('cx', String(pt.x - 3))
      highlightRef.current.setAttribute('cy', String(pt.y - 3))
    }

    // Init progress to empty
    if (progressRef.current) {
      progressRef.current.style.strokeDasharray = String(len)
      progressRef.current.style.strokeDashoffset = String(len)
    }

    // Compute actual step fractions from node positions
    // Each node sits on the path — approximate by finding nearest point length
    const fractions: number[] = nodeYs.map((_, i) => i / (NODE_VH.length - 1))
    stepFractionsRef.current = fractions
  }, [pipePath, nodeYs])

  const moveBallTo = useCallback((targetFraction: number, onComplete?: () => void) => {
    if (isAnimatingRef.current) return
    if (!pipeRef.current) { onComplete?.(); return }
    const path: SVGPathElement = pipeRef.current

    isAnimatingRef.current = true
    const totalLength = path.getTotalLength()
    const startFraction = currentProgressRef.current
    const duration = 2200
    const startTime = performance.now()
    let rotation = 0
    const goingDown = targetFraction > startFraction

    function frame(now: number) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      const fraction = startFraction + (targetFraction - startFraction) * eased
      const dist = fraction * totalLength
      const pt = path.getPointAtLength(dist)

      if (ballRef.current) {
        ballRef.current.setAttribute('cx', String(pt.x))
        ballRef.current.setAttribute('cy', String(pt.y))
        rotation += goingDown ? 6 : -6
        ballRef.current.setAttribute('transform', `rotate(${rotation}, ${pt.x}, ${pt.y})`)
      }
      if (highlightRef.current) {
        highlightRef.current.setAttribute('cx', String(pt.x - 3))
        highlightRef.current.setAttribute('cy', String(pt.y - 3))
      }
      if (progressRef.current) {
        progressRef.current.style.strokeDashoffset = String(totalLength - fraction * totalLength)
      }

      if (t < 1) {
        requestAnimationFrame(frame)
      } else {
        currentProgressRef.current = targetFraction
        isAnimatingRef.current = false
        onComplete?.()
      }
    }
    requestAnimationFrame(frame)
  }, [])

  function goToNextStep() {
    const next = currentStep + 1
    if (next > 5) return
    const targetFraction = stepFractionsRef.current[next]
    moveBallTo(targetFraction, () => {
      setStepStates(prev => {
        const s = [...prev]
        s[currentStep] = 'completed'
        s[next] = 'active'
        return s
      })
      setCurrentStep(next)
      document.getElementById(`step-${next + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function goToStep(targetIdx: number) {
    if (targetIdx >= currentStep || isAnimatingRef.current) return
    const targetFraction = stepFractionsRef.current[targetIdx]
    moveBallTo(targetFraction, () => {
      setStepStates(prev => {
        const s = [...prev]
        for (let i = targetIdx + 1; i <= currentStep; i++) s[i] = 'upcoming'
        s[targetIdx] = 'active'
        return s
      })
      setCurrentStep(targetIdx)
      document.getElementById(`step-${targetIdx + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  // Cart helpers
  function toggleModule(id: string) {
    setSelectedModules(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
    setSelectedBundle(null)
  }

  function toggleAddon(id: string) {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Total calculation
  const total = (() => {
    if (selectedBundle) {
      const b = bundles.find(x => x.id === selectedBundle)
      if (!b) return 0
      let t = b.price
      selectedAddons.forEach(aid => {
        if (!b.includedAddons.includes(aid)) {
          const a = addons.find(x => x.id === aid)
          if (a) t += a.priceDelta
        }
      })
      return t
    }
    let t = selectedModules.reduce((sum, mid) => {
      if (mid === 'staax') return sum + (staaxPlan === 'lite' ? 1000 : 4000)
      const mp = modulePrices.find(m => m.moduleId === mid)
      return sum + (mp?.price ?? 0)
    }, 0)
    selectedAddons.forEach(aid => {
      const a = addons.find(x => x.id === aid)
      if (a) t += a.priceDelta
    })
    return Math.max(0, t)
  })()

  const showStickyBar = (selectedModules.length > 0 || selectedBundle !== null) && currentStep === 0

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative' }}>

      {/* ── Top Nav ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 56, zIndex: 100,
        background: 'var(--bg)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
      }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          LIFEX OS
        </Link>
        <Link to="/login" style={{ fontSize: 13, color: 'var(--text-mute)' }}>
          Already a member? <span style={{ color: 'var(--accent)' }}>Sign in</span>
        </Link>
      </header>

      {/* ── Mobile dot stepper ── */}
      <div className="start-mobile-stepper" style={{ display: 'none', position: 'fixed', top: 56, left: 0, right: 0, zIndex: 99, background: 'var(--bg)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '8px 0' }}>
        <MobileStepper stepStates={stepStates} />
      </div>

      {/* ── Left pipe (desktop) ── */}
      <div
        className="start-pipe"
        style={{
          position: 'fixed', top: 0, left: 48, width: 160, height: '100vh',
          zIndex: 0, overflow: 'visible',
          // sits behind header
        }}
      >
        {pipePath && (
          <StepperSVG
            nodeYs={nodeYs}
            stepStates={stepStates}
            pipePath={pipePath}
            totalH={totalH}
            ballRef={ballRef}
            highlightRef={highlightRef}
            progressRef={progressRef}
            pipeRef={pipeRef}
            goToStep={goToStep}
          />
        )}
      </div>

      {/* ── Right column ── */}
      <main
        className="start-main"
        style={{
          marginLeft: 240,
          padding: '0 80px 200px',
        }}
      >
        <StepSection stepNum={1} title="Choose Plan" state={stepStates[0]} goToStep={goToStep}>
          <Step1
            selectedModules={selectedModules}
            toggleModule={toggleModule}
            selectedBundle={selectedBundle}
            setSelectedBundle={setSelectedBundle}
            staaxPlan={staaxPlan}
            setStaaxPlan={setStaaxPlan}
            onContinue={goToNextStep}
          />
        </StepSection>

        <StepSection stepNum={2} title="Sign Up" state={stepStates[1]} goToStep={goToStep}>
          <Step2 email={email} setEmail={setEmail} onContinue={goToNextStep} />
        </StepSection>

        <StepSection stepNum={3} title="Verify" state={stepStates[2]} goToStep={goToStep}>
          <Step3 email={email} onContinue={goToNextStep} />
        </StepSection>

        <StepSection stepNum={4} title="Review" state={stepStates[3]} goToStep={goToStep}>
          <Step4
            selectedModules={selectedModules}
            selectedBundle={selectedBundle}
            staaxPlan={staaxPlan}
            selectedAddons={selectedAddons}
            toggleAddon={toggleAddon}
            total={total}
            onContinue={goToNextStep}
          />
        </StepSection>

        <StepSection stepNum={5} title="Payment" state={stepStates[4]} goToStep={goToStep}>
          <Step5
            total={total}
            selectedModules={selectedModules}
            selectedBundle={selectedBundle}
            onContinue={goToNextStep}
          />
        </StepSection>

        <StepSection stepNum={6} title="Welcome" state={stepStates[5]} goToStep={goToStep}>
          <Step6 selectedModules={selectedModules} selectedBundle={selectedBundle} />
        </StepSection>
      </main>

      {/* ── Sticky bottom bar (step 1, when selection exists) ── */}
      {showStickyBar && (
        <div
          className="start-sticky-bar"
          style={{
            position: 'fixed', bottom: 0, left: 240, right: 0, zIndex: 50,
            background: 'var(--bg-surface)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '16px 80px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-dim)' }}>
            {selectedBundle
              ? bundles.find(b => b.id === selectedBundle)?.name
              : `${selectedModules.length} module${selectedModules.length !== 1 ? 's' : ''}`
            }
            {' · '}
            <span style={{ color: 'var(--text)', fontWeight: 700 }}>₹{total.toLocaleString('en-IN')}/mo</span>
          </span>
          <button
            onClick={goToNextStep}
            style={{
              height: 40, padding: '0 24px', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: 'var(--accent)', background: 'var(--bg)',
              boxShadow: 'var(--neu-raised)', transition: 'all 200ms',
            }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 768px) {
          .start-pipe { display: none !important; }
          .start-mobile-stepper { display: block !important; }
          .start-main { margin-left: 0 !important; padding: 0 24px 200px !important; }
          .start-sticky-bar { left: 0 !important; padding: 16px 24px !important; }
        }
      `}</style>
    </div>
  )
}
