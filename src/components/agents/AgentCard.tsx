import { useState } from 'react'
import { BarChart2, ChevronDown, LineChart, ListTree, MessageSquareText, Sparkles } from 'lucide-react'
import type { AgentAnalysis, AgentKind, AgentStatus } from '../../types'
import { ConfidenceBar } from '../common/ConfidenceBar'
import { StatusPill, VerdictBadge } from '../common/Badges'
import { SourceTag } from '../common/SourceTag'
import { Skeleton } from '../common/Skeleton'

const AGENT_META: Record<AgentKind, { title: string; icon: typeof LineChart; blurb: string }> = {
  technical: { title: 'Technical Agent', icon: LineChart, blurb: 'Price action, momentum & volume' },
  fundamental: { title: 'Fundamental Agent', icon: BarChart2, blurb: 'Financial health & earnings quality' },
  sentiment: { title: 'Sentiment Agent', icon: MessageSquareText, blurb: 'News, social & institutional tone' },
}

interface AgentCardProps {
  kind: AgentKind
  analysis: AgentAnalysis
  status: AgentStatus
  degraded: boolean
}

export function AgentCard({ kind, analysis, status, degraded }: AgentCardProps) {
  const [expanded, setExpanded] = useState(false)
  const meta = AGENT_META[kind]
  const Icon = meta.icon
  const isLoading = status === 'analyzing'
  const staleSource = degraded && kind === 'technical'

  return (
    <div className="glass-panel glass-card-hover flex flex-col rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-base-500/30 bg-base-800/70">
            <Icon className="h-4.5 w-4.5 text-signal-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-base-100">{meta.title}</h3>
            <p className="text-[11px] text-base-400">{meta.blurb}</p>
          </div>
        </div>
        <StatusPill status={status} />
      </div>

      {isLoading ? (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      ) : (
        <div className="mt-4 flex flex-1 flex-col animate-fade-up">
          <div className="flex items-center justify-between gap-2">
            <VerdictBadge verdict={analysis.verdict} />
            <span className="mono-tabular text-lg font-extrabold text-base-100">{analysis.confidence}%</span>
          </div>
          <div className="mt-2.5">
            <ConfidenceBar value={analysis.confidence} verdict={analysis.verdict} />
          </div>
          {staleSource && (
            <p className="mt-2 text-[11px] font-medium text-bear-300">⚠ Reasoning from last cached data — live feed offline</p>
          )}

          <ul className="mt-4 space-y-1.5">
            {analysis.signals.map((signal) => (
              <li key={signal} className="flex items-start gap-2 text-xs leading-snug text-base-300">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-base-400" />
                {signal}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {analysis.sourceIds.map((id) => (
              <SourceTag key={id} sourceId={id} offline={degraded && id === 'nse'} />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-base-500/30 py-2 text-xs font-semibold text-base-300 transition-colors hover:border-signal-500/40 hover:text-signal-300"
          >
            {expanded ? 'Hide reasoning' : 'Why? View reasoning'}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>

          {expanded && (
            <div className="mt-4 space-y-4 border-t border-base-500/20 pt-4 animate-fade-up">
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-bull-300">
                  <Sparkles className="h-3 w-3" />
                  Evidence used · source-backed
                </p>
                <div className="space-y-2">
                  {analysis.evidence.map((ev) => (
                    <div key={ev.label} className="flex items-center justify-between gap-2 rounded-lg bg-base-800/50 px-3 py-2 text-xs">
                      <div>
                        <p className="text-base-300">{ev.label}</p>
                        <p className="mono-tabular font-semibold text-base-100">{ev.value}</p>
                      </div>
                      <SourceTag sourceId={ev.sourceId} offline={degraded && ev.sourceId === 'nse'} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-signal-300">
                  <ListTree className="h-3 w-3" />
                  Reasoning chain · AI-generated
                </p>
                <ol className="space-y-2">
                  {analysis.reasoningSteps.map((step, i) => (
                    <li key={step} className="flex gap-2.5 text-xs leading-relaxed text-base-300">
                      <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-base-700/70 text-[10px] font-bold text-base-200">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
