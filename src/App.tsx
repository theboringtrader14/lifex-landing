import { useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import ModuleGrid from './components/ModuleGrid'
import ModuleModal from './components/ModuleModal'
import PricingSection from './components/PricingSection'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import { getModuleById } from './data/modules'

export default function App() {
  const [openId, setOpenId] = useState<string | null>(null)
  const activeModule = openId ? getModuleById(openId) ?? null : null

  return (
    <>
      <Nav />
      <main>
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
