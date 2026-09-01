import { useApp, useStockIntelligence } from '../../state/AppContext'
import { AgentCard } from './AgentCard'

export function AgentGrid() {
  const { agentStatus, feedStatus } = useApp()
  const { agents } = useStockIntelligence()
  const degraded = feedStatus === 'degraded'

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-base-200">Multi-Agent Analysis</h2>
        <p className="text-[11px] text-base-400">Each agent reasons independently over the same market data</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AgentCard kind="technical" analysis={agents.technical} status={agentStatus.technical} degraded={degraded} />
        <AgentCard kind="fundamental" analysis={agents.fundamental} status={agentStatus.fundamental} degraded={degraded} />
        <AgentCard kind="sentiment" analysis={agents.sentiment} status={agentStatus.sentiment} degraded={degraded} />
      </div>
    </section>
  )
}
