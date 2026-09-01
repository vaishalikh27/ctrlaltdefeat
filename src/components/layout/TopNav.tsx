import { ChevronDown, Radio, Sparkles } from 'lucide-react'
import { useApp } from '../../state/AppContext'
import { STOCKS } from '../../data/stocks'
import { formatTime } from '../../lib/format'
import type { InvestorProfile } from '../../types'

export function TopNav() {
  const { symbol, setSymbol, profile, setProfile, feedStatus, lastUpdated } = useApp()

  return (
    <header className="sticky top-0 z-40 border-b border-base-500/20 bg-base-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-3 px-6 py-3.5">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-bull-500 to-bull-700 shadow-lg shadow-bull-500/20">
            <Sparkles className="h-5 w-5 text-base-950" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-base-100">FinSight AI</h1>
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-base-300">Autonomous Financial Intelligence</p>
          </div>
        </div>

        <div className="hidden h-8 w-px bg-base-500/25 md:block" />

        {/* Stock selector */}
        <div className="relative">
          <select
            aria-label="Select stock"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="glass-panel cursor-pointer appearance-none rounded-lg py-2 pl-3.5 pr-9 text-sm font-semibold text-base-100 outline-none transition-colors hover:border-base-300/40 focus:border-signal-500/50"
          >
            {STOCKS.map((s) => (
              <option key={s.symbol} value={s.symbol} className="bg-base-900 text-base-100">
                {s.name} · {s.symbol}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-300" />
        </div>

        {/* Investor profile toggle */}
        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-medium uppercase tracking-wide text-base-300 sm:inline">Investor Profile</span>
          <ProfileToggle profile={profile} onChange={setProfile} />
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Radio className={`h-3.5 w-3.5 ${feedStatus === 'live' ? 'text-bull-400 animate-pulse-soft' : 'text-bear-400'}`} />
            <span className={`text-xs font-bold tracking-wide ${feedStatus === 'live' ? 'text-bull-400' : 'text-bear-400'}`}>
              {feedStatus === 'live' ? 'SIMULATED · LIVE' : 'DEGRADED'}
            </span>
          </div>
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-[10px] uppercase tracking-wide text-base-400">Last updated</p>
            <p className="mono-tabular text-xs font-medium text-base-200">{formatTime(lastUpdated)}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

function ProfileToggle({ profile, onChange }: { profile: InvestorProfile; onChange: (p: InvestorProfile) => void }) {
  return (
    <div className="glass-panel relative flex rounded-lg p-1 text-xs font-bold">
      {(['conservative', 'aggressive'] as InvestorProfile[]).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`relative z-10 rounded-md px-3 py-1.5 capitalize transition-colors duration-200 ${
            profile === p ? 'text-base-950' : 'text-base-300 hover:text-base-100'
          }`}
        >
          {profile === p && (
            <span
              className={`absolute inset-0 -z-10 rounded-md ${p === 'conservative' ? 'bg-signal-400' : 'bg-amber-400'}`}
              style={{ animation: 'fade-up 0.2s ease' }}
            />
          )}
          {p}
        </button>
      ))}
    </div>
  )
}
