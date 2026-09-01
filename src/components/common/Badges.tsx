import { TrendingUp, Minus, TrendingDown } from 'lucide-react'
import type { RecommendationAction, Verdict } from '../../types'

const VERDICT_STYLES: Record<Verdict, string> = {
  BULLISH: 'bg-bull-500/12 text-bull-300 border-bull-500/40',
  NEUTRAL: 'bg-amber-500/12 text-amber-300 border-amber-500/40',
  BEARISH: 'bg-bear-500/12 text-bear-300 border-bear-500/40',
}

const VERDICT_ICON: Record<Verdict, typeof TrendingUp> = {
  BULLISH: TrendingUp,
  NEUTRAL: Minus,
  BEARISH: TrendingDown,
}

export function VerdictBadge({ verdict, className = '' }: { verdict: Verdict; className?: string }) {
  const Icon = VERDICT_ICON[verdict]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${VERDICT_STYLES[verdict]} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
      {verdict}
    </span>
  )
}

const ACTION_STYLES: Record<RecommendationAction, string> = {
  BUY: 'bg-bull-500 text-base-950',
  HOLD: 'bg-amber-500 text-base-950',
  AVOID: 'bg-bear-500 text-base-950',
}

export function ActionBadge({ action, className = '' }: { action: RecommendationAction; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-xl px-4 py-1.5 text-lg font-extrabold tracking-wide shadow-lg ${ACTION_STYLES[action]} ${className}`}>
      {action}
    </span>
  )
}

export function StatusPill({ status }: { status: 'idle' | 'analyzing' | 'complete' }) {
  if (status === 'idle') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-base-500/30 bg-base-700/50 px-2.5 py-1 text-[11px] font-medium text-base-300">
        <span className="h-1.5 w-1.5 rounded-full bg-base-400" />
        IDLE
      </span>
    )
  }
  if (status === 'analyzing') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-500/40 bg-signal-500/10 px-2.5 py-1 text-[11px] font-semibold text-signal-300">
        <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-signal-400" />
        ANALYZING
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-bull-500/40 bg-bull-500/10 px-2.5 py-1 text-[11px] font-semibold text-bull-300">
      <span className="h-1.5 w-1.5 rounded-full bg-bull-400" />
      COMPLETE
    </span>
  )
}
