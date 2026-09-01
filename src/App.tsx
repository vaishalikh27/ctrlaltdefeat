import { AppProvider } from './state/AppContext'
import { TopNav } from './components/layout/TopNav'
import { ActionBar } from './components/layout/ActionBar'
import { FeedBanner } from './components/layout/FeedBanner'
import { MarketSnapshot } from './components/market/MarketSnapshot'
import { OrchestrationPipeline } from './components/orchestration/OrchestrationPipeline'
import { AgentGrid } from './components/agents/AgentGrid'
import { SourcesPanel } from './components/agents/SourcesPanel'
import { FinalRecommendation } from './components/recommendation/FinalRecommendation'
import { PortfolioPanel } from './components/portfolio/PortfolioPanel'
import { MetricsRow } from './components/metrics/MetricsRow'
import { ToastViewport } from './components/common/ToastViewport'

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-base-950 text-base-100">
        <TopNav />
        <ActionBar />
        <FeedBanner />

        <main className="mx-auto flex max-w-[1600px] flex-col gap-5 px-6 py-6">
          <MarketSnapshot />
          <OrchestrationPipeline />
          <AgentGrid />
          <SourcesPanel />
          <FinalRecommendation />
          <PortfolioPanel />
          <MetricsRow />

          <footer className="mt-2 pb-6 text-center text-[11px] text-base-500">
            FinSight AI — a hackathon prototype. All market data, filings and sentiment are simulated for demonstration.
          </footer>
        </main>

        <ToastViewport />
      </div>
    </AppProvider>
  )
}

export default App
