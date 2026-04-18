const columns = [
  {
    title: 'Modules',
    links: [
      { label: 'STAAX', href: '#modules' },
      { label: 'INVEX', href: '#modules' },
      { label: 'BUDGEX', href: '#modules' },
      { label: 'FINEX', href: '#modules' },
      { label: 'TRAVEX', href: '#modules' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Pricing', href: '#pricing' },
      { label: 'Roadmap', href: '#roadmap' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact', href: 'mailto:hello@lifexos.co.in' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Refund policy', href: '#' },
      { label: 'Security', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer
      style={{
        padding: '45px 40px 40px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
          gap: 'var(--space-10)',
          alignItems: 'flex-start',
        }}
        className="footer-grid"
      >
        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
              }}
            >
              LIFEX OS
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--text-mute)', maxWidth: 280 }}>
            One OS for your entire life. Trade smarter, invest wiser, spend consciously, travel freer.
          </p>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.06em' }}>
            lifexos.co.in
          </span>
        </div>

        {columns.map((col) => (
          <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--text-mute)',
                marginBottom: 2,
              }}
            >
              {col.title}
            </div>
            {col.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  fontSize: 13.5,
                  color: 'var(--text-dim)',
                  transition: 'color 160ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
              >
                {l.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: '36px auto 0',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-4)',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-mute)',
          }}
        >
          © {new Date().getFullYear()} LIFEX OS. Built in India.
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-mute)', letterSpacing: '0.06em' }}>
          v1.0.0 · Phase 1 Live
        </span>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
