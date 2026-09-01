import { Briefcase, Eye, Gauge, PieChart } from 'lucide-react'
import { HOLDINGS, WATCHLIST, computeConcentrationScore } from '../../data/portfolio'
import { getStockMeta } from '../../data/stocks'
import { useApp } from '../../state/AppContext'
import { formatINR, formatSignedPct } from '../../lib/format'
import { Tooltip } from '../common/Tooltip'
import { Sparkline } from '../market/Sparkline'

const VOL_WEIGHT: Record<string, number> = { Low: 1, Medium: 2, High: 3 }

function riskExposureLabel(): { label: string; tone: string } {
  const total = HOLDINGS.reduce((s, h) => s + h.allocationPct, 0)
  const weighted = HOLDINGS.reduce((s, h) => s + (VOL_WEIGHT[getStockMeta(h.symbol).volatility] * h.allocationPct) / total, 0)
  if (weighted < 1.6) return { label: 'Low', tone: 'text-bull-400' }
  if (weighted < 2.35) return { label: 'Moderate', tone: 'text-amber-300' }
  return { label: 'High', tone: 'text-bear-400' }
}

export function PortfolioPanel() {
  const { symbol, setSymbol } = useApp()
  const concentration = computeConcentrationScore(HOLDINGS)
  const risk = riskExposureLabel()

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
      {/* Holdings */}
      <div className="glass-panel rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-base-200">
            <Briefcase className="h-4 w-4 text-signal-400" />
            Your Portfolio
          </h2>
          <span className="text-[11px] text-base-400">Considered when generating recommendations</span>
        </div>

        <div className="space-y-2.5">
          {HOLDINGS.map((h) => {
            const meta = getStockMeta(h.symbol)
            const gainPct = ((h.currentValue - h.costBasis) / h.costBasis) * 100
            const positive = gainPct >= 0
            return (
              <button
                key={h.symbol}
                type="button"
                onClick={() => setSymbol(h.symbol)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                  symbol === h.symbol ? 'border-signal-500/50 bg-signal-500/10' : 'border-base-500/20 bg-base-800/40 hover:border-base-400/40'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-base-100">{meta.name}</p>
                  <p className="text-[10px] text-base-400">{meta.symbol} · {meta.sector}</p>
                </div>
                <div className="w-24 shrink-0">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-700/70">
                    <div className="h-full rounded-full bg-signal-400" style={{ width: `${h.allocationPct}%` }} />
                  </div>
                  <p className="mt-1 text-[10px] font-semibold text-base-300">{h.allocationPct}% alloc.</p>
                </div>
                <div className="w-20 shrink-0 text-right">
                  <p className="mono-tabular text-xs font-bold text-base-100">{formatINR(h.currentValue)}</p>
                  <p className={`mono-tabular text-[10px] font-semibold ${positive ? 'text-bull-400' : 'text-bear-400'}`}>
                    {formatSignedPct(gainPct)}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-base-500/20 pt-4">
          <Tooltip label="Herfindahl-based concentration score — higher means your portfolio is more concentrated in fewer holdings.">
            <div className="flex items-center gap-2">
              <PieChart className="h-3.5 w-3.5 text-base-400" />
              <div>
                <p className="text-[10px] uppercase tracking-wide text-base-400">Concentration</p>
                <p className="mono-tabular text-sm font-bold text-base-100">{concentration}%</p>
              </div>
            </div>
          </Tooltip>
          <Tooltip label="Allocation-weighted volatility exposure across your current holdings.">
            <div className="flex items-center gap-2">
              <Gauge className="h-3.5 w-3.5 text-base-400" />
              <div>
                <p className="text-[10px] uppercase tracking-wide text-base-400">Risk Exposure</p>
                <p className={`text-sm font-bold ${risk.tone}`}>{risk.label}</p>
              </div>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Watchlist */}
      <div className="glass-panel rounded-2xl p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-base-200">
          <Eye className="h-4 w-4 text-signal-400" />
          Watchlist
        </h2>
        <div className="space-y-2">
          {WATCHLIST.map((sym) => {
            const meta = getStockMeta(sym)
            const positive = meta.changePercent >= 0
            return (
              <button
                key={sym}
                type="button"
                onClick={() => setSymbol(sym)}
                className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors ${
                  symbol === sym ? 'border-signal-500/50 bg-signal-500/10' : 'border-base-500/20 bg-base-800/40 hover:border-base-400/40'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-base-100">{meta.symbol}</p>
                  <p className="mono-tabular text-[11px] text-base-400">{formatINR(meta.price)}</p>
                </div>
                <Sparkline data={meta.sparkline} positive={positive} width={64} height={28} />
                <span className={`mono-tabular w-14 shrink-0 text-right text-xs font-bold ${positive ? 'text-bull-400' : 'text-bear-400'}`}>
                  {formatSignedPct(meta.changePercent)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
