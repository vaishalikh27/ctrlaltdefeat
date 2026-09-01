import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { AgentKind, AgentStatus, FeedStatus, InvestorProfile, ToastMessage } from '../types'
import { DEFAULT_SYMBOL, getStockMeta } from '../data/stocks'
import { getAgentSet } from '../data/agents'
import { applyFeedDegradation, synthesizeRecommendation } from '../lib/synthesis'

/** Staggered completion delays (ms) so the three agents visibly finish independently, in parallel. */
const AGENT_DELAYS: Record<AgentKind, number> = { technical: 950, fundamental: 1350, sentiment: 1150 }
const SYNTHESIS_DELAY = 550

interface AppContextValue {
  symbol: string
  setSymbol: (symbol: string) => void
  profile: InvestorProfile
  setProfile: (profile: InvestorProfile) => void
  feedStatus: FeedStatus
  simulateFeedFailure: () => void
  restoreFeed: () => void
  agentStatus: Record<AgentKind, AgentStatus>
  synthesisStatus: AgentStatus
  isRunning: boolean
  runAnalysis: () => void
  lastUpdated: Date
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  dismissToast: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [symbol, setSymbolState] = useState(DEFAULT_SYMBOL)
  const [profile, setProfile] = useState<InvestorProfile>('conservative')
  const [feedStatus, setFeedStatus] = useState<FeedStatus>('live')
  const [agentStatus, setAgentStatus] = useState<Record<AgentKind, AgentStatus>>({
    technical: 'idle',
    fundamental: 'idle',
    sentiment: 'idle',
  })
  const [synthesisStatus, setSynthesisStatus] = useState<AgentStatus>('idle')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const timers = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }, [])

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts((prev) => [...prev, { ...toast, id }])
    const t = window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 4200)
    timers.current.push(t)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const runAnalysis = useCallback(() => {
    clearTimers()
    setLastUpdated(new Date())
    setSynthesisStatus('idle')
    setAgentStatus({ technical: 'analyzing', fundamental: 'analyzing', sentiment: 'analyzing' })

    ;(Object.keys(AGENT_DELAYS) as AgentKind[]).forEach((kind) => {
      const t = window.setTimeout(() => {
        setAgentStatus((prev) => ({ ...prev, [kind]: 'complete' }))
      }, AGENT_DELAYS[kind])
      timers.current.push(t)
    })

    const maxDelay = Math.max(...Object.values(AGENT_DELAYS))
    const synthTimer = window.setTimeout(() => {
      setSynthesisStatus('analyzing')
      const t2 = window.setTimeout(() => {
        setSynthesisStatus('complete')
      }, SYNTHESIS_DELAY)
      timers.current.push(t2)
    }, maxDelay + 150)
    timers.current.push(synthTimer)
  }, [clearTimers])

  // Re-run the (simulated) multi-agent pipeline whenever the selected stock changes.
  useEffect(() => {
    runAnalysis()
    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol])

  const setSymbol = useCallback((next: string) => {
    setSymbolState(next)
  }, [])

  const simulateFeedFailure = useCallback(() => {
    setFeedStatus('degraded')
    addToast({
      tone: 'warning',
      title: 'Market data feed degraded',
      description: 'NSE Market Data is now OFFLINE. Agents are falling back to last cached data.',
    })
  }, [addToast])

  const restoreFeed = useCallback(() => {
    setFeedStatus('live')
    setLastUpdated(new Date())
    addToast({
      tone: 'success',
      title: 'Feed restored',
      description: 'NSE Market Data is back online. Recommendations updated with live data.',
    })
  }, [addToast])

  const isRunning = agentStatus.technical === 'analyzing' || agentStatus.fundamental === 'analyzing' || agentStatus.sentiment === 'analyzing'

  const value = useMemo<AppContextValue>(
    () => ({
      symbol,
      setSymbol,
      profile,
      setProfile,
      feedStatus,
      simulateFeedFailure,
      restoreFeed,
      agentStatus,
      synthesisStatus,
      isRunning,
      runAnalysis,
      lastUpdated,
      toasts,
      addToast,
      dismissToast,
    }),
    [symbol, setSymbol, profile, feedStatus, simulateFeedFailure, restoreFeed, agentStatus, synthesisStatus, isRunning, runAnalysis, lastUpdated, toasts, addToast, dismissToast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

/** Convenience hook bundling the derived, ready-to-render intelligence for the selected stock. */
export function useStockIntelligence() {
  const { symbol, profile, feedStatus } = useApp()
  return useMemo(() => {
    const meta = getStockMeta(symbol)
    const rawAgents = getAgentSet(symbol)
    const degraded = feedStatus === 'degraded'
    const displayAgents = {
      technical: applyFeedDegradation(rawAgents.technical, degraded),
      fundamental: applyFeedDegradation(rawAgents.fundamental, degraded),
      sentiment: applyFeedDegradation(rawAgents.sentiment, degraded),
    }
    const recommendation = synthesizeRecommendation(rawAgents, meta, profile, degraded)
    return { meta, agents: displayAgents, recommendation }
  }, [symbol, profile, feedStatus])
}
