export type ModuleStatus = 'LIVE' | 'BETA' | 'BUILDING' | 'COMING_SOON'

export type IconKey =
  | 'staax' | 'invex' | 'budgex' | 'finex' | 'travex' | 'healthex' | 'histex'

export interface ModuleFeature {
  title: string
  body: string
}

export interface ModuleStep {
  step: number
  title: string
  body: string
}

export interface Module {
  id: string
  name: string
  tagline: string
  description: string
  status: ModuleStatus
  color: string
  gradient?: string
  iconKey: IconKey
  features: ModuleFeature[]
  shortFeatures: string[]
  integrations: string[]
  howItWorks: ModuleStep[]
  startingPrice: number | null
}

export const statusLabel: Record<ModuleStatus, string> = {
  LIVE: 'LIVE',
  BETA: 'BETA',
  BUILDING: 'BUILDING',
  COMING_SOON: 'COMING SOON',
}

export const modules: Module[] = [
  {
    id: 'staax',
    name: 'STAAX',
    tagline: 'Algorithmic trading for F&O and commodities',
    description:
      'Deploy multi-leg options strategies, index trades, and commodity algos across your own broker accounts. STAAX handles order orchestration, re-entry logic, and risk controls while you keep full custody of funds.',
    status: 'LIVE',
    color: '#FF6B00',
    iconKey: 'staax',
    shortFeatures: [
      'Multi-broker execution',
      'Re-entry engine with journey legs',
      '24/7 kill switch and reconciliation',
    ],
    features: [
      { title: 'Multi-broker execution', body: 'Connect Angel One, Zerodha, Dhan, Groww, or Finvasia. STAAX routes orders to each broker without moving your funds.' },
      { title: 'Re-entry engine', body: 'Price-watcher re-entry on the same strike after SL or TP. Immediate re-execute on fresh strikes. Bounded by count and time windows.' },
      { title: 'Journey legs', body: 'Multi-step option strategies where child legs fire on parent SL, TP, or either event. Full round-trip persistence.' },
      { title: 'Kill switch', body: 'Pause all running algos with one click. Scheduler halts new entries. Open positions continue to manage exits safely.' },
      { title: 'Order reconciliation', body: 'Background reconciler compares STAAX order state to live broker orderbook every 60 seconds during market hours.' },
      { title: 'Lot-size aware P&L', body: 'Quantity math handled per instrument — NIFTY 75, BANKNIFTY 35, SENSEX 20, MCX variable. No unit-price errors.' },
    ],
    integrations: ['Angel One', 'Zerodha', 'Dhan', 'Groww', 'Finvasia', 'MT5 (beta)'],
    howItWorks: [
      { step: 1, title: 'Connect broker', body: 'Enter your broker API key and TOTP. Credentials are encrypted at rest in your private schema.' },
      { step: 2, title: 'Define your algo', body: 'Pick instrument, strikes, entry rules, SL and TP, lots, re-entry policy, and exit time.' },
      { step: 3, title: 'Monitor or automate', body: 'Run in PRACTIX for paper trading or LIVE to execute on your broker. Alerts, analytics, and logs are always on.' },
    ],
    startingPrice: 999,
  },
  {
    id: 'invex',
    name: 'INVEX',
    tagline: 'Long-term investing, automated',
    description:
      'Track holdings across demat accounts, automate SIPs, apply to IPOs, and see portfolio XIRR at a glance. Built for investors who want clarity without spreadsheets.',
    status: 'LIVE',
    color: '#00C9A7',
    iconKey: 'invex',
    shortFeatures: [
      'Auto-SIP scheduler',
      'IPO application bot',
      'Holdings with live XIRR',
    ],
    features: [
      { title: 'Auto-SIP scheduler', body: 'Configure SIPs per instrument and frequency. Executes at 09:20 IST Monday to Friday on your broker account.' },
      { title: 'IPO bot', body: 'Automatic IPO applications based on your YTR rules. Tracks allotment and credits into your portfolio.' },
      { title: 'Live holdings', body: 'Unified view across Zerodha and Angel One. Daily P&L, absolute returns, and XIRR per holding.' },
      { title: 'Watchlist', body: 'Track stocks you are researching. Live price polling with 30-second refresh.' },
      { title: 'Analysis tab', body: 'Fundamental and technical screeners combining Screener.in metrics with momentum signals.' },
    ],
    integrations: ['Zerodha', 'Angel One', 'Screener.in'],
    howItWorks: [
      { step: 1, title: 'Link accounts', body: 'Connect Zerodha and Angel One via OAuth or SmartAPI. Holdings sync in minutes.' },
      { step: 2, title: 'Automate SIPs', body: 'Create a SIP rule per instrument. INVEX runs them on schedule and records every execution.' },
      { step: 3, title: 'Review and rebalance', body: 'Monthly or quarterly, review allocation and XIRR. Execute rebalancing trades through your broker.' },
    ],
    startingPrice: 299,
  },
  {
    id: 'budgex',
    name: 'BUDGEX',
    tagline: 'Voice-first expense tracking',
    description:
      'Log expenses by voice from your phone, review insights on the web. Gemma 4 categorizes every entry, monthly budgets keep you accountable, and the dashboard turns spending into patterns.',
    status: 'LIVE',
    color: '#7C3AED',
    iconKey: 'budgex',
    shortFeatures: [
      'Voice logging from mobile',
      'AI categorization',
      'Budget alerts and forecasts',
    ],
    features: [
      { title: 'Voice logging', body: 'Speak an expense from your phone. The mobile app transcribes, parses amount and category, and saves it.' },
      { title: 'AI categorization', body: 'Gemma 4 classifies each expense into Food, Travel, Bills, Shopping, Health, or Others. Manual override any time.' },
      { title: 'Monthly budgets', body: 'Set a budget per category. Progress bars turn amber at 80 percent and red over budget.' },
      { title: 'Subscription tracker', body: 'Recurring charges grouped with due dates, yearly totals, and renewal alerts.' },
      { title: 'Analytics', body: 'Trend lines over six months, category breakdowns, top merchants, and AI-generated insights.' },
    ],
    integrations: ['LIFEX mobile', 'Gemma 4', 'UPI SMS (planned)'],
    howItWorks: [
      { step: 1, title: 'Speak it', body: 'Open the LIFEX mobile app, tap the mic, say "Swiggy 350". BUDGEX parses, categorizes, and saves.' },
      { step: 2, title: 'Review on web', body: 'The web dashboard shows your spend grouped by day, category, and merchant. Filter, search, export.' },
      { step: 3, title: 'Set budgets', body: 'Define a monthly budget per category. BUDGEX tracks progress and alerts before you overrun.' },
    ],
    startingPrice: 199,
  },
  {
    id: 'finex',
    name: 'FINEX',
    tagline: 'Your personal CFO dashboard',
    description:
      'The intelligence layer on top of STAAX, INVEX, and BUDGEX. LIFEX Score quantifies financial health. Daily briefings at 08:30 IST surface what changed overnight. NETEX tracks net worth, GOALEX tracks progress to financial independence.',
    status: 'BUILDING',
    color: '#F59E0B',
    iconKey: 'finex',
    shortFeatures: [
      'LIFEX Score (0 to 100)',
      'Daily AI briefing',
      'Net worth and FI tracking',
    ],
    features: [
      { title: 'LIFEX Score', body: 'A single 0-to-100 score combining financial health, goal progress, and portfolio health. Updated nightly.' },
      { title: 'Daily briefing', body: 'Cron at 08:30 IST — a four-section summary of trading, budget, goals, and one AI cross-module insight.' },
      { title: 'NETEX net worth', body: 'Complete balance sheet. Equity, debt, alternatives, liabilities. Monthly snapshots and growth curve.' },
      { title: 'GOALEX goals and FI', body: 'Track goals with target years and amounts. FI calculator with inflation, years to financial independence, and scenario tests.' },
      { title: 'Cross-module insights', body: 'Correlates trading drawdowns with spending patterns, budget adherence with goal velocity, portfolio moves with net worth.' },
    ],
    integrations: ['STAAX', 'INVEX', 'BUDGEX', 'Manual: EPF, NPS, property, loans'],
    howItWorks: [
      { step: 1, title: 'Aggregate', body: 'FINEX reads from STAAX, INVEX, and BUDGEX APIs. Add manual entries for EPF, NPS, property, and loans.' },
      { step: 2, title: 'Score and brief', body: 'Every night, FINEX computes your LIFEX Score and assembles your morning briefing.' },
      { step: 3, title: 'Plan', body: 'Use GOALEX to sanity-check goal timelines. Stress-test against expense spikes or income loss.' },
    ],
    startingPrice: 799,
  },
  {
    id: 'travex',
    name: 'TRAVEX',
    tagline: 'Travel intelligence with a 3D globe',
    description:
      'Log flights, trains, buses, and road trips on an animated Three.js globe. A travel buddy that cross-references your BUDGEX balance and suggests when and where you can travel next.',
    status: 'LIVE',
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, #38bdf8, #2dd4bf, #34d399)',
    iconKey: 'travex',
    shortFeatures: [
      'Interactive 3D globe',
      'Gmail auto-sync (planned)',
      'AI travel buddy',
    ],
    features: [
      { title: '3D globe', body: 'Three.js globe with animated arcs, country boundaries, and city markers. Drag to rotate, explore your travel history.' },
      { title: 'Trip logging', body: 'Log air, train, bus, or road trips with dates, cost, and notes. Visualized as arcs on the globe in mode-specific colors.' },
      { title: 'Gmail auto-sync', body: 'Parse IndiGo, Air India, SpiceJet, and IRCTC confirmation emails to auto-create trips. Planned for Phase 2.' },
      { title: 'AI travel buddy', body: 'Gemma-powered suggestions that account for your BUDGEX balance, upcoming trips, and historical spending.' },
      { title: 'Stats and timeline', body: 'Year-over-year breakdown, cost totals by mode, cities visited, total distance.' },
    ],
    integrations: ['Google Maps', 'BUDGEX', 'Gmail (planned)', 'IRCTC SMS (planned)'],
    howItWorks: [
      { step: 1, title: 'Log a trip', body: 'Enter origin, destination, mode, date, and cost. TRAVEX adds it to your globe.' },
      { step: 2, title: 'Explore', body: 'Rotate the globe to see where you have been. Filter by mode, year, or cost.' },
      { step: 3, title: 'Plan next', body: 'Ask the travel buddy where you can afford to go next. It knows your budget.' },
    ],
    startingPrice: 149,
  },
  {
    id: 'healthex',
    name: 'HEALTHEX',
    tagline: 'Health tracking for peak performance',
    description:
      'Log workouts, track nutrition, and monitor biomarkers in one place. Integrates with wearables so your health data informs your LIFEX Score alongside financial and lifestyle signals.',
    status: 'COMING_SOON',
    color: '#ef4444',
    iconKey: 'healthex',
    shortFeatures: [
      'Workout and nutrition log',
      'Wearable integration',
      'Biomarker trends',
    ],
    features: [
      { title: 'Workout log', body: 'Strength, cardio, mobility. Template routines or free-form entries.' },
      { title: 'Nutrition tracking', body: 'Food diary with macro and micro breakdown. Indian food database.' },
      { title: 'Wearable sync', body: 'Apple Health, Google Fit, Oura Ring. HRV, resting heart rate, sleep stages.' },
      { title: 'Biomarker trends', body: 'Manual entry for blood work. Track Vitamin D, B12, HbA1c, lipid profile over time.' },
    ],
    integrations: ['Apple Health', 'Google Fit', 'Oura', 'Whoop'],
    howItWorks: [
      { step: 1, title: 'Connect wearable', body: 'One-tap import from Apple Health or Google Fit. Historical data comes with it.' },
      { step: 2, title: 'Log the rest', body: 'Workouts and meals take 10 seconds per entry.' },
      { step: 3, title: 'See patterns', body: 'HEALTHEX correlates sleep with trading performance, nutrition with budget.' },
    ],
    startingPrice: null,
  },
  {
    id: 'histex',
    name: 'HISTEX',
    tagline: 'Historical data and backtesting',
    description:
      'OHLCV data across NSE, BSE, and MCX. Strategy replay engine to backtest your STAAX algos against decades of market data. A personal history archive for trades, decisions, and notes.',
    status: 'COMING_SOON',
    color: '#4488FF',
    iconKey: 'histex',
    shortFeatures: [
      'Historical OHLCV data',
      'Strategy backtesting',
      'Personal decision archive',
    ],
    features: [
      { title: 'OHLCV data', body: 'Minute and daily resolution across NSE, BSE, and MCX. Adjusted for splits and bonuses.' },
      { title: 'Backtest engine', body: 'Replay a STAAX algo against historical data. Slippage, commission, and liquidity modeled.' },
      { title: 'Decision log', body: 'Archive your trades with rationale, emotional state, and lessons learned.' },
      { title: 'Pattern search', body: 'Find historical moments matching current market conditions.' },
    ],
    integrations: ['NSE', 'BSE', 'MCX', 'STAAX'],
    howItWorks: [
      { step: 1, title: 'Pick a strategy', body: 'Select a STAAX algo or define a new one in the backtest editor.' },
      { step: 2, title: 'Run backtest', body: 'HISTEX simulates the strategy over your chosen window. Results in seconds for most cases.' },
      { step: 3, title: 'Archive and annotate', body: 'Save the result with notes. Revisit when similar setups appear live.' },
    ],
    startingPrice: null,
  },
]

export const getModuleById = (id: string): Module | undefined =>
  modules.find((m) => m.id === id)
