import { AlertTriangle } from 'lucide-react'
import { useApp } from '../../state/AppContext'

export function FeedBanner() {
  const { feedStatus } = useApp()
  if (feedStatus !== 'degraded') return null

  return (
    <div className="border-b border-bear-500/30 bg-bear-500/10">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-6 py-2.5 animate-fade-up">
        <AlertTriangle className="h-4 w-4 shrink-0 text-bear-400" />
        <p className="text-xs font-medium text-bear-200">
          <span className="font-bold">Degraded data mode:</span> the NSE Market Data feed is OFFLINE. The Technical agent is
          reasoning from the last cached snapshot and all confidence scores below reflect this uncertainty. Source
          attribution is preserved.
        </p>
      </div>
    </div>
  )
}
