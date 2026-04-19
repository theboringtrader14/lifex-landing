import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import PricingSection from '../components/PricingSection'

// ─── Types ───────────────────────────────────────────────────────────────────

type StepState = 'upcoming' | 'active' | 'completed'

const STEP_LABELS = ['Choose Plan', 'Sign Up', 'Verify', 'Review', 'Payment', 'Welcome']
const NODE_VH     = [0.14, 0.30, 0.46, 0.62, 0.78, 0.94]

// ─── Pipe path builder ────────────────────────────────────────────────────────

function buildPipePath(nodeYs: number[], totalH: number): string {
  if (!nodeYs.length) return ''
  const cx = 80
  let d = `M ${cx} 0 L ${cx} ${nodeYs[0] - 30}`
  for (let i = 0; i < nodeYs.length; i++) {
    const y = nodeYs[i]
    d += ` C ${cx} ${y - 10}, ${cx} ${y + 10}, ${cx} ${y}`
    if (i < nodeYs.length - 1) {
      const yn  = nodeYs[i + 1]
      const mid = (y + yn) / 2
      d += ` C ${cx} ${y + 20}, ${cx - 20} ${mid}, ${cx} ${yn - 20}`
    }
  }
  d += ` L ${cx} ${totalH}`
  return d
}

// Binary search: find fraction [0,1] of path length where point.y ≈ targetY
function findFractionForY(path: SVGPathElement, targetY: number, totalLen: number): number {
  let lo = 0, hi = 1
  for (let i = 0; i < 52; i++) {
    const mid = (lo + hi) / 2
    const pt  = path.getPointAtLength(mid * totalLen)
    if (pt.y < targetY) lo = mid; else hi = mid
  }
  return (lo + hi) / 2
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: 'none',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontSize: 14,
  boxShadow: 'var(--neu-inset)',
  outline: 'none',
  boxSizing: 'border-box' as const,
  transition: 'box-shadow 0.2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'var(--text-dim)',
  marginBottom: 8,
}

function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...props}
      style={{
        ...inputStyle,
        boxShadow: focused
          ? 'var(--neu-inset), 0 0 0 1.5px rgba(139,92,246,0.35)'
          : inputStyle.boxShadow as string,
        ...props.style,
      }}
      onFocus={e => { setFocused(true); props.onFocus?.(e) }}
      onBlur={e => { setFocused(false); props.onBlur?.(e) }}
    />
  )
}

function BtnPrimary({ children, onClick, disabled, full }: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  full?: boolean
}) {
  const base  = 'var(--neu-raised), 0 0 32px rgba(139,92,246,0.25)'
  const hover = 'var(--neu-raised), 0 0 48px rgba(139,92,246,0.45)'
  const press = 'var(--neu-pressed)'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '14px 32px',
        borderRadius: 100,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 15,
        fontWeight: 600,
        fontFamily: 'var(--font-body)',
        color: disabled ? 'var(--text-mute)' : 'var(--accent)',
        background: 'var(--bg)',
        boxShadow: disabled ? 'var(--neu-inset)' : base,
        width: full ? '100%' : undefined,
        transition: 'transform 0.15s, box-shadow 0.2s',
        opacity: disabled ? 0.55 : 1,
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = hover
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = disabled ? 'var(--neu-inset)' : base
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.boxShadow = press }}
      onMouseUp={e => { if (!disabled) e.currentTarget.style.boxShadow = hover }}
    >
      {children}
    </button>
  )
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
  ballRef, highlightRef, progressRef, pipeRef, goToStep,
}: StepperProps) {
  if (!pipePath) return null
  return (
    <svg width="160" height={totalH} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#c4b5fd" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="ballGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.75)" />
          <stop offset="25%"  stopColor="rgba(210,210,225,0.95)" />
          <stop offset="65%"  stopColor="rgba(130,130,150,1)" />
          <stop offset="100%" stopColor="rgba(55,55,75,1)" />
        </radialGradient>
        <filter id="ballShadow" x="-100%" y="-100%" width="300%" height="300%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.7)" />
        </filter>
        <filter id="fluidGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(139,92,246,0.5)" />
        </filter>
      </defs>

      {/* ── 4-layer neumorphic pipe groove ── */}
      <path d={pipePath} style={{ stroke: 'var(--pipe-groove-1)' }}        strokeWidth="22" fill="none" />
      <path d={pipePath} style={{ stroke: 'var(--pipe-groove-2)' }}        strokeWidth="18" fill="none" />
      <path d={pipePath} style={{ stroke: 'var(--pipe-groove-highlight)' }} strokeWidth="16" fill="none" />
      <path d={pipePath} style={{ stroke: 'var(--bg)' }}                   strokeWidth="12" fill="none" />

      {/* ── Purple fluid progress ── */}
      <path
        ref={progressRef}
        d={pipePath}
        stroke="url(#purpleGrad)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        filter="url(#fluidGlow)"
      />

      {/* ── Invisible path for getTotalLength / getPointAtLength ── */}
      <path ref={pipeRef} d={pipePath} stroke="transparent" strokeWidth="1" fill="none" />

      {/* ── Step nodes ── */}
      {nodeYs.map((y, i) => {
        const state = stepStates[i]
        const label = STEP_LABELS[i]
        const isCompleted = state === 'completed'
        const isActive    = state === 'active'
        return (
          <g
            key={i}
            onClick={() => isCompleted ? goToStep(i) : undefined}
            style={{ cursor: isCompleted ? 'pointer' : 'default' }}
          >
            {/* Pulse ring — active only */}
            {isActive && (
              <circle cx="80" cy={y} r="14" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.5">
                <animate attributeName="r"       values="16;24;16" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Node circle */}
            {isCompleted && (
              <circle cx="80" cy={y} r="14" fill="#8b5cf6" stroke="rgba(139,92,246,0.4)" strokeWidth="2" filter="url(#nodeGlow)" />
            )}
            {isActive && (
              <circle cx="80" cy={y} r="14" fill="#0a0a0f" stroke="#8b5cf6" strokeWidth="2.5" />
            )}
            {state === 'upcoming' && (
              <circle cx="80" cy={y} r="14" style={{ fill: 'var(--bg-surface)' }} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            )}

            {/* Number / checkmark */}
            <text
              x="80" y={y + 5}
              textAnchor="middle"
              fill={isCompleted ? '#fff' : isActive ? '#fff' : 'rgba(229,231,235,0.35)'}
              fontSize="12"
              fontWeight={isActive ? '600' : '400'}
              fontFamily="JetBrains Mono, monospace"
            >
              {isCompleted ? '✓' : i + 1}
            </text>

            {/* Label */}
            <text
              x="102" y={isActive ? y : y + 5}
              fontSize="11"
              fontFamily="JetBrains Mono, monospace"
              fontWeight={isActive ? '600' : '400'}
              fill={isCompleted ? '#8b5cf6' : isActive ? '#e5e7eb' : 'rgba(229,231,235,0.35)'}
            >
              {label}
            </text>
            {/* "X of 6" sub-label — active node only */}
            {isActive && (
              <text
                x="102" y={y + 15}
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="400"
                fill="rgba(139,92,246,0.7)"
                letterSpacing="0.08em"
              >
                {i + 1} of 6
              </text>
            )}
          </g>
        )
      })}

      {/* ── Steel ball ── */}
      <circle
        ref={ballRef}
        cx="80" cy={nodeYs[0] ?? 0}
        r="10"
        fill="url(#ballGrad)"
        filter="url(#ballShadow)"
      />
      {/* Specular highlight */}
      <circle
        ref={highlightRef}
        cx={80 - 3} cy={(nodeYs[0] ?? 0) - 4}
        r="4"
        fill="rgba(255,255,255,0.6)"
        style={{ pointerEvents: 'none' }}
      />
    </svg>
  )
}

// ─── Step 1: Choose Plan ──────────────────────────────────────────────────────

function Step1({ onContinue }: { onContinue: () => void }) {
  return (
    <div>
      {/* Reuse the landing page PricingSection — header hidden, toggle shown */}
      <PricingSection compact />
      <div style={{ padding: '0 var(--space-8) var(--space-8)', display: 'flex', justifyContent: 'flex-end' }}>
        <BtnPrimary onClick={onContinue}>Continue →</BtnPrimary>
      </div>
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
  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const mismatch  = confirm.length > 0 && password !== confirm
  const canSubmit = email.trim() && password.length >= 8 && password === confirm

  return (
    <div style={{ maxWidth: 480 }}>
      <p style={{ fontSize: 15, color: 'var(--text-dim)', marginBottom: 32 }}>Create your LIFEX OS account</p>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Email address</label>
        <FormInput type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Password</label>
        <FormInput type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div style={{ marginBottom: 32 }}>
        <label style={labelStyle}>Confirm password</label>
        <FormInput type="password" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} />
        {mismatch && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>Passwords don't match.</p>}
      </div>

      <BtnPrimary onClick={onContinue} disabled={!canSubmit}>
        Continue →
      </BtnPrimary>
      <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text-mute)' }}>
        Already have an account? <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>Sign in →</span>
      </p>
    </div>
  )
}

// ─── Step 3: Verify ───────────────────────────────────────────────────────────

interface Step3Props {
  email: string
  onContinue: () => void
}

function Step3({ email, onContinue }: Step3Props) {
  const [otp, setOtp]           = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const boxRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  function handleChange(i: number, val: string) {
    if (val.length > 1) {
      const digits = val.replace(/\D/g, '').slice(0, 6)
      const next = [...otp]
      for (let j = 0; j < digits.length; j++) {
        const pos = i + j < 6 ? i + j : 5
        next[pos] = digits[j]
      }
      setOtp(next)
      boxRefs.current[Math.min(i + digits.length, 5)]?.focus()
      return
    }
    const next = [...otp]
    next[i] = val.replace(/\D/g, '')
    setOtp(next)
    if (val && i < 5) boxRefs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) boxRefs.current[i - 1]?.focus()
  }

  const filled = otp.every(d => d !== '')

  const otpBoxStyle: React.CSSProperties = {
    width: 44, height: 54, textAlign: 'center',
    fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-mono)',
    borderRadius: 12, border: 'none',
    background: 'var(--bg)', color: 'var(--text)',
    boxShadow: 'var(--neu-inset)',
    outline: 'none', caretColor: 'var(--accent)',
    boxSizing: 'border-box' as const,
  }

  return (
    <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 0 }}>
      <p style={{ fontSize: 15, color: 'var(--text-dim)', marginBottom: 16 }}>
        Check your inbox — we sent a code to
      </p>
      <div style={{
        display: 'inline-block', marginBottom: 24,
        fontFamily: 'var(--font-mono)', fontSize: 13,
        color: 'var(--accent)', padding: '10px 16px',
        background: 'rgba(139,92,246,0.08)', borderRadius: 8,
      }}>
        {email || 'your@email.com'}
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-mute)', marginBottom: 20 }}>
        Enter the 6-digit code below
      </p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {otp.map((d, i) => (
          <input
            key={i}
            ref={el => { boxRefs.current[i] = el }}
            style={otpBoxStyle}
            value={d}
            maxLength={6}
            inputMode="numeric"
            pattern="[0-9]"
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onFocus={e => { e.currentTarget.style.boxShadow = 'var(--neu-inset), 0 0 0 1.5px rgba(139,92,246,0.35)' }}
            onBlur={e => { e.currentTarget.style.boxShadow = 'var(--neu-inset)' }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => { if (canResend) { setCountdown(30); setCanResend(false) } }}
          style={{
            fontSize: 13, background: 'none', border: 'none',
            color: canResend ? 'var(--accent)' : 'var(--text-mute)',
            cursor: canResend ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-body)',
            textDecoration: canResend ? 'underline' : 'none',
          }}
        >
          Resend code
        </button>
        {!canResend && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mute)' }}>
            in {countdown}s
          </span>
        )}
      </div>

      <BtnPrimary onClick={onContinue} disabled={!filled}>
        Verify →
      </BtnPrimary>
    </div>
  )
}

// ─── Step 4: Review ───────────────────────────────────────────────────────────

function Step4({ email, goToStep, onContinue }: { email: string; goToStep: (i: number) => void; onContinue: () => void }) {
  return (
    <div style={{ maxWidth: 480 }}>
      <p style={{ fontSize: 15, color: 'var(--text-dim)', marginBottom: 24 }}>Review your account details</p>

      <div style={{ background: 'var(--bg)', boxShadow: 'var(--neu-raised)', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: 16 }}>Account</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <span style={{ color: 'var(--text-dim)' }}>Email</span>
          <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{email || '—'}</span>
        </div>
        <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '14px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <span style={{ color: 'var(--text-dim)' }}>Trial period</span>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>3 days free</span>
        </div>
        <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '14px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <span style={{ color: 'var(--text-dim)' }}>Billing</span>
          <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>Monthly via Razorpay</span>
        </div>
      </div>

      <span
        onClick={() => goToStep(0)}
        style={{ fontSize: 13, color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', display: 'inline-block', marginBottom: 24 }}
      >
        ← Review pricing
      </span>
      <br />
      <BtnPrimary onClick={onContinue}>Confirm →</BtnPrimary>
    </div>
  )
}

// ─── Step 5: Payment ──────────────────────────────────────────────────────────

function Step5({ onContinue }: { onContinue: () => void }) {
  return (
    <div style={{ maxWidth: 480 }}>
      <p style={{ fontSize: 15, color: 'var(--text-dim)', marginBottom: 24 }}>Start your 3-day free trial — no charge today</p>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Card number</label>
        <FormInput type="text" placeholder="1234 5678 9012 3456" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Expiry</label>
          <FormInput type="text" placeholder="MM / YY" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>CVV</label>
          <FormInput type="text" placeholder="•••" />
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <label style={labelStyle}>Name on card</label>
        <FormInput type="text" placeholder="As printed on card" />
      </div>

      <BtnPrimary onClick={onContinue} full>Start free trial →</BtnPrimary>
      <p style={{ fontSize: 12, color: 'var(--text-mute)', textAlign: 'center', marginTop: 16 }}>
        Powered by Razorpay — integration coming soon
      </p>
    </div>
  )
}

// ─── Step 6: Welcome ──────────────────────────────────────────────────────────

function Step6() {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 0' }}>
      <div style={{
        width: 88, height: 88, borderRadius: '50%',
        background: 'var(--bg-surface)',
        border: '2px solid rgba(139,92,246,0.5)',
        boxShadow: 'var(--neu-raised), 0 0 40px rgba(139,92,246,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, color: 'var(--accent)',
        animation: 'successPulse 2s ease-in-out infinite',
        marginBottom: 32,
      }}>
        ✓
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12, color: 'var(--text)' }}>
        You're in.
      </h1>
      <p style={{ fontSize: 16, color: 'var(--text-dim)', marginBottom: 40 }}>Your LIFEX OS is ready. Check your email to get started.</p>

      <button
        onClick={() => navigate('/')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '14px 36px', borderRadius: 100, border: 'none', cursor: 'pointer',
          fontSize: 15, fontWeight: 600, color: '#fff', background: 'var(--accent)',
          boxShadow: 'var(--neu-raised-sm)',
          transition: 'transform 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
      >
        Back to home →
      </button>
      <p style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 16 }}>
        You'll receive a confirmation email shortly.
      </p>

      <style>{`
        @keyframes successPulse {
          0%, 100% { box-shadow: var(--neu-raised), 0 0 24px rgba(139,92,246,0.35); }
          50%       { box-shadow: var(--neu-raised), 0 0 48px rgba(139,92,246,0.55); }
        }
      `}</style>
    </div>
  )
}

// ─── Mobile Dot Stepper ───────────────────────────────────────────────────────

function MobileStepper({ stepStates }: { stepStates: StepState[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', padding: '12px 24px' }}>
      {stepStates.map((s, i) => (
        <div key={i} style={{
          width: s === 'active' ? 24 : 10, height: 10, borderRadius: 5,
          background: s === 'completed' ? 'var(--accent)' : s === 'active' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
          boxShadow: s === 'active' ? '0 0 8px rgba(139,92,246,0.6)' : 'none',
          transition: 'all 0.3s',
        }} />
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
  noCard?: boolean
}

function StepSection({ stepNum, title, state, goToStep, children, noCard }: StepSectionProps) {
  const isActive    = state === 'active'
  const isCompleted = state === 'completed'

  return (
    <section
      id={`step-${stepNum}`}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 0' }}
    >
      <div style={noCard ? {
        opacity: state === 'upcoming' ? 0.5 : 1,
        transition: 'opacity 0.3s',
      } : {
        background: 'var(--bg-surface)',
        borderRadius: 20,
        boxShadow: isActive ? 'var(--neu-raised)' : 'var(--neu-raised-sm)',
        padding: 32,
        marginBottom: 24,
        opacity: state === 'upcoming' ? 0.5 : 1,
        transition: 'box-shadow 0.3s, opacity 0.3s',
      }}>
        {/* Title */}
        <div
          onClick={() => isCompleted ? goToStep(stepNum - 1) : undefined}
          style={{ cursor: isCompleted ? 'pointer' : 'default', marginBottom: 12 }}
        >
          <h2 style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: isActive ? 'clamp(24px, 3vw, 36px)' : 20,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: isActive ? 'var(--text)' : isCompleted ? 'var(--text-dim)' : 'var(--text-mute)',
            transition: 'font-size 400ms ease, color 300ms ease',
          }}>
            {isCompleted && <span style={{ color: 'var(--accent)', marginRight: 8 }}>✓</span>}
            {title}
          </h2>
        </div>

        {/* Step body */}
        <div style={{
          maxHeight: isActive ? 2000 : 0,
          opacity: isActive ? 1 : 0,
          overflow: isActive ? 'visible' : 'hidden',
          transform: isActive ? 'translateY(0)' : 'translateY(20px)',
          transition: 'max-height 600ms ease, opacity 500ms ease 400ms, transform 500ms ease 400ms',
        }}>
          <div style={{ paddingTop: 24 }}>{children}</div>
        </div>
      </div>
    </section>
  )
}

// ─── Main StartPage ───────────────────────────────────────────────────────────

export default function StartPage() {
  const [nodeYs, setNodeYs]     = useState<number[]>([])
  const [pipePath, setPipePath] = useState('')
  const [totalH, setTotalH]     = useState(0)

  const [currentStep, setCurrentStep] = useState(0)
  const [stepStates, setStepStates]   = useState<StepState[]>(
    ['active', 'upcoming', 'upcoming', 'upcoming', 'upcoming', 'upcoming']
  )

  const [email, setEmail] = useState('')

  // Refs
  const ballRef      = useRef<SVGCircleElement>(null) as React.RefObject<SVGCircleElement>
  const highlightRef = useRef<SVGCircleElement>(null) as React.RefObject<SVGCircleElement>
  const progressRef  = useRef<SVGPathElement>(null)   as React.RefObject<SVGPathElement>
  const pipeRef      = useRef<SVGPathElement>(null)   as React.RefObject<SVGPathElement>

  const currentProgressRef = useRef(0)
  const isAnimatingRef     = useRef(false)
  const stepFractionsRef   = useRef<number[]>([0, 0.2, 0.4, 0.6, 0.8, 1.0])

  // Build pipe geometry
  useEffect(() => {
    function build() {
      const h   = window.innerHeight
      const ys  = NODE_VH.map(f => f * h)
      const path = buildPipePath(ys, h)
      setNodeYs(ys)
      setPipePath(path)
      setTotalH(h)
    }
    build()
    window.addEventListener('resize', build)
    return () => window.removeEventListener('resize', build)
  }, [])

  // After path renders: compute real fractions via binary search, init ball
  useEffect(() => {
    if (!pipeRef.current || !pipePath || !nodeYs.length) return
    const path = pipeRef.current
    const len  = path.getTotalLength()
    if (!len) return

    // Binary search for each node's Y position along the path
    const fracs = nodeYs.map(y => findFractionForY(path, y, len))
    stepFractionsRef.current = fracs

    // Debug: verify pipe and ball refs
    console.log('[StartPage] pipe totalLength:', len, 'fracs:', fracs)

    // Init ball at step 0 node
    const pt0 = path.getPointAtLength(fracs[0] * len)
    console.log('[StartPage] initial ball position:', pt0)
    if (ballRef.current) {
      ballRef.current.setAttribute('cx', String(pt0.x))
      ballRef.current.setAttribute('cy', String(pt0.y))
    }
    if (highlightRef.current) {
      highlightRef.current.setAttribute('cx', String(pt0.x - 3))
      highlightRef.current.setAttribute('cy', String(pt0.y - 4))
    }
    if (progressRef.current) {
      progressRef.current.style.strokeDasharray  = String(len)
      progressRef.current.style.strokeDashoffset = String(len)
    }
  }, [pipePath, nodeYs])

  const moveBallTo = useCallback((targetFraction: number, onComplete?: () => void) => {
    if (isAnimatingRef.current) return
    if (!pipeRef.current) { onComplete?.(); return }
    const path: SVGPathElement = pipeRef.current

    isAnimatingRef.current = true
    const totalLength   = path.getTotalLength()
    const startFraction = currentProgressRef.current
    const goingDown     = targetFraction > startFraction
    const duration      = 2200
    const startTime     = performance.now()
    let rotation = 0

    function frame(now: number) {
      const elapsed = now - startTime
      const t       = Math.min(elapsed / duration, 1)
      const eased   = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      const frac    = startFraction + (targetFraction - startFraction) * eased
      const dist    = frac * totalLength
      const pt      = path.getPointAtLength(dist)

      rotation += goingDown ? 9 : -9
      if (ballRef.current) {
        ballRef.current.setAttribute('cx', String(pt.x))
        ballRef.current.setAttribute('cy', String(pt.y))
        ballRef.current.setAttribute('transform', `rotate(${rotation},${pt.x},${pt.y})`)
      }
      if (highlightRef.current) {
        highlightRef.current.setAttribute('cx', String(pt.x - 3))
        highlightRef.current.setAttribute('cy', String(pt.y - 4))
        highlightRef.current.setAttribute('transform', `rotate(${rotation},${pt.x - 3},${pt.y - 4})`)
      }
      if (progressRef.current) {
        progressRef.current.style.strokeDashoffset = String(totalLength - frac * totalLength)
      }

      if (t < 1) {
        requestAnimationFrame(frame)
      } else {
        currentProgressRef.current = targetFraction
        isAnimatingRef.current     = false
        onComplete?.()
      }
    }
    requestAnimationFrame(frame)
  }, [])

  function goToNextStep() {
    const next = currentStep + 1
    if (next > 5 || isAnimatingRef.current) return
    moveBallTo(stepFractionsRef.current[next], () => {
      setStepStates(prev => {
        const s = [...prev]
        s[currentStep] = 'completed'
        s[next]        = 'active'
        return s
      })
      setCurrentStep(next)
      setTimeout(() => {
        document.getElementById(`step-${next + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    })
  }

  function goToStep(targetIdx: number) {
    if (targetIdx >= currentStep || isAnimatingRef.current) return
    moveBallTo(stepFractionsRef.current[targetIdx], () => {
      setStepStates(prev => {
        const s = [...prev]
        for (let i = targetIdx + 1; i <= currentStep; i++) s[i] = 'upcoming'
        s[targetIdx] = 'active'
        return s
      })
      setCurrentStep(targetIdx)
      setTimeout(() => {
        document.getElementById(`step-${targetIdx + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    })
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative' }}>

      {/* ── Nav — reuse landing page pill nav ── */}
      <Nav />

      {/* ── Mobile dot stepper ── */}
      <div className="start-mobile-stepper" style={{
        display: 'none', position: 'fixed', top: 80, left: 0, right: 0, zIndex: 99,
        background: 'var(--bg)', borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <MobileStepper stepStates={stepStates} />
      </div>

      {/* ── Left pipe column ── */}
      <div className="start-pipe" style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 160,
        pointerEvents: 'none', zIndex: 50, overflow: 'visible',
      }}>
        {pipePath && totalH > 0 && (
          <div style={{ pointerEvents: 'all' }}>
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
          </div>
        )}
      </div>

      {/* ── Right column ── */}
      <main className="start-main" style={{ marginLeft: 160, padding: '80px 60px 200px' }}>
        <StepSection stepNum={1} title="Choose Plan" state={stepStates[0]} goToStep={goToStep} noCard>
          <Step1 onContinue={goToNextStep} />
        </StepSection>

        <StepSection stepNum={2} title="Sign Up" state={stepStates[1]} goToStep={goToStep}>
          <Step2 email={email} setEmail={setEmail} onContinue={goToNextStep} />
        </StepSection>

        <StepSection stepNum={3} title="Verify" state={stepStates[2]} goToStep={goToStep}>
          <Step3 email={email} onContinue={goToNextStep} />
        </StepSection>

        <StepSection stepNum={4} title="Review" state={stepStates[3]} goToStep={goToStep}>
          <Step4 email={email} goToStep={goToStep} onContinue={goToNextStep} />
        </StepSection>

        <StepSection stepNum={5} title="Payment" state={stepStates[4]} goToStep={goToStep}>
          <Step5 onContinue={goToNextStep} />
        </StepSection>

        <StepSection stepNum={6} title="Welcome" state={stepStates[5]} goToStep={goToStep}>
          <Step6 />
        </StepSection>
      </main>

      {/* ── Responsive ── */}
      <style>{`
        @media (max-width: 768px) {
          .start-pipe { display: none !important; }
          .start-mobile-stepper { display: block !important; }
          .start-main { margin-left: 0 !important; padding: 116px 24px 120px !important; }
        }
      `}</style>
    </div>
  )
}
