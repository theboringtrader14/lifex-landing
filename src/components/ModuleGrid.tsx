import { motion } from 'framer-motion'
import { modules } from '@/data/modules'
import ModuleCard from './ModuleCard'

interface Props {
  onOpenModule: (id: string) => void
}

export default function ModuleGrid({ onOpenModule }: Props) {
  return (
    <section
      id="modules"
      style={{
        position: 'relative',
        padding: 'var(--space-30) var(--space-8)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            textAlign: 'center',
            marginBottom: 'var(--space-16)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.24em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
            }}
          >
            The Suite
          </span>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.08,
              maxWidth: 860,
              color: 'var(--text)',
            }}
          >
            7 Modules. One Platform.<br />Your LIFEX.
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(15px, 1.3vw, 18px)',
              lineHeight: 1.6,
              color: 'var(--text-dim)',
              maxWidth: '560px',
            }}
          >
            Subscribe to what you need. Add modules as you grow. No lock-in, cancel anytime.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {modules.map((m, idx) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                delay: Math.min(idx * 0.05, 0.3),
                ease: [0.2, 0.8, 0.2, 1],
              }}
              style={{ display: 'flex' }}
            >
              <ModuleCard module={m} onOpen={onOpenModule} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
