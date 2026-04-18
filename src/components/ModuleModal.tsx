import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Module } from '@/data/modules'
import { statusLabel } from '@/data/modules'
import { ModuleIcon } from './icons/ModuleIcons'

interface Props {
  module: Module | null
  onClose: () => void
}

// Maps Module status (ALLCAPS enum) to CSS class suffix
const statusClassMap: Record<string, string> = {
  LIVE: 'live',
  BETA: 'beta',
  BUILDING: 'building',
  COMING_SOON: 'soon',
}

export default function ModuleModal({ module, onClose }: Props) {
  const open = module !== null

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {module && (
        <motion.div
          key="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="module-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-6)',
            overflowY: 'auto',
          }}
        >
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 1080,
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1fr',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--neu-raised-lg)',
            }}
          >
            <div
              className="modal-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '40% 60%',
                minHeight: 520,
                maxHeight: '90vh',
                overflow: 'hidden',
              }}
            >
              {/* LEFT — Hero panel */}
              <div
                style={{
                  position: 'relative',
                  padding: 'var(--space-10)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-5)',
                  background: `${module.color}14`,
                  borderRight: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                }}
              >
                {/* ambient glow */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: '-80px',
                    left: '-80px',
                    width: 280,
                    height: 280,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${module.color}55 0%, transparent 65%)`,
                    filter: 'blur(40px)',
                  }}
                />

                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', height: '100%' }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `${module.color}1a`,
                      border: `1px solid ${module.color}44`,
                      color: module.color,
                    }}
                  >
                    <ModuleIcon iconKey={module.iconKey} size={32} />
                  </div>

                  <span className={`status status-${statusClassMap[module.status] ?? 'soon'}`}>
                    {statusLabel[module.status]}
                  </span>

                  <h2
                    id="module-modal-title"
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(32px, 3.2vw, 44px)',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.08,
                      color: 'var(--text)',
                    }}
                  >
                    {module.name}
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: 'var(--text-dim)',
                    }}
                  >
                    {module.tagline}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize: 14.5,
                      lineHeight: 1.65,
                      color: 'var(--text-dim)',
                    }}
                  >
                    {module.description}
                  </p>

                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: 'var(--space-4)',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-mute)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                      Starting at
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--text)', fontWeight: 600 }}>
                      {module.startingPrice ? `₹${module.startingPrice}/mo` : 'Pricing TBD'}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — Details panel */}
              <div
                style={{
                  padding: 'var(--space-10)',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-8)',
                }}
              >
                {/* Features */}
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      color: 'var(--text-mute)',
                      textTransform: 'uppercase',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    Features
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: 'var(--space-4)',
                    }}
                  >
                    {module.features.map((f) => (
                      <div
                        key={f.title}
                        style={{
                          padding: 'var(--space-4)',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg)',
                          boxShadow: 'var(--neu-inset)',
                        }}
                      >
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                          {f.title}
                        </div>
                        <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--text-dim)' }}>
                          {f.body}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How it works */}
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      color: 'var(--text-mute)',
                      textTransform: 'uppercase',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    How it works
                  </div>
                  <ol
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-3)',
                    }}
                  >
                    {module.howItWorks.map((s) => (
                      <li
                        key={s.step}
                        style={{
                          display: 'flex',
                          gap: 'var(--space-4)',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span
                          style={{
                            flexShrink: 0,
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 12,
                            fontWeight: 600,
                            color: module.color,
                            background: `${module.color}14`,
                            border: `1px solid ${module.color}40`,
                          }}
                        >
                          {s.step}
                        </span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                            {s.title}
                          </div>
                          <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--text-dim)' }}>
                            {s.body}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Integrations */}
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      color: 'var(--text-mute)',
                      textTransform: 'uppercase',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    Integrations
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {module.integrations.map((i) => (
                      <span
                        key={i}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11.5,
                          padding: '5px 10px',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-dim)',
                          background: 'var(--bg)',
                          boxShadow: 'var(--neu-raised-sm)',
                        }}
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'var(--bg)',
                border: 'none',
                boxShadow: 'var(--neu-raised-sm)',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                transition: 'color 160ms ease, box-shadow 160ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text)'
                e.currentTarget.style.boxShadow = 'var(--neu-inset)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-dim)'
                e.currentTarget.style.boxShadow = 'var(--neu-raised-sm)'
              }}
            >
              <X size={14} strokeWidth={2} />
            </button>

            <style>{`
              @media (max-width: 860px) {
                .modal-grid { grid-template-columns: 1fr !important; }
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
