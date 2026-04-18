import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('lifex-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('lifex-theme', theme) } catch {}
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        width: 34,
        height: 34,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--text-dim)',
        border: 'none',
        borderRadius: '50%',
        boxShadow: 'var(--neu-raised-sm)',
        cursor: 'pointer',
        fontSize: 16,
        transition: 'box-shadow 200ms ease, color 200ms ease',
      }}
      onMouseDown={e => (e.currentTarget.style.boxShadow = 'var(--neu-inset)')}
      onMouseUp={e => (e.currentTarget.style.boxShadow = 'var(--neu-raised-sm)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--neu-raised-sm)')}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
