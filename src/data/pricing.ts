export interface ModulePrice {
  moduleId: string
  moduleName: string
  price: number | null
  comingSoon?: boolean
}

export interface Addon {
  id: string
  name: string
  priceDelta: number
  description: string
}

export interface Bundle {
  id: string
  name: string
  tagline: string
  price: number
  includedModules: string[]
  includedAddons: string[]
  featured?: boolean
}

export const trialDays = 3

export const modulePrices: ModulePrice[] = [
  { moduleId: 'staax',    moduleName: 'STAAX',    price: 1000 },
  { moduleId: 'invex',    moduleName: 'INVEX',    price: 800 },
  { moduleId: 'budgex',   moduleName: 'BUDGEX',   price: 500 },
  { moduleId: 'finex',    moduleName: 'FINEX',    price: 800 },
  { moduleId: 'travex',   moduleName: 'TRAVEX',   price: 400 },
  { moduleId: 'healthex', moduleName: 'HEALTHEX', price: null, comingSoon: true },
  { moduleId: 'histex',   moduleName: 'HISTEX',   price: null, comingSoon: true },
]

export const addons: Addon[] = [
  {
    id: 'ai',
    name: 'AI Layer',
    priceDelta: 300,
    description: 'Unlimited AI queries across all subscribed modules. Without this add-on, every plan includes 100 queries per month.',
  },
  {
    id: 'mobile',
    name: 'Mobile App',
    priceDelta: 200,
    description: 'Access to the LIFEX iOS and Android app. Voice-first expense capture, push notifications, dashboards on the go.',
  },
  {
    id: 'byok',
    name: 'BYOK discount',
    priceDelta: -100,
    description: 'Bring your own Gemma, OpenAI, or Anthropic API key. Unlimited queries under your own quota — and ₹100 off every month.',
  },
]

export const bundles: Bundle[] = [
  {
    id: 'bundle_trader',
    name: 'LIFEX Trader',
    tagline: 'For active market participants.',
    price: 4750,
    includedModules: ['staax', 'invex'],
    includedAddons: ['ai'],
  },
  {
    id: 'bundle_money',
    name: 'LIFEX Money',
    tagline: 'For budgeters and long-term planners.',
    price: 2150,
    includedModules: ['budgex', 'finex', 'invex'],
    includedAddons: ['ai'],
  },
  {
    id: 'bundle_premium',
    name: 'LIFEX Premium',
    tagline: 'Everything, unlimited. The full OS.',
    price: 6500,
    includedModules: ['staax', 'invex', 'budgex', 'finex', 'travex'],
    includedAddons: ['ai', 'mobile'],
    featured: true,
  },
]
