import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Hero from './components/Hero'
import ModuleGrid from './components/ModuleGrid'
import ModuleModal from './components/ModuleModal'
import PricingSection from './components/PricingSection'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import { getModuleById } from './data/modules'

const SECTION_IDS = ['top', 'modules', 'pricing', 'faq']

function getScrollTarget(el: HTMLElement): number {
  const sectionTop    = el.getBoundingClientRect().top + window.scrollY
  const sectionBottom = sectionTop + el.offsetHeight
  const topAligned    = sectionTop - 80
  const bottomAligned = sectionBottom - window.innerHeight + 24
  return bottomAligned > topAligned
    ? Math.round((topAligned + bottomAligned) / 2)
    : Math.max(0, topAligned)
}

function getSections(): HTMLElement[] {
  const els: HTMLElement[] = []
  SECTION_IDS.forEach(id => {
    const el = document.getElementById(id)
    if (el) els.push(el)
  })
  const footer = document.querySelector('footer') as HTMLElement | null
  if (footer) els.push(footer)
  return els
}

function getCurrentIndex(sections: HTMLElement[]): number {
  const navH = 80
  let idx = 0
  for (let i = 0; i < sections.length; i++) {
    const top = sections[i].getBoundingClientRect().top + window.scrollY
    if (top - navH <= window.scrollY + 4) idx = i
  }
  return idx
}

function LandingPage() {
  const [openId, setOpenId] = useState<string | null>(null)
  const activeModule = openId ? getModuleById(openId) ?? null : null

  useEffect(() => {
    let isAnimating = false
    let cooldown = 0

    const scrollTo = (target: number) => {
      isAnimating = true
      cooldown = Date.now()
      window.scrollTo({ top: target, behavior: 'smooth' })
      setTimeout(() => { isAnimating = false }, 750)
    }

    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) return
      if (Date.now() - cooldown < 400) return

      const sections = getSections()
      if (!sections.length) return

      const idx = getCurrentIndex(sections)
      const current = sections[idx]
      const rect = current.getBoundingClientRect()

      if (e.deltaY > 0) {
        const atBottom = rect.bottom <= window.innerHeight + 80
        if (!atBottom) return
        const nextIdx = Math.min(idx + 1, sections.length - 1)
        if (nextIdx === idx) return
        scrollTo(getScrollTarget(sections[nextIdx]))
      } else {
        const atTop = rect.top >= -80
        if (!atTop) return
        const prevIdx = Math.max(idx - 1, 0)
        if (prevIdx === idx) return
        scrollTo(getScrollTarget(sections[prevIdx]))
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 80 }}>
        <Hero />
        <ModuleGrid onOpenModule={setOpenId} />
        <PricingSection />
        <FAQ />
      </main>
      <Footer />
      <ModuleModal module={activeModule} onClose={() => setOpenId(null)} />
    </>
  )
}

function StartPage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg)',
        flexDirection: 'column',
        gap: 16,
        padding: 40,
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
        LIFEX OS
      </span>
      <h1
        style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
          textAlign: 'center',
        }}
      >
        Pricing & Onboarding
      </h1>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
          color: 'var(--text-mute)',
        }}
      >
        Coming soon
      </p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/start" element={<StartPage />} />
      </Routes>
    </BrowserRouter>
  )
}
