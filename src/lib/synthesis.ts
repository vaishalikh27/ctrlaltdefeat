import type {
  AgentAnalysis,
  AgentKind,
  InvestorProfile,
  Recommendation,
  RecommendationAction,
  RecommendationBreakdown,
  RiskLevel,
  StockMeta,
  Verdict,
} from '../types'

/** How much weight each agent's view carries in the synthesis, per investor profile. */
export const PROFILE_WEIGHTS: Record<InvestorProfile, Record<AgentKind, number>> = {
  conservative: { technical: 0.25, fundamental: 0.45, sentiment: 0.3 },
  aggressive: { technical: 0.45, fundamental: 0.25, sentiment: 0.3 },
}

const AGENT_LABEL: Record<AgentKind, string> = {
  technical: 'Technical',
  fundamental: 'Fundamental',
  sentiment: 'Sentiment',
}

function verdictScore(verdict: Verdict): number {
  if (verdict === 'BULLISH') return 1
  if (verdict === 'BEARISH') return -1
  return 0
}

/** Penalty applied to the NSE-dependent Technical agent when the market feed is degraded. */
export const DEGRADED_CONFIDENCE_PENALTY = 22

export function applyFeedDegradation(agent: AgentAnalysis, degraded: boolean): AgentAnalysis {
  if (!degraded || agent.kind !== 'technical') return agent
  return { ...agent, confidence: Math.max(20, agent.confidence - DEGRADED_CONFIDENCE_PENALTY) }
}

function computeRiskLevel(volatility: StockMeta['volatility'], profile: InvestorProfile, degraded: boolean): RiskLevel {
  const table: Record<StockMeta['volatility'], Record<InvestorProfile, RiskLevel>> = {
    Low: { conservative: 'Moderate', aggressive: 'Low' },
    Medium: { conservative: 'Elevated', aggressive: 'Moderate' },
    High: { conservative: 'High', aggressive: 'Elevated' },
  }
  const base = table[volatility][profile]
  if (!degraded) return base
  const order: RiskLevel[] = ['Low', 'Moderate', 'Elevated', 'High']
  return order[Math.min(order.length - 1, order.indexOf(base) + 1)]
}

function buildExplanation(params: {
  stockName: string
  action: RecommendationAction
  agents: Record<AgentKind, AgentAnalysis>
  profile: InvestorProfile
  degraded: boolean
}): string {
  const { stockName, action, agents, profile, degraded } = params
  const tech = agents.technical
  const fund = agents.fundamental
  const sent = agents.sentiment

  const techFundAligned = tech.verdict === fund.verdict
  const strongPair = techFundAligned && tech.verdict === 'BULLISH'
  const weakPair = techFundAligned && tech.verdict === 'BEARISH'

  let lead: string
  if (strongPair) {
    lead = `Technical momentum and fundamentals on ${stockName} are both positive.`
  } else if (weakPair) {
    lead = `Technical momentum and fundamentals on ${stockName} are both weak.`
  } else {
    lead = `Technical and fundamental signals on ${stockName} are mixed rather than clearly aligned.`
  }

  const sentimentClause =
    sent.verdict === 'BULLISH'
      ? 'Sentiment is also supportive, reinforcing the view.'
      : sent.verdict === 'BEARISH'
        ? 'However, sentiment is running negative, which tempers conviction.'
        : 'However, sentiment remains mixed.'

  let profileTail: string
  if (profile === 'conservative') {
    profileTail =
      action === 'BUY'
        ? 'For a Conservative investor, the system recommends a smaller allocation and monitoring volatility before adding further.'
        : action === 'HOLD'
          ? 'For a Conservative investor, the system recommends holding current exposure and waiting for clearer confirmation.'
          : 'For a Conservative investor, the system recommends avoiding new exposure until the picture is less mixed.'
  } else {
    profileTail =
      action === 'BUY'
        ? 'For an Aggressive investor, the system recommends taking a fuller position to capture near-term momentum.'
        : action === 'HOLD'
          ? 'For an Aggressive investor, the system still recommends holding rather than chasing an unclear setup.'
          : 'Even for an Aggressive investor, conviction is too low across agents to justify new exposure.'
  }

  const degradedTail = degraded
    ? ' Note: the live market feed is currently degraded, so the Technical agent is working from the last cached data and overall confidence has been reduced accordingly.'
    : ''

  return `${lead} ${sentimentClause} ${profileTail}${degradedTail}`
}

export function synthesizeRecommendation(
  agentsRaw: Record<AgentKind, AgentAnalysis>,
  meta: StockMeta,
  profile: InvestorProfile,
  degraded: boolean,
): Recommendation {
  const agents: Record<AgentKind, AgentAnalysis> = {
    technical: applyFeedDegradation(agentsRaw.technical, degraded),
    fundamental: applyFeedDegradation(agentsRaw.fundamental, degraded),
    sentiment: applyFeedDegradation(agentsRaw.sentiment, degraded),
  }
  const weights = PROFILE_WEIGHTS[profile]

  const kinds: AgentKind[] = ['technical', 'fundamental', 'sentiment']
  let score = 0
  let weightedConfidence = 0
  for (const k of kinds) {
    const a = agents[k]
    score += weights[k] * verdictScore(a.verdict) * (a.confidence / 100)
    weightedConfidence += weights[k] * a.confidence
  }

  const anyStrongBear = kinds.some((k) => agents[k].verdict === 'BEARISH' && agents[k].confidence >= 65)

  let action: RecommendationAction
  if (profile === 'conservative') {
    if (score >= 0.3 && !anyStrongBear) action = 'BUY'
    else if (score >= -0.15 && !anyStrongBear) action = 'HOLD'
    else action = 'AVOID'
  } else {
    if (score >= 0.12) action = 'BUY'
    else if (score >= -0.3) action = 'HOLD'
    else action = 'AVOID'
  }

  // Profile-driven confidence framing: conservative investors are penalized more for
  // uncertainty (non-bullish sentiment); aggressive investors get a small momentum bonus.
  let confidence = weightedConfidence
  if (profile === 'conservative') {
    if (agents.sentiment.verdict === 'NEUTRAL') confidence -= 6
    if (agents.sentiment.verdict === 'BEARISH') confidence -= 12
  } else {
    if (agents.technical.verdict === 'BULLISH') confidence += 4
    if (agents.sentiment.verdict === 'BEARISH') confidence -= 5
  }
  if (degraded) confidence -= 8
  confidence = Math.max(15, Math.min(96, Math.round(confidence)))

  const breakdown: RecommendationBreakdown[] = kinds.map((k) => ({
    kind: k,
    label: AGENT_LABEL[k],
    verdict: agents[k].verdict,
    confidence: agents[k].confidence,
    weightPct: Math.round(weights[k] * 100),
  }))

  const explanation = buildExplanation({ stockName: meta.name, action, agents, profile, degraded })
  const riskLevel = computeRiskLevel(meta.volatility, profile, degraded)

  return { action, confidence, riskLevel, explanation, breakdown, degraded }
}
