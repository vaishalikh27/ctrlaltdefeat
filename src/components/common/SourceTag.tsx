import { Database, WifiOff } from 'lucide-react'
import { SOURCES } from '../../data/sources'
import { Tooltip } from './Tooltip'

export function SourceTag({ sourceId, offline = false }: { sourceId: string; offline?: boolean }) {
  const source = SOURCES[sourceId]
  if (!source) return null

  return (
    <Tooltip label={source.description}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
          offline
            ? 'border-bear-500/40 bg-bear-500/10 text-bear-300'
            : 'border-base-500/30 bg-base-800/60 text-base-200 hover:border-signal-500/40 hover:text-signal-300'
        }`}
      >
        {offline ? <WifiOff className="h-3 w-3" /> : <Database className="h-3 w-3" />}
        {source.label}
        {offline && <span className="font-bold uppercase tracking-wide">· Offline</span>}
      </span>
    </Tooltip>
  )
}
