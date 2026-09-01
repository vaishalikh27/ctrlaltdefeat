import { Activity, BarChart3, FlaskConical, Gauge } from 'lucide-react'
import { useApp, useStockIntelligence } from '../../state/AppContext'
import { formatINR, formatSignedPct } from '../../lib/format'
import { Sparkline } from './Sparkline'
import { VerdictBadge } from '../common/Badges'
import { Tooltip } from '../common/Tooltip'
import type { Verdict } from '../../types'

function overallSignal(agents: ReturnType<typeof useStockIntelligence>['agents']): Verdict {
  const scores = { BULLISH: 0, NEUTRAL: 0, BEARISH: 0 }
  Object.values(agents).forEach((a) => {
    scores[a.verdict] += 1
  })
  if (scores.BULLISH > scores.BEARISH && scores.BULLISH >= scores.NEUTRAL) return 'BULLISH'
  if (scores.BEARISH > scores.BULLISH && scores.BEARISH >= scores.NEUTRAL) return 'BEARISH'
  return 'NEUTRAL'
}

export function MarketSnapshot() {
  const { feedStatus } = useApp()
  const { meta, agents } = useStockIntelligence()
  const signal = overallSignal(agents)
  const positive = meta.changePercent >= 0
  const degraded = feedStatus === 'degraded'

  return (
    <section className="glass-panel glass-card-hover rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-base-100">{meta.name}</h2>
              <span className="rounded border border-base-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-base-300">
                {meta.symbol}
              </span>
            </div>
            <p className="text-xs text-base-400">{meta.sector}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FlaskConical className="h-3.5 w-3.5 text-base-400" />
          <span className="text-[11px] font-medium uppercase tracking-wide text-base-400">
            Simulated demo data{degraded ? ' · stale snapshot' : ''}
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-5 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
        <div className="flex items-center gap-4">
          <div>
            <p className="mono-tabular text-3xl font-extrabold text-base-100">{formatINR(meta.price)}</p>
            <p className={`mono-tabular text-sm font-semibold ${positive ? 'text-bull-400' : 'text-bear-400'}`}>
              {formatSignedPct(meta.changePercent)} today
            </p>
          </div>
          <Sparkline data={meta.sparkline} positive={positive} className="hidden sm:block" />
        </div>

        <Metric icon={BarChart3} label="Volume" value={meta.volumeLabel} tooltip="Total shares traded today across NSE order books (simulated)." />
        <Metric icon={Activity} label="Volatility" value={meta.volatility} tooltip="30-day annualized price volatility bucket." />
        <Metric
          icon={Gauge}
          label="Data Freshness"
          value={degraded ? 'Stale (cached)' : 'Real-time'}
          tone={degraded ? 'bear' : 'bull'}
          tooltip={degraded ? 'Live feed is offline; showing the last cached snapshot.' : 'Feed is live and updating normally.'}
        />

        <div className="flex flex-col items-start justify-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-base-400">Overall Signal</span>
          <VerdictBadge verdict={signal} />
        </div>
      </div>
    </section>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  tooltip,
  tone,
}: {
  icon: typeof Activity
  label: string
  value: string
  tooltip: string
  tone?: 'bull' | 'bear'
}) {
  return (
    <Tooltip label={tooltip}>
      <div className="flex flex-col gap-1.5">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-base-400">
          <Icon className="h-3 w-3" />
          {label}
        </span>
        <span
          className={`mono-tabular text-lg font-bold ${tone === 'bull' ? 'text-bull-400' : tone === 'bear' ? 'text-bear-400' : 'text-base-100'}`}
        >
          {value}
        </span>
      </div>
    </Tooltip>
  )
}
