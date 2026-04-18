export interface ModuleTier {
  moduleId: string
  moduleName: string
  starter: number | null
  pro: number | null
  premium: number | null
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

export const moduleTiers: ModuleTier[] = [
  { moduleId: 'staax',   moduleName: 'STAAX',   starter: 999, pro: 2499, premium: 4999 },
  { moduleId: 'invex',   moduleName: 'INVEX',   starter: 299, pro: 799,  premium: 1499 },
  { moduleId: 'budgex',  moduleName: 'BUDGEX',  starter: 199, pro: 499,  premium: null },
  { moduleId: 'finex',   moduleName: 'FINEX',   starter: null, pro: 799, premium: 1499 },
  { moduleId: 'travex',  moduleName: 'TRAVEX',  starter: 149, pro: 399,  premium: null },
  { moduleId: 'healthex', moduleName: 'HEALTHEX', starter: null, pro: null, premium: null },
  { moduleId: 'histex',  moduleName: 'HISTEX',  starter: null, pro: null, premium: null },
]

export const addons: Addon[] = [
  {
    id: 'ai',
    name: 'AI Layer',
    priceDelta: 299,
    description: 'Unlimited AI queries across all subscribed modules. Without this add-on, every plan above Starter includes 100 queries per month.',
  },
  {
    id: 'mobile',
    name: 'Mobile App',
    priceDelta: 199,
    description: 'Access to the LIFEX iOS and Android app. Voice-first expense capture, push notifications, dashboards on the go.',
  },
  {
    id: 'byok',
    name: 'BYOK discount',
    priceDelta: -99,
    description: 'Bring your own Gemma, OpenAI, or Anthropic API key. Unlimited queries under your own quota — and ₹99 off every month.',
  },
]

export const bundles: Bundle[] = [
  {
    id: 'bundle_trader',
    name: 'LIFEX Trader',
    tagline: 'For active market participants.',
    price: 3299,
    includedModules: ['staax', 'invex'],
    includedAddons: ['ai'],
  },
  {
    id: 'bundle_money',
    name: 'LIFEX Money',
    tagline: 'For budgeters and long-term planners.',
    price: 1799,
    includedModules: ['budgex', 'finex', 'invex'],
    includedAddons: ['ai'],
  },
  {
    id: 'bundle_starter',
    name: 'LIFEX Starter',
    tagline: 'Every Pro tier, plus AI and mobile.',
    price: 4999,
    includedModules: ['staax', 'invex', 'budgex', 'finex', 'travex'],
    includedAddons: ['ai', 'mobile'],
  },
  {
    id: 'bundle_premium',
    name: 'LIFEX Premium',
    tagline: 'Everything, unlimited. The full OS.',
    price: 7999,
    includedModules: ['staax', 'invex', 'budgex', 'finex', 'travex'],
    includedAddons: ['ai', 'mobile'],
    featured: true,
  },
]
