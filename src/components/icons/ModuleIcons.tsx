import type { CSSProperties } from 'react'
import type { IconKey } from '@/data/modules'

interface IconProps {
  size?: number
  className?: string
  style?: CSSProperties
}

/* ─── STAAX ─── live stock trend line, ups & downs, area fill, pulsing price dot */
export const StaaxIcon = ({ size = 24, className, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
    {/* Chart grid lines */}
    <line x1="2" y1="8"  x2="22" y2="8"  stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.15" strokeDasharray="1.5 2" />
    <line x1="2" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.15" strokeDasharray="1.5 2" />
    <line x1="2" y1="18" x2="22" y2="18" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.15" strokeDasharray="1.5 2" />
    {/*
      Smooth cubic-bezier trend — tells a trading story:
        gentle rise → sharp panic drop → strong recovery →
        small pullback → breakout rally → consolidation → new high
      Path length ≈ 46
    */}
    {/* Area fill — static, always present as chart background */}
    <path
      d="M 2 17
         C 2.8 17 3.2 14 4 14
         C 4.8 14 5.2 18 6 18
         C 6.8 18 7.2 13 8.5 13
         C 9.8 13 10 16 11 15
         C 12 14 12.5 9 14 9
         C 15.5 9 15.5 12 17 11
         C 18.5 10 19 6 21 5.5
         C 21.5 5.5 21.8 6.5 22 6
         L 22 21 L 2 21 Z"
      fill="currentColor" fillOpacity="0.07" />
    {/* Trend line — continuous draw, resets in 1 frame */}
    <path
      d="M 2 17
         C 2.8 17 3.2 14 4 14
         C 4.8 14 5.2 18 6 18
         C 6.8 18 7.2 13 8.5 13
         C 9.8 13 10 16 11 15
         C 12 14 12.5 9 14 9
         C 15.5 9 15.5 12 17 11
         C 18.5 10 19 6 21 5.5
         C 21.5 5.5 21.8 6.5 22 6"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      fill="none" strokeDasharray="46" strokeDashoffset="46">
      <animate attributeName="stroke-dashoffset"
        from="46" to="0" dur="3s" repeatCount="indefinite" calcMode="linear" />
    </path>
    {/* Live price dot */}
    <circle cx="22" cy="6" r="1.5" fill="currentColor">
      <animate attributeName="r"       values="1.5;2.8;1.5" dur="1.8s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0.15;1"    dur="1.8s" repeatCount="indefinite" />
    </circle>
  </svg>
)

/* ─── INVEX ─── portfolio bar chart, bars grow staggered from baseline */
export const InvexIcon = ({ size = 24, className, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
    {/* Baseline */}
    <line x1="2.5" y1="21" x2="21.5" y2="21" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeOpacity="0.28" />
    {/* Bar 1 — left */}
    <rect className="invex-bar-1" x="4" y="10" width="3.5" height="10" rx="0.5"
      fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.5" />
    {/* Bar 2 — tallest, center */}
    <rect className="invex-bar-2" x="10.25" y="6" width="3.5" height="14" rx="0.5"
      fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.5" />
    {/* Bar 3 — right */}
    <rect className="invex-bar-3" x="16.5" y="8" width="3.5" height="12" rx="0.5"
      fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.5" />
    {/* Up arrow above tallest bar */}
    <path className="invex-arrow" d="M 12 5 L 12 3 M 10.5 4.3 L 12 2.8 L 13.5 4.3"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      fill="none" />
  </svg>
)

/* ─── BUDGEX ─── expense receipt — line items appear staggered, total last
   Single 5 s loop, all items synchronized via keyTimes (no begin offsets):
     item-1 → 0.3 s  item-2 → 0.7 s  item-3 → 1.1 s  total → 1.5 s
     all fade 3.5–3.9 s, blank 3.9–5 s, restart
*/
export const BudgexIcon = ({ size = 24, className, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">

    {/* Receipt paper — body + 3-tooth torn bottom */}
    <path
      d="M 6 2 L 18 2 L 18 19.5
         L 16 21.5 L 14 19.5 L 12 21.5 L 10 19.5 L 8 21.5 L 6 19.5
         Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      fill="currentColor" fillOpacity="0.06" />

    {/* ── Expense item 1 (label short + amount right) ── */}
    <g>
      <animate attributeName="opacity"
        values="0;1;1;0;0" keyTimes="0;0.06;0.88;0.95;1"
        dur="4s" repeatCount="indefinite" />
      <line x1="8.5" y1="6.5" x2="13"   y2="6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14.5" y1="6.5" x2="16.5" y2="6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </g>

    {/* ── Expense item 2 ── */}
    <g>
      <animate attributeName="opacity"
        values="0;0;1;1;0;0" keyTimes="0;0.06;0.14;0.88;0.95;1"
        dur="4s" repeatCount="indefinite" />
      <line x1="8.5" y1="10"  x2="13.5"  y2="10"  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14.5" y1="10"  x2="16.5" y2="10"  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </g>

    {/* ── Expense item 3 ── */}
    <g>
      <animate attributeName="opacity"
        values="0;0;0;1;1;0;0" keyTimes="0;0.06;0.14;0.22;0.88;0.95;1"
        dur="4s" repeatCount="indefinite" />
      <line x1="8.5" y1="13.5" x2="12"   y2="13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14.5" y1="13.5" x2="16.5" y2="13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </g>

    {/* ── Divider + Total row ── */}
    <g>
      <animate attributeName="opacity"
        values="0;0;0;0;1;1;0;0" keyTimes="0;0.06;0.14;0.22;0.30;0.88;0.95;1"
        dur="4s" repeatCount="indefinite" />
      {/* divider */}
      <line x1="8" y1="15.5" x2="17" y2="15.5"
        stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" />
      {/* total label */}
      <line x1="8.5" y1="17.5" x2="11"   y2="17.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* currency tick — tiny vertical bar suggests ₹/$ */}
      <line x1="13"  y1="16.8" x2="13"   y2="18.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      {/* total amount — bolder */}
      <line x1="13.8" y1="17.5" x2="16.5" y2="17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </g>

  </svg>
)

/* ─── FINEX ─── CFO silhouette + AI neural crown
   3 AI nodes form a triangle above the head.
   3 data-flow dots travel from each node into the CFO's brain (staggered 0/0.5/1s).
   Nodes pulse in sequence. Connection edges pulse like a live neural net.
*/
export const FinexIcon = ({ size = 24, className, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">

    {/* ── AI neural network edges (triangle: top ↔ left ↔ right) ── */}
    <line x1="12" y1="3.5" x2="6.5" y2="7"
      stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.25">
      <animate attributeName="stroke-opacity" values="0.15;0.65;0.15" dur="2s" repeatCount="indefinite" begin="0.33s" />
    </line>
    <line x1="12" y1="3.5" x2="17.5" y2="7"
      stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.25">
      <animate attributeName="stroke-opacity" values="0.15;0.65;0.15" dur="2s" repeatCount="indefinite" begin="1s" />
    </line>
    <line x1="6.5" y1="7" x2="17.5" y2="7"
      stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.25">
      <animate attributeName="stroke-opacity" values="0.15;0.5;0.15" dur="2s" repeatCount="indefinite" begin="1.5s" />
    </line>

    {/* ── Data-flow dots: AI → CFO head (one per node, staggered) ── */}
    {/* top node  → head top  (12,5.1) → (12,9.2) */}
    <circle r="0.85" fill="currentColor">
      <animateMotion path="M 12 5.1 L 12 9.2" dur="1.5s" repeatCount="indefinite" begin="0s" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.5s" repeatCount="indefinite" begin="0s" />
    </circle>
    {/* left node → head top-left  (7.5,7.8) → (9.8,10.5) */}
    <circle r="0.85" fill="currentColor">
      <animateMotion path="M 7.5 7.8 L 9.8 10.5" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
    </circle>
    {/* right node → head top-right  (16.5,7.8) → (14.2,10.5) */}
    <circle r="0.85" fill="currentColor">
      <animateMotion path="M 16.5 7.8 L 14.2 10.5" dur="1.5s" repeatCount="indefinite" begin="1s" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.5s" repeatCount="indefinite" begin="1s" />
    </circle>

    {/* ── AI nodes ── */}
    {/* top — primary AI node */}
    <circle cx="12" cy="3.5" r="1.6" fill="currentColor" fillOpacity="0.9">
      <animate attributeName="opacity" values="0.45;1;0.45" dur="2s" repeatCount="indefinite" begin="0s" />
    </circle>
    {/* left */}
    <circle cx="6.5" cy="7" r="1.3" fill="currentColor" fillOpacity="0.8">
      <animate attributeName="opacity" values="0.45;1;0.45" dur="2s" repeatCount="indefinite" begin="0.67s" />
    </circle>
    {/* right */}
    <circle cx="17.5" cy="7" r="1.3" fill="currentColor" fillOpacity="0.8">
      <animate attributeName="opacity" values="0.45;1;0.45" dur="2s" repeatCount="indefinite" begin="1.33s" />
    </circle>

    {/* ── CFO — head ── */}
    <circle cx="12" cy="13" r="3"
      stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.07" />

    {/* ── CFO — suit collar (V at neckline) ── */}
    <path d="M 10.5 15.8 L 12 17.5 L 13.5 15.8"
      stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none" />

    {/* ── CFO — shoulders ── */}
    <path d="M 4.5 22 C 4.5 16.5 8.5 15.5 12 15.5 C 15.5 15.5 19.5 16.5 19.5 22"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />

  </svg>
)

/* ─── TRAVEX ─── globe with Indian subcontinent + flight arc Gulf→SE Asia */
export const TravexIcon = ({ size = 24, className, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
    {/* Globe body */}
    <circle cx="12" cy="12" r="9"
      stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
    {/* Latitude grid lines */}
    <ellipse cx="12" cy="12" rx="9" ry="2.8"
      stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.22" fill="none" />
    <ellipse cx="12" cy="10.2" rx="8.1" ry="2.1"
      stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.18" fill="none" />
    {/*
      Indian subcontinent — orthographic projection, center 82°E 22°N, r=9
      Key points (SVG coords):
        Gujarat W  ≈ (10.0, 12.6)   NW corner ≈ (9.9, 11.2)
        Kashmir    ≈ (11.0, 10.4)   Nepal N   ≈ (12.9, 10.8)
        NE tip     ≈ (14.0, 11.5)   Bay coast ≈ (13.5, 12.6)
        SE coast   ≈ (12.9, 13.6)   S tip     ≈ (11.3, 14.7)
        Kerala     ≈ (10.8, 13.4)
    */}
    <path
      d="M 10.0 12.6 L 9.9 11.2 L 11.0 10.4 L 12.9 10.8 L 14.0 11.5
         L 13.5 12.6 L 12.9 13.6 L 11.3 14.7 L 10.8 13.4 Z"
      fill="currentColor" fillOpacity="0.38"
      stroke="currentColor" strokeWidth="0.75" strokeLinejoin="round" />
    {/* Sri Lanka */}
    <circle cx="11.7" cy="15.5" r="0.55" fill="currentColor" fillOpacity="0.5" />
    {/* Dashed flight arc: Gulf (5.5,14) → SE Asia (20,10) over India */}
    <path id="travex-arc" d="M 5.5 14 Q 12 6 20 10"
      stroke="currentColor" strokeWidth="1" strokeLinecap="round"
      strokeDasharray="1.5 2" fill="none" opacity="0.45" />
    {/* Origin dot (Gulf) */}
    <circle cx="5.5" cy="14" r="1.2" fill="currentColor" fillOpacity="0.55" />
    {/* Destination pin (SE Asia) */}
    <circle cx="20" cy="10" r="1.5" fill="currentColor" fillOpacity="0.9" />
    <circle cx="20" cy="10" r="1.5" fill="none" stroke="currentColor" strokeWidth="1"
      className="travex-pin-pulse" />
    {/* Animated airplane along arc */}
    <g>
      <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
        <mpath href="#travex-arc" />
      </animateMotion>
      {/* Plane silhouette: fuselage + wings + tail */}
      <path d="M 0 -1.5 L 0 1.5 M -2.2 0 L 2.2 0 M -1 1.2 L 1 1.2"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </g>
  </svg>
)

/* ─── HEALTHEX ─── heart (CSS pulse) + ECG line (draw animation) */
export const HealthexIcon = ({ size = 24, className, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
    {/* Heart — pulses via CSS class */}
    <path
      className="healthex-heart"
      d="M 12 20.5 C 6 16 3 12.5 3 9 A 4.5 4.5 0 0 1 12 7 A 4.5 4.5 0 0 1 21 9 C 21 12.5 18 16 12 20.5 Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      fill="currentColor" fillOpacity="0.1"
    />
    {/* ECG line — continuous draw, resets in 1 frame (imperceptible) */}
    <path
      d="M 3.5 13 H 7.5 L 9 10 L 11 16.5 L 13 11.5 L 14.5 13.5 H 20.5"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      fill="none" strokeDasharray="26" strokeDashoffset="26"
    >
      <animate attributeName="stroke-dashoffset"
        from="26" to="0" dur="2s" repeatCount="indefinite" calcMode="linear" />
    </path>
  </svg>
)

/* ─── HISTEX ─── clock rewinding counterclockwise (history = going back in time)
   Tick layout (center 12,12  r_outer=8.5  r_major-inner=6.8  r_minor-inner=7.8):
     major @ 0/90/180/270°   minor @ 30/60/120/150/210/240/300/330°
   Hands start at ~10:10 — minute→60°, hour→300°, second→0° — all spin CCW
*/
export const HistexIcon = ({ size = 24, className, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">

    {/* Clock face */}
    <circle cx="12" cy="12" r="9"
      stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.05" />

    {/* ── Major tick marks (12 / 3 / 6 / 9) ── */}
    <line x1="12"   y1="3.5"  x2="12"   y2="5.2"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="20.5" y1="12"   x2="18.8" y2="12"   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12"   y1="20.5" x2="12"   y2="18.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="3.5"  y1="12"   x2="5.2"  y2="12"   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

    {/* ── Minor tick marks (1 / 2 / 4 / 5 / 7 / 8 / 10 / 11) ── */}
    {/* 1 o'clock  30°  */ }
    <line x1="16.25" y1="4.63" x2="15.9"  y2="5.24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55" />
    {/* 2 o'clock  60°  */ }
    <line x1="19.36" y1="7.75" x2="18.76" y2="8.1"  stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55" />
    {/* 4 o'clock 120°  */ }
    <line x1="19.36" y1="16.25" x2="18.76" y2="15.9"  stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55" />
    {/* 5 o'clock 150°  */ }
    <line x1="16.25" y1="19.37" x2="15.9"  y2="18.76" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55" />
    {/* 7 o'clock 210°  */ }
    <line x1="7.75"  y1="19.37" x2="8.1"   y2="18.76" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55" />
    {/* 8 o'clock 240°  */ }
    <line x1="4.64"  y1="16.25" x2="5.24"  y2="15.9"  stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55" />
    {/* 10 o'clock 300° */ }
    <line x1="4.64"  y1="7.75"  x2="5.24"  y2="8.1"   stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55" />
    {/* 11 o'clock 330° */ }
    <line x1="7.75"  y1="4.63"  x2="8.1"   y2="5.24"  stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55" />

    {/* ── Hour hand — short & thick, CCW every 48 s, starts at 10 o'clock (300°) ── */}
    <line x1="12" y1="12" x2="12" y2="7.5"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <animateTransform attributeName="transform" type="rotate"
        from="300 12 12" to="-60 12 12" dur="48s" repeatCount="indefinite" calcMode="linear" />
    </line>

    {/* ── Minute hand — long & medium, CCW every 4 s, starts at 2 o'clock (60°) ── */}
    <line x1="12" y1="12" x2="12" y2="5"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <animateTransform attributeName="transform" type="rotate"
        from="60 12 12" to="-300 12 12" dur="4s" repeatCount="indefinite" calcMode="linear" />
    </line>

    {/* ── Second hand — thin, with counterbalance tail, CCW every 1.5 s ── */}
    <line x1="12" y1="13.8" x2="12" y2="4.2"
      stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7">
      <animateTransform attributeName="transform" type="rotate"
        from="0 12 12" to="-360 12 12" dur="1.5s" repeatCount="indefinite" calcMode="linear" />
    </line>

    {/* Center cap — sits above all hands */}
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />

  </svg>
)

const iconMap: Record<IconKey, (p: IconProps) => JSX.Element> = {
  staax: StaaxIcon, invex: InvexIcon, budgex: BudgexIcon,
  finex: FinexIcon, travex: TravexIcon, healthex: HealthexIcon, histex: HistexIcon,
}

export const ModuleIcon = ({ iconKey, ...rest }: IconProps & { iconKey: IconKey }) => {
  const Icon = iconMap[iconKey]
  return <Icon {...rest} />
}
