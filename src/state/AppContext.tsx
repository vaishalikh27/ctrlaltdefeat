import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { AgentAnalysis, AgentKind, AgentSource, AgentStatus, FeedStatus, InvestorProfile, ToastMessage } from '../types'
import { DEFAULT_SYMBOL, getStockMeta } from '../data/stocks'
import { getAgentSet } from '../data/agents'
import { applyFeedDegradation, synthesizeRecommendation } from '../lib/synthesis'
import { analyzeWithAI, isGeminiConfigured } from '../lib/gemini'

const AGENT_KINDS: AgentKind[] = ['technical', 'fundamental', 'sentiment']

/** Staggered completion delays (ms) for the mock-only simulation, so the three agents visibly finish independently. */
const MOCK_AGENT_DELAYS: Record<AgentKind, number> = { technical: 950, fundamental: 1350, sentiment: 1150 }
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
  agentSource: Record<AgentKind, AgentSource>
  agentAnalysis: Record<AgentKind, AgentAnalysis>
  synthesisStatus: AgentStatus
  isRunning: boolean
  isLiveAI: boolean
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
  const [agentSource, setAgentSource] = useState<Record<AgentKind, AgentSource>>({
    technical: 'mock',
    fundamental: 'mock',
    sentiment: 'mock',
  })
  const [agentAnalysis, setAgentAnalysis] = useState<Record<AgentKind, AgentAnalysis>>(() => getAgentSet(DEFAULT_SYMBOL))
  const [synthesisStatus, setSynthesisStatus] = useState<AgentStatus>('idle')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const timers = useRef<number[]>([])
  const runToken = useRef(0)
  const hasWarnedNoKey = useRef(false)
  const liveAI = isGeminiConfigured()

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

  const runMockSimulation = useCallback(() => {
    ;(Object.keys(MOCK_AGENT_DELAYS) as AgentKind[]).forEach((kind) => {
      const t = window.setTimeout(() => {
        setAgentStatus((prev) => ({ ...prev, [kind]: 'complete' }))
      }, MOCK_AGENT_DELAYS[kind])
      timers.current.push(t)
    })
    const maxDelay = Math.max(...Object.values(MOCK_AGENT_DELAYS))
    const synthTimer = window.setTimeout(() => {
      setSynthesisStatus('analyzing')
      const t2 = window.setTimeout(() => setSynthesisStatus('complete'), SYNTHESIS_DELAY)
      timers.current.push(t2)
    }, maxDelay + 150)
    timers.current.push(synthTimer)
  }, [])

  const runLiveAnalysis = useCallback((targetSymbol: string, token: number) => {
    const mockSet = getAgentSet(targetSymbol)

    const calls = AGENT_KINDS.map((kind) =>
      analyzeWithAI(kind, targetSymbol)
        .then((result) => {
          if (runToken.current !== token) return
          setAgentAnalysis((prev) => ({
            ...prev,
            [kind]: {
              ...mockSet[kind],
              verdict: result.verdict,
              confidence: result.confidence,
              signals: result.signals,
              reasoningSteps: result.reasoningSteps,
            },
          }))
          setAgentSource((prev) => ({ ...prev, [kind]: 'ai' }))
        })
        .catch((err) => {
          console.warn(`Gemini call failed for ${kind} agent, falling back to mock data:`, err)
          if (runToken.current !== token) return
          setAgentAnalysis((prev) => ({ ...prev, [kind]: mockSet[kind] }))
          setAgentSource((prev) => ({ ...prev, [kind]: 'mock' }))
        })
        .finally(() => {
          if (runToken.current !== token) return
          setAgentStatus((prev) => ({ ...prev, [kind]: 'complete' }))
        }),
    )

    Promise.allSettled(calls).then(() => {
      if (runToken.current !== token) return
      setSynthesisStatus('analyzing')
      const t = window.setTimeout(() => {
        if (runToken.current === token) setSynthesisStatus('complete')
      }, SYNTHESIS_DELAY)
      timers.current.push(t)
    })
  }, [])

  const runAnalysis = useCallback(() => {
    clearTimers()
    const token = ++runToken.current
    setLastUpdated(new Date())
    setSynthesisStatus('idle')
    setAgentStatus({ technical: 'analyzing', fundamental: 'analyzing', sentiment: 'analyzing' })
    setAgentAnalysis(getAgentSet(symbol))
    setAgentSource({ technical: 'mock', fundamental: 'mock', sentiment: 'mock' })

    if (liveAI) {
      runLiveAnalysis(symbol, token)
    } else {
      if (!hasWarnedNoKey.current) {
        hasWarnedNoKey.current = true
        addToast({
          tone: 'default',
          title: 'Running on built-in mock analysis',
          description: 'Add VITE_GEMINI_API_KEY to .env.local to enable live Gemini-generated agent reasoning.',
        })
      }
      runMockSimulation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, liveAI, clearTimers, runLiveAnalysis, runMockSimulation, addToast])

  // Re-run the multi-agent pipeline whenever the selected stock changes.
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
      agentSource,
      agentAnalysis,
      synthesisStatus,
      isRunning,
      isLiveAI: liveAI,
      runAnalysis,
      lastUpdated,
      toasts,
      addToast,
      dismissToast,
    }),
    [
      symbol,
      setSymbol,
      profile,
      feedStatus,
      simulateFeedFailure,
      restoreFeed,
      agentStatus,
      agentSource,
      agentAnalysis,
      synthesisStatus,
      isRunning,
      liveAI,
      runAnalysis,
      lastUpdated,
      toasts,
      addToast,
      dismissToast,
    ],
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
  const { symbol, profile, feedStatus, agentAnalysis } = useApp()
  return useMemo(() => {
    const meta = getStockMeta(symbol)
    const degraded = feedStatus === 'degraded'
    const displayAgents = {
      technical: applyFeedDegradation(agentAnalysis.technical, degraded),
      fundamental: applyFeedDegradation(agentAnalysis.fundamental, degraded),
      sentiment: applyFeedDegradation(agentAnalysis.sentiment, degraded),
    }
    const recommendation = synthesizeRecommendation(agentAnalysis, meta, profile, degraded)
    return { meta, agents: displayAgents, recommendation }
  }, [symbol, profile, feedStatus, agentAnalysis])
}
