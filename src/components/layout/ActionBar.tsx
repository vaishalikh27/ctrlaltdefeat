import { PlayCircle, WifiOff, Wifi, Loader2 } from 'lucide-react'
import { useApp } from '../../state/AppContext'

export function ActionBar() {
  const { feedStatus, simulateFeedFailure, restoreFeed, runAnalysis, isRunning } = useApp()

  return (
    <div className="border-b border-base-500/15 bg-base-900/40">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-6 py-2.5">
        <p className="text-xs text-base-400">
          Multi-agent pipeline running on <span className="font-semibold text-base-200">simulated</span> NSE-style market
          data, regulatory filings and sentiment feeds.
        </p>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={runAnalysis}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 rounded-lg border border-signal-500/40 bg-signal-500/10 px-3 py-1.5 text-xs font-semibold text-signal-300 transition-colors hover:bg-signal-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlayCircle className="h-3.5 w-3.5" />}
            {isRunning ? 'Analyzing…' : 'Run Analysis'}
          </button>

          {feedStatus === 'live' ? (
            <button
              type="button"
              onClick={simulateFeedFailure}
              className="inline-flex items-center gap-1.5 rounded-lg border border-bear-500/40 bg-bear-500/10 px-3 py-1.5 text-xs font-semibold text-bear-300 transition-colors hover:bg-bear-500/20"
            >
              <WifiOff className="h-3.5 w-3.5" />
              Simulate Feed Failure
            </button>
          ) : (
            <button
              type="button"
              onClick={restoreFeed}
              className="inline-flex items-center gap-1.5 rounded-lg border border-bull-500/40 bg-bull-500/10 px-3 py-1.5 text-xs font-semibold text-bull-300 transition-colors hover:bg-bull-500/20"
            >
              <Wifi className="h-3.5 w-3.5" />
              Restore Feed
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
