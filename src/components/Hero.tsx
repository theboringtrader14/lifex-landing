import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section
      id="top"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '120px var(--space-8) var(--space-20)',
      }}
    >
      {/* Animated gradient base */}
      <motion.div
        aria-hidden
        initial={{ backgroundPosition: '0% 50%' }}
        animate={reduce ? { backgroundPosition: '0% 50%' } : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={reduce ? {} : { duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: 'var(--hero-gradient)',
          backgroundSize: '200% 200%',
          opacity: 0.42,
        }}
      />
      {/* Dot grid overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          mixBlendMode: 'overlay',
        }}
      />
      {/* Orbs */}
      <motion.div
        aria-hidden
        animate={reduce ? {} : { y: [-20, 20, -20] }}
        transition={reduce ? {} : { duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-160px',
          left: '-120px',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 65%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
      <motion.div
        aria-hidden
        animate={reduce ? {} : { y: [20, -20, 20] }}
        transition={reduce ? {} : { duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '20%',
          right: '-160px',
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.45) 0%, transparent 65%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
      <motion.div
        aria-hidden
        animate={reduce ? {} : { y: [-15, 25, -15] }}
        transition={reduce ? {} : { duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '-180px',
          left: '30%',
          width: 620,
          height: 620,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.38) 0%, transparent 65%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
      {/* Bottom vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: 'radial-gradient(120% 80% at 50% 130%, var(--bg-deep) 20%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: 1100,
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-6)',
        }}
      >
        {/* Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.22)',
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#34d399',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
              animation: 'pulseGlow 2s ease-in-out infinite',
            }}
          />
          Live — 5 modules in production
        </div>

        {/* H1 */}
        <h1
          style={{
            fontSize: 'clamp(52px, 8vw, 88px)',
            lineHeight: 1.04,
            letterSpacing: '-0.025em',
            fontWeight: 700,
            margin: 0,
            maxWidth: 980,
            background: 'linear-gradient(135deg, #f8fafc 0%, #a78bfa 50%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          One OS for your entire life.
        </h1>

        {/* Subhead */}
        <p
          style={{
            fontSize: 'clamp(16px, 1.45vw, 20px)',
            lineHeight: 1.55,
            color: 'var(--text-secondary)',
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          Trade smarter. Invest wiser. Spend consciously. Travel freer. LIFEX OS is the command center for your money, health, and time.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              height: 48,
              padding: '0 22px',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
              fontWeight: 600,
              color: '#ffffff',
              background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
              boxShadow: '0 0 0 1px rgba(99,102,241,0.4), 0 14px 40px rgba(99,102,241,0.4)',
              transition: 'transform 180ms ease, box-shadow 180ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.6), 0 18px 50px rgba(99,102,241,0.6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.4), 0 14px 40px rgba(99,102,241,0.4)'
            }}
          >
            Start 3-day free trial
            <ArrowRight size={16} strokeWidth={2} />
          </a>
          <a
            href="#modules"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              height: 48,
              padding: '0 22px',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-default)',
              transition: 'color 180ms ease, border-color 180ms ease, background 180ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)'
              e.currentTarget.style.borderColor = 'var(--border-strong)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = ''
              e.currentTarget.style.borderColor = ''
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            }}
          >
            See modules
            <ChevronDown size={16} strokeWidth={2} />
          </a>
        </div>

        {/* Trust line */}
        <p style={{ marginTop: 8, fontSize: 12.5, color: 'var(--text-muted)', letterSpacing: '0.01em' }}>
          Trusted by traders, investors, and professionals — no card required for trial.
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 'var(--space-4)',
          }}
        >
          {[
            { label: 'Modules', value: '5 Live' },
            { label: 'Users', value: '50+' },
            { label: 'Uptime', value: '99.9%' },
          ].map((s) => (
            <span
              key={s.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(255,255,255,0.02)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11.5,
                color: 'var(--text-muted)',
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{s.value}</span>
            </span>
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #10b981; }
          50%      { opacity: 0.55; box-shadow: 0 0 16px #10b981; }
        }
      `}</style>
    </section>
  )
}
