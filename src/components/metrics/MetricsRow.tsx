import { Clock3, Database, PieChart, Target } from 'lucide-react'
import { useApp, useStockIntelligence } from '../../state/AppContext'
import { HOLDINGS, computeConcentrationScore } from '../../data/portfolio'
import { getAgentSet } from '../../data/agents'
import { Tooltip } from '../common/Tooltip'

export function MetricsRow() {
  const { symbol, feedStatus } = useApp()
  const { agents } = useStockIntelligence()
  // Signal Accuracy is a fixed historical/backtested figure, so it reads from
  // the raw (undegraded) agent data rather than the live-adjusted `agents`.
  const signalAccuracy = getAgentSet(symbol).technical.confidence
  const concentration = computeConcentrationScore(HOLDINGS)
  const sourcesRetrieved = Object.values(agents).reduce((sum, a) => sum + a.evidence.length, 0)
  const latency = feedStatus === 'degraded' ? '2.4s' : '1.9s'

  const metrics = [
    {
      icon: Clock3,
      label: 'Agent Latency',
      value: latency,
      tooltip: 'Wall-clock time for all three agents to finish plus synthesis reconciliation, end to end.',
    },
    {
      icon: Target,
      label: 'Signal Accuracy',
      value: `${signalAccuracy}%`,
      tooltip: 'Historical backtested directional accuracy of the synthesized recommendation over 90 days (simulated).',
    },
    {
      icon: PieChart,
      label: 'Portfolio Concentration',
      value: `${concentration}%`,
      tooltip: 'Herfindahl-based concentration score across your current holdings — higher means less diversified.',
    },
    {
      icon: Database,
      label: 'Sources Retrieved',
      value: String(sourcesRetrieved),
      tooltip: 'Total evidence citations pulled across all three agents for the selected stock.',
    },
  ]

  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((m) => (
        <Tooltip key={m.label} label={m.tooltip}>
          <div className="glass-panel glass-card-hover flex w-full items-center gap-3 rounded-2xl p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-base-500/30 bg-base-800/70">
              <m.icon className="h-4.5 w-4.5 text-signal-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-base-400">{m.label}</p>
              <p className="mono-tabular text-lg font-extrabold text-base-100">{m.value}</p>
            </div>
          </div>
        </Tooltip>
      ))}
    </section>
  )
}
