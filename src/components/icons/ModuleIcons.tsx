import type { CSSProperties } from 'react'
import type { IconKey } from '@/data/modules'

interface IconProps {
  size?: number
  className?: string
  style?: CSSProperties
}

const base = (size: number): IconProps & { viewBox: string; xmlns: string; width: number; height: number } => ({
  size,
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  xmlns: 'http://www.w3.org/2000/svg',
})

const strokeDefaults = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/* STAAX — stylized candlestick with an upward trend line. */
export const StaaxIcon = ({ size = 24, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    {/* wick + body left */}
    <line x1="6" y1="4.5" x2="6" y2="19.5" {...strokeDefaults} />
    <rect x="4.2" y="9" width="3.6" height="7" fill="currentColor" opacity="0.22" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    {/* wick + body middle */}
    <line x1="12" y1="3" x2="12" y2="21" {...strokeDefaults} />
    <rect x="10.2" y="7" width="3.6" height="9" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    {/* wick + body right */}
    <line x1="18" y1="6" x2="18" y2="18" {...strokeDefaults} />
    <rect x="16.2" y="9.5" width="3.6" height="5.5" fill="currentColor" opacity="0.22" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    {/* upward trend line */}
    <path d="M3 16 L8 12 L13 13.5 L21 5.5" {...strokeDefaults} />
    <path d="M17 5.5 L21 5.5 L21 9.5" {...strokeDefaults} />
  </svg>
)

/* INVEX — ascending bars with arrow. */
export const InvexIcon = ({ size = 24, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    <rect x="3.5" y="15" width="3" height="5" rx="0.6" {...strokeDefaults} />
    <rect x="8.5" y="12" width="3" height="8" rx="0.6" {...strokeDefaults} />
    <rect x="13.5" y="8.5" width="3" height="11.5" rx="0.6" {...strokeDefaults} />
    {/* arrow diagonal */}
    <path d="M4.5 11 L11 7.5 L17 4.5 L20.5 3.5" {...strokeDefaults} />
    <path d="M16.5 3.5 L20.5 3.5 L20.5 7.5" {...strokeDefaults} />
  </svg>
)

/* BUDGEX — wallet with pulse dot. */
export const BudgexIcon = ({ size = 24, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    {/* wallet body */}
    <rect x="3" y="7" width="17" height="13" rx="2.5" {...strokeDefaults} />
    {/* flap fold line */}
    <path d="M3 11 L14.5 11 L14.5 14 L3 14" {...strokeDefaults} />
    {/* coin notch */}
    <circle cx="16" cy="12.5" r="1.2" fill="currentColor" />
    {/* pulse dot upper right */}
    <circle cx="19.5" cy="5" r="1.8" fill="currentColor" opacity="0.9" />
    <circle cx="19.5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35" />
  </svg>
)

/* FINEX — speedometer / gauge. */
export const FinexIcon = ({ size = 24, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    {/* semi-arc */}
    <path d="M3.5 17 A 8.5 8.5 0 0 1 20.5 17" {...strokeDefaults} />
    {/* tick marks */}
    <line x1="5" y1="13.2" x2="6" y2="12.2" {...strokeDefaults} />
    <line x1="9" y1="8.5" x2="9.6" y2="7.2" {...strokeDefaults} />
    <line x1="12" y1="7.2" x2="12" y2="5.8" {...strokeDefaults} />
    <line x1="15" y1="8.5" x2="14.4" y2="7.2" {...strokeDefaults} />
    <line x1="19" y1="13.2" x2="18" y2="12.2" {...strokeDefaults} />
    {/* needle at ~45 deg */}
    <line x1="12" y1="17" x2="16.5" y2="10.5" {...strokeDefaults} />
    {/* center dot */}
    <circle cx="12" cy="17" r="1.4" fill="currentColor" />
  </svg>
)

/* TRAVEX — globe with travel arc. */
export const TravexIcon = ({ size = 24, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    {/* globe */}
    <circle cx="12" cy="13" r="7.5" {...strokeDefaults} />
    {/* equator */}
    <ellipse cx="12" cy="13" rx="7.5" ry="2.8" {...strokeDefaults} />
    {/* meridian */}
    <ellipse cx="12" cy="13" rx="3.2" ry="7.5" {...strokeDefaults} />
    {/* travel arc with plane dot above */}
    <path d="M4.5 5.5 Q 12 0.5 19.5 5.5" {...strokeDefaults} opacity="0.85" />
    <circle cx="14" cy="3.2" r="1.1" fill="currentColor" />
  </svg>
)

/* HEALTHEX — heart with EKG pulse. */
export const HealthexIcon = ({ size = 24, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    {/* heart */}
    <path
      d="M12 20.5 C 6 16 3 12.5 3 8.8 A 4.3 4.3 0 0 1 12 6.8 A 4.3 4.3 0 0 1 21 8.8 C 21 12.5 18 16 12 20.5 Z"
      {...strokeDefaults}
    />
    {/* EKG line across */}
    <path d="M4 13.5 H 8 L 9.5 10.5 L 11.5 16 L 13 12 L 15 14 H 20" {...strokeDefaults} />
  </svg>
)

/* HISTEX — clock with timeline marker. */
export const HistexIcon = ({ size = 24, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    {/* clock face */}
    <circle cx="12" cy="11" r="7" {...strokeDefaults} />
    {/* tick marks (12, 3, 6, 9) */}
    <line x1="12" y1="4.5" x2="12" y2="5.8" {...strokeDefaults} />
    <line x1="18.5" y1="11" x2="17.2" y2="11" {...strokeDefaults} />
    <line x1="12" y1="17.5" x2="12" y2="16.2" {...strokeDefaults} />
    <line x1="5.5" y1="11" x2="6.8" y2="11" {...strokeDefaults} />
    {/* hands at ~10:10 */}
    <line x1="12" y1="11" x2="15.5" y2="8.5" {...strokeDefaults} />
    <line x1="12" y1="11" x2="9" y2="7.5" {...strokeDefaults} />
    <circle cx="12" cy="11" r="0.8" fill="currentColor" />
    {/* timeline notch below */}
    <line x1="4" y1="21" x2="20" y2="21" {...strokeDefaults} />
    <line x1="12" y1="19.5" x2="12" y2="22" {...strokeDefaults} />
  </svg>
)

const iconMap: Record<IconKey, (p: IconProps) => JSX.Element> = {
  staax: StaaxIcon,
  invex: InvexIcon,
  budgex: BudgexIcon,
  finex: FinexIcon,
  travex: TravexIcon,
  healthex: HealthexIcon,
  histex: HistexIcon,
}

export const ModuleIcon = ({ iconKey, ...rest }: IconProps & { iconKey: IconKey }) => {
  const Icon = iconMap[iconKey]
  return <Icon {...rest} />
}
