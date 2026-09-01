import { BarChart2, Brain, Database, LineChart, MessageSquareText, Target } from 'lucide-react'
import { useApp } from '../../state/AppContext'
import { StatusPill } from '../common/Badges'
import type { AgentStatus } from '../../types'

interface Node {
  id: string
  x: number
  y: number
  title: string
  subtitle: string
  icon: typeof Brain
  status?: AgentStatus
  tone: 'base' | 'signal' | 'bull'
  emphasis?: boolean
}

const EDGES: [string, string][] = [
  ['market', 'technical'],
  ['market', 'fundamental'],
  ['market', 'sentiment'],
  ['technical', 'synthesis'],
  ['fundamental', 'synthesis'],
  ['sentiment', 'synthesis'],
  ['synthesis', 'recommendation'],
]

export function OrchestrationPipeline() {
  const { agentStatus, synthesisStatus, isRunning } = useApp()

  const nodes: Node[] = [
    { id: 'market', x: 50, y: 7, title: 'Market Data', subtitle: 'Price · Filings · News · Flows', icon: Database, tone: 'base' },
    { id: 'technical', x: 15, y: 33, title: 'Technical AI', subtitle: 'Momentum & trend', icon: LineChart, status: agentStatus.technical, tone: 'signal' },
    { id: 'fundamental', x: 50, y: 33, title: 'Fundamental AI', subtitle: 'Financial health', icon: BarChart2, status: agentStatus.fundamental, tone: 'signal' },
    { id: 'sentiment', x: 85, y: 33, title: 'Sentiment AI', subtitle: 'News & flow tone', icon: MessageSquareText, status: agentStatus.sentiment, tone: 'signal' },
    { id: 'synthesis', x: 50, y: 62, title: 'Synthesis Agent', subtitle: 'Weighs & reconciles views', icon: Brain, status: synthesisStatus, tone: 'bull', emphasis: true },
    { id: 'recommendation', x: 50, y: 91, title: 'Personalized Recommendation', subtitle: 'Risk-adjusted for your profile', icon: Target, tone: 'bull', emphasis: true },
  ]

  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]))

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-base-200">Agent Orchestration</h2>
        <p className="text-[11px] text-base-400">Three independent agents run in parallel, then a synthesis layer reconciles them</p>
      </div>

      <div className="relative mt-4 h-[560px] w-full sm:h-[520px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {EDGES.map(([fromId, toId]) => {
            const from = nodeById[fromId]
            const to = nodeById[toId]
            const active = isRunning || (fromId === 'synthesis' && synthesisStatus !== 'idle')
            return (
              <line
                key={`${fromId}-${toId}`}
                x1={from.x}
                y1={from.y + 4.5}
                x2={to.x}
                y2={to.y - 6.5}
                stroke={active ? 'var(--color-signal-400)' : 'var(--color-base-300)'}
                strokeWidth={active ? 0.6 : 0.45}
                strokeDasharray="2.2 1.6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className={active ? 'animate-flow' : ''}
                opacity={active ? 1 : 0.5}
              />
            )
          })}
        </svg>

        {nodes.map((node) => (
          <PipelineNode key={node.id} node={node} />
        ))}
      </div>
    </section>
  )
}

function PipelineNode({ node }: { node: Node }) {
  const Icon = node.icon
  const toneClasses =
    node.tone === 'bull'
      ? 'border-bull-500/40 bg-bull-500/10'
      : node.tone === 'signal'
        ? 'border-signal-500/35 bg-signal-500/8'
        : 'border-base-500/30 bg-base-800/70'
  const iconTone = node.tone === 'bull' ? 'text-bull-400' : node.tone === 'signal' ? 'text-signal-400' : 'text-base-300'

  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <div
        className={`glass-card-hover flex min-w-[132px] flex-col items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-center shadow-lg ${toneClasses} ${
          node.status === 'analyzing' ? 'ring-2 ring-signal-400/50' : ''
        }`}
      >
        <Icon className={`h-4 w-4 ${iconTone} ${node.status === 'analyzing' ? 'animate-pulse-soft' : ''}`} />
        <p className={`whitespace-nowrap text-xs font-bold ${node.emphasis ? 'text-base-100' : 'text-base-200'}`}>{node.title}</p>
        <p className="hidden whitespace-nowrap text-[10px] text-base-400 sm:block">{node.subtitle}</p>
        {node.status && <StatusPill status={node.status} />}
      </div>
    </div>
  )
}
