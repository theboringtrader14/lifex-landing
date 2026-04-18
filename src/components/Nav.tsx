import { useEffect, useState } from 'react'

const links = [
  { href: '#modules', label: 'Modules' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#roadmap', label: 'Roadmap' },
  { href: '#faq', label: 'FAQ' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 64,
        padding: '0 var(--space-8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(3,3,8,0.72)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(140%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(140%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        transition: 'background 200ms ease, border-color 200ms ease, backdrop-filter 200ms ease',
      }}
      aria-label="Primary navigation"
    >
      {/* Logo */}
      <a
        href="#top"
        style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}
        aria-label="LIFEX OS home"
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: '0.18em',
            background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 55%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          LIFEX
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.22em',
            color: 'var(--text-muted)',
            padding: '2px 5px',
            border: '1px solid var(--border-default)',
            borderRadius: 4,
            position: 'relative',
            top: -6,
          }}
        >
          OS
        </span>
      </a>

      {/* Center links (desktop) */}
      <ul
        className="nav-center"
        style={{
          display: 'flex',
          gap: 'var(--space-6)',
          fontSize: 13,
          color: 'var(--text-secondary)',
          fontWeight: 500,
        }}
      >
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              style={{
                padding: '6px 2px',
                transition: 'color 160ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '')}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Right actions */}
      <div className="nav-actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <a
          href="#"
          style={{
            height: 34,
            padding: '0 14px',
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            transition: 'color 160ms ease, border-color 160ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.borderColor = 'var(--border-strong)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = ''
            e.currentTarget.style.borderColor = ''
          }}
        >
          Sign in
        </a>
        <a
          href="#"
          style={{
            height: 34,
            padding: '0 16px',
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 13,
            fontWeight: 600,
            color: '#ffffff',
            background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 0 0 1px rgba(99,102,241,0.35), 0 6px 16px rgba(99,102,241,0.25)',
            transition: 'transform 160ms ease, box-shadow 160ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.5), 0 10px 28px rgba(99,102,241,0.45)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.35), 0 6px 16px rgba(99,102,241,0.25)'
          }}
        >
          Get started
        </a>
      </div>

      {/* Mobile toggle */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        style={{
          display: 'none',
          width: 36,
          height: 36,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-default)',
        }}
      >
        <span style={{ fontSize: 16 }}>{menuOpen ? '×' : '≡'}</span>
      </button>

      {menuOpen && (
        <div
          className="nav-mobile-panel"
          style={{
            position: 'absolute',
            top: 64,
            left: 0,
            right: 0,
            padding: 'var(--space-4) var(--space-8)',
            background: 'rgba(3,3,8,0.96)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            fontSize: 14,
          }}
        >
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-secondary)' }}>
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 720px) {
          .nav-center { display: none !important; }
          .nav-actions { display: none !important; }
          .nav-hamburger { display: inline-flex !important; }
        }
      `}</style>
    </nav>
  )
}
