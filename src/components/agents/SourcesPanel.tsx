import { Database, WifiOff } from 'lucide-react'
import { SOURCE_LIST } from '../../data/sources'
import { useApp } from '../../state/AppContext'

export function SourcesPanel() {
  const { feedStatus } = useApp()

  return (
    <section className="glass-panel rounded-2xl p-5">
      <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-base-200">Sources</h2>
      <p className="mb-4 text-[11px] text-base-400">
        Every agent verdict is grounded in these retrieval sources — explainability over black-box labels.
      </p>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        {SOURCE_LIST.map((source) => {
          const offline = feedStatus === 'degraded' && source.id === 'nse'
          return (
            <div
              key={source.id}
              className={`flex flex-col gap-1.5 rounded-xl border p-3 transition-colors ${
                offline ? 'border-bear-500/40 bg-bear-500/8' : 'border-base-500/25 bg-base-800/40'
              }`}
            >
              <div className="flex items-center justify-between">
                {offline ? <WifiOff className="h-3.5 w-3.5 text-bear-400" /> : <Database className="h-3.5 w-3.5 text-signal-400" />}
                <span
                  className={`text-[9px] font-bold uppercase tracking-wide ${offline ? 'text-bear-400' : 'text-bull-400'}`}
                >
                  {offline ? 'Offline' : 'Online'}
                </span>
              </div>
              <p className="text-xs font-semibold text-base-100">{source.label}</p>
              <p className="text-[11px] leading-snug text-base-400">{source.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
