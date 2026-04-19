import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

const links = [
  { href: '#modules', label: 'Modules' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

/** Shared smart-scroll: positions section so its header has breathing room below the
 *  fixed nav (topAligned), but never clips the bottom (midpoint if section is tall). */
function scrollToSection(id: string, e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  const section = document.getElementById(id)
  if (!section) return
  const sectionTop    = section.getBoundingClientRect().top + window.scrollY
  const sectionBottom = sectionTop + section.offsetHeight
  const topAligned    = sectionTop - 80
  const bottomAligned = sectionBottom - window.innerHeight + 24
  const target = bottomAligned > topAligned
    ? Math.round((topAligned + bottomAligned) / 2)
    : topAligned
  window.scrollTo({ top: target, behavior: 'smooth' })
}

export function scrollToModules(e: React.MouseEvent<HTMLAnchorElement>) {
  scrollToSection('modules', e)
}

export default function Nav({ minimal = false }: { minimal?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
    {/* Gradient backdrop — masks content that scrolls into the gap above the pill */}
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        background: 'linear-gradient(to bottom, var(--bg) 55%, transparent 100%)',
        zIndex: 99,
        pointerEvents: 'none',
      }}
    />
    <nav
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        WebkitTransform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: 1200,
        zIndex: 100,
        background: 'var(--bg)',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--neu-raised)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
            fontSize: 20,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          LIFEX OS
        </span>
      </a>

      {/* Center links (desktop) — hidden in minimal mode */}
      <ul
        className="nav-center"
        style={{
          display: minimal ? 'none' : 'flex',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          gap: 32,
          fontSize: 14,
          color: 'var(--text-dim)',
          fontWeight: 500,
        }}
      >
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              onClick={(e) => scrollToSection(l.href.slice(1), e)}
              style={{
                color: 'var(--text-dim)',
                textDecoration: 'none',
                padding: '6px 2px',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Right actions */}
      <div className="nav-actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <ThemeToggle />

        <Link
          to="/start"
          style={{
            display: minimal ? 'none' : 'inline-flex',
            height: 34,
            padding: '10px 20px',
            alignItems: 'center',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-dim)',
            background: 'var(--bg)',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            boxShadow: 'var(--neu-raised-sm)',
            transition: 'box-shadow 200ms ease, color 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--neu-pressed)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--neu-raised-sm)'
            e.currentTarget.style.color = 'var(--text-dim)'
          }}
        >
          Get started
        </Link>
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
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg)',
          boxShadow: 'var(--neu-raised-sm)',
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
            background: 'var(--bg)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--neu-raised)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            fontSize: 14,
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                setMenuOpen(false)
                scrollToSection(l.href.slice(1), e)
              }}
              style={{ color: 'var(--text-dim)' }}
            >
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
    </>
  )
}
