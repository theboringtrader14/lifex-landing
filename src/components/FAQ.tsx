import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface QA {
  q: string
  a: string
}

const faqs: QA[] = [
  {
    q: 'What is LIFEX OS and how is it different from other personal-finance apps?',
    a: 'LIFEX OS is a suite of seven modules — STAAX for trading, INVEX for investing, BUDGEX for budgeting, FINEX for financial intelligence, TRAVEX for travel, HEALTHEX for health, and HISTEX for historical data. Unlike single-purpose apps, every module shares a common AI layer and feeds into one LIFEX Score. You subscribe only to what you need.',
  },
  {
    q: 'Do you hold custody of my money, broker credentials, or investments?',
    a: 'No. You connect your own broker accounts (Zerodha, Angel One, Dhan, Groww, Finvasia) and funds stay with your broker at all times. STAAX places orders via your broker API using credentials stored encrypted in your private database schema. No regulator-level empanelment is required — LIFEX is a software layer, not a broker.',
  },
  {
    q: 'What is the 3-day free trial and do I need to enter card details?',
    a: 'Every plan includes a 3-day free trial. No card is required to start. After 3 days you can upgrade to any tier via Razorpay monthly billing. If you do nothing, your trial simply ends — no charge, no surprise.',
  },
  {
    q: 'Can I use my own AI API key instead of paying for the AI Layer add-on?',
    a: 'Yes. Bring your own Gemma, OpenAI, or Anthropic key via the BYOK option. You get unlimited queries under your own quota and save ₹99 per month. Every plan above Starter includes 100 AI queries per month by default; the AI Layer add-on (+₹299) removes the cap.',
  },
  {
    q: 'Which brokers does STAAX support for algorithmic trading?',
    a: 'STAAX currently supports Angel One (SmartAPI), Zerodha (Kite Connect), Dhan, Groww, and Finvasia. MT5 integration is in beta for commodities and forex. You can connect multiple brokers simultaneously and route different strategies to different accounts.',
  },
  {
    q: 'What happens to my data if I cancel my subscription?',
    a: 'Your data belongs to you. On cancellation, all data remains accessible in read-only mode for 90 days. You can export trades, holdings, expenses, and trip history as CSV or JSON at any time. After 90 days, personal-schema data is archived and can be restored on reactivation within 12 months.',
  },
  {
    q: 'Is LIFEX OS a mobile app or a web app?',
    a: 'Both. The web app is available on every plan. The LIFEX mobile app (iOS and Android) is an add-on at ₹199/mo and is optimized for BUDGEX voice capture, push alerts, and on-the-go dashboards. The full module experience — algo management, pricing tables, backtest — lives on the web.',
  },
  {
    q: 'How is LIFEX OS priced and can I mix and match modules?',
    a: 'Yes. Subscribe to individual modules at their Starter, Pro, or Premium tier. Or pick a bundle — Trader, Money, Starter, or Premium — and save. Add the AI Layer or Mobile App as optional add-ons. Pricing starts at ₹149/mo for TRAVEX Starter and goes up to ₹7,999/mo for the Premium bundle (everything, unlimited).',
  },
  {
    q: 'Is my data private, and where is it stored?',
    a: 'LIFEX uses a hybrid multi-tenant architecture: a shared core database for users, subscriptions, and OAuth connections, and a per-user schema inside each module database. Your trading data, expenses, and health data are physically isolated per account. All sensitive credentials are encrypted at rest. Databases are hosted in India (ap-south-1).',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="faq"
      style={{
        padding: 'var(--space-15) var(--space-8) var(--space-15)',
        background: 'var(--bg)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: 36,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-4)',
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
            FAQ
          </span>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(34px, 4.6vw, 52px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.08,
              color: 'var(--text)',
            }}
          >
            Frequently asked questions.
          </h2>
        </motion.div>

        {/* Single container wrapping all FAQ items */}
        <div
          style={{
            borderRadius: '24px',
            background: 'var(--bg)',
            boxShadow: 'var(--neu-raised)',
            overflow: 'hidden',
          }}
        >
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div
                key={f.q}
                style={{
                  padding: '20px 28px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 0,
                    cursor: 'pointer',
                    color: 'var(--text)',
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 500,
                      lineHeight: 1.45,
                      fontFamily: 'var(--font-body)',
                      color: 'var(--text)',
                    }}
                  >
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                    style={{
                      flexShrink: 0,
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--neu-inset)',
                      background: 'var(--bg)',
                      border: 'none',
                      color: 'var(--accent)',
                    }}
                  >
                    <Plus size={15} strokeWidth={2} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p
                        style={{
                          margin: 0,
                          padding: 'var(--space-4) 0 0 0',
                          fontSize: 14.5,
                          lineHeight: 1.65,
                          color: 'var(--text-dim)',
                          paddingRight: 64,
                        }}
                      >
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
