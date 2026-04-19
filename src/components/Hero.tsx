import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const stats = [
  { value: '7', label: 'Modules' },
  { value: '1', label: 'Life' },
  { value: '99.9%', label: 'Uptime' },
]

export default function Hero() {
  return (
    <section
      id="top"
      style={{
        position: 'relative',
        maxWidth: 1200,
        margin: '0 auto',
        overflow: 'hidden',
        padding: '160px 40px 120px',
        textAlign: 'center',
      }}
    >
      {/* Hero gradient orb */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          opacity: 0.4,
          filter: 'blur(80px)',
          zIndex: 0,
          animation: 'heroPulse 8s ease-in-out infinite',
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
          zIndex: 1,
          maxWidth: 1100,
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-6)',
        }}
      >
        {/* Eyebrow badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 'var(--radius-pill)',
            boxShadow: 'var(--neu-inset)',
            background: 'var(--bg)',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: 'var(--text-dim)',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--status-live)',
              boxShadow: '0 0 12px var(--status-live)',
              animation: 'pulseGlow 2s ease-in-out infinite',
            }}
          />
          Live — 5 modules in production
        </div>

        {/* H1 */}
        <h1
          className="hero-heading"
          style={{
            fontSize: 'clamp(48px, 8vw, 88px)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            fontWeight: 700,
            margin: 0,
            marginBottom: '28px',
            maxWidth: 980,
            fontFamily: 'var(--font-display)',
          }}
        >
          One OS for<br />your entire life.
        </h1>

        {/* Subhead */}
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: 'var(--text-dim)',
            maxWidth: 620,
            margin: '0 auto',
            marginBottom: '48px',
          }}
        >
          Trade smarter. Invest wiser. Spend consciously. Travel freer. LIFEX OS is the command center for your money, health, and time.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <Link
            to="/start"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '18px 36px',
              borderRadius: 'var(--radius-pill)',
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text)',
              background: 'var(--bg)',
              border: 'none',
              boxShadow: 'var(--neu-raised), 0 0 40px var(--accent-glow)',
              transition: 'box-shadow 180ms ease, transform 180ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--neu-raised), 0 0 60px var(--accent-glow)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--neu-raised), 0 0 40px var(--accent-glow)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Start 3-day free trial
          </Link>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 80,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                padding: '20px 32px',
                background: 'var(--bg)',
                borderRadius: 18,
                boxShadow: 'var(--neu-inset)',
                display: 'flex',
                flexDirection: 'column',
                minWidth: 180,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--text-mute)',
                  marginTop: 4,
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
      `}</style>
    </section>
  )
}
