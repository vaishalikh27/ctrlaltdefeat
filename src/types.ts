export type InvestorProfile = 'conservative' | 'aggressive'

export type Verdict = 'BULLISH' | 'NEUTRAL' | 'BEARISH'

export type AgentKind = 'technical' | 'fundamental' | 'sentiment'

export type AgentStatus = 'idle' | 'analyzing' | 'complete'

export type FeedStatus = 'live' | 'degraded'

export type RecommendationAction = 'BUY' | 'HOLD' | 'AVOID'

export type RiskLevel = 'Low' | 'Moderate' | 'Elevated' | 'High'

export type Volatility = 'Low' | 'Medium' | 'High'

/** A simulated evidence source an agent can cite. */
export interface SourceDef {
  id: string
  label: string
  description: string
}

export interface StockMeta {
  symbol: string
  name: string
  sector: string
  price: number
  changePercent: number
  volumeLabel: string
  volatility: Volatility
  sparkline: number[]
}

export interface AgentEvidence {
  label: string
  value: string
  sourceId: string
}

export interface AgentAnalysis {
  kind: AgentKind
  verdict: Verdict
  confidence: number
  signals: string[]
  evidence: AgentEvidence[]
  reasoningSteps: string[]
  sourceIds: string[]
}

export interface StockIntelligence {
  meta: StockMeta
  agents: Record<AgentKind, AgentAnalysis>
}

export interface Holding {
  symbol: string
  allocationPct: number
  costBasis: number
  currentValue: number
}

export interface RecommendationBreakdown {
  kind: AgentKind
  label: string
  verdict: Verdict
  confidence: number
  weightPct: number
}

export interface Recommendation {
  action: RecommendationAction
  confidence: number
  riskLevel: RiskLevel
  explanation: string
  breakdown: RecommendationBreakdown[]
  degraded: boolean
}

export interface ToastMessage {
  id: string
  tone: 'default' | 'success' | 'warning' | 'danger'
  title: string
  description?: string
}
