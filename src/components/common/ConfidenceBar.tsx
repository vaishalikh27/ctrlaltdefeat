import type { Verdict } from '../../types'

const TONE_CLASS: Record<Verdict, string> = {
  BULLISH: 'bg-gradient-to-r from-bull-600 to-bull-400',
  NEUTRAL: 'bg-gradient-to-r from-amber-500 to-amber-300',
  BEARISH: 'bg-gradient-to-r from-bear-600 to-bear-400',
}

export function ConfidenceBar({ value, verdict, animate = true }: { value: number; verdict: Verdict; animate?: boolean }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-base-700/70">
      <div
        className={`h-full rounded-full ${TONE_CLASS[verdict]} ${animate ? 'transition-[width] duration-1000 ease-out' : ''}`}
        style={{ width: `${Math.max(4, Math.min(100, value))}%` }}
      />
    </div>
  )
}
