import { useState } from 'react'
import { ChevronDown, ShieldAlert, Sparkles, Target } from 'lucide-react'
import { useApp, useStockIntelligence } from '../../state/AppContext'
import { ActionBadge, VerdictBadge } from '../common/Badges'
import { Skeleton } from '../common/Skeleton'

const RISK_TONE: Record<string, string> = {
  Low: 'text-bull-400 border-bull-500/40 bg-bull-500/10',
  Moderate: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
  Elevated: 'text-amber-300 border-amber-500/50 bg-amber-500/15',
  High: 'text-bear-300 border-bear-500/40 bg-bear-500/10',
}

export function FinalRecommendation() {
  const [expanded, setExpanded] = useState(false)
  const { profile, synthesisStatus } = useApp()
  const { meta, recommendation } = useStockIntelligence()
  const loading = synthesisStatus !== 'complete'

  return (
    <section className="glass-panel glass-card-hover relative overflow-hidden rounded-2xl border-bull-500/25 p-6">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-bull-500), transparent 70%)' }}
      />

      <div className="relative flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-bull-400" />
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-base-200">Final Recommendation</h2>
        </div>
        <span className="rounded-full border border-base-500/30 bg-base-800/60 px-3 py-1 text-[11px] font-semibold capitalize text-base-300">
          Personalized for {profile} investor
        </span>
      </div>

      {loading ? (
        <div className="relative mt-5 flex flex-col gap-3">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : (
        <div className="relative mt-5 animate-fade-up">
          <div className="flex flex-wrap items-end gap-6">
            <ActionBadge action={recommendation.action} className="text-2xl" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-base-400">Confidence</p>
              <p className="mono-tabular text-3xl font-extrabold text-base-100">{recommendation.confidence}%</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-base-400">Risk Level</p>
              <span className={`mt-0.5 inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold ${RISK_TONE[recommendation.riskLevel]}`}>
                <ShieldAlert className="h-3.5 w-3.5" />
                {recommendation.riskLevel}
              </span>
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-base-300">“{recommendation.explanation}”</p>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-signal-300 transition-colors hover:text-signal-200"
          >
            <Sparkles className="h-3.5 w-3.5" />
            How did we reach this?
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>

          {expanded && (
            <div className="mt-4 max-w-xl rounded-xl border border-base-500/25 bg-base-900/60 p-4 animate-fade-up">
              <ul className="space-y-2.5">
                {recommendation.breakdown.map((b) => (
                  <li key={b.kind} className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-base-300">
                      {b.label} <span className="text-base-500">({b.weightPct}% weight for {profile})</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <VerdictBadge verdict={b.verdict} />
                      <span className="mono-tabular font-bold text-base-100">{b.confidence}%</span>
                    </span>
                  </li>
                ))}
                <li className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-base-300">Risk Profile</span>
                  <span className="font-bold capitalize text-base-100">{profile}</span>
                </li>
              </ul>
              <div className="my-3 flex items-center gap-2 text-base-500">
                <div className="h-px flex-1 bg-base-500/30" />
                <ChevronDown className="h-3.5 w-3.5" />
                <div className="h-px flex-1 bg-base-500/30" />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-bull-500/10 px-3 py-2.5">
                <span className="text-xs font-bold text-base-100">Final Decision · {meta.symbol}</span>
                <ActionBadge action={recommendation.action} className="text-sm" />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
