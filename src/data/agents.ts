import type { AgentAnalysis, AgentKind } from '../types'

type AgentSet = Record<AgentKind, AgentAnalysis>

/**
 * Derived from Stock Data.txt. That file gives one flat record per stock
 * (price, rsi, change30d, volumeNote, filing, headline, signalAccuracy) —
 * not separate per-agent scores. Mapping used here, applied uniformly:
 *   - Technical verdict  <- rsi + change30d (rsi>=60 & change>0 -> BULLISH;
 *     rsi<=45 or change<=-5 -> BEARISH; else NEUTRAL)
 *   - Fundamental verdict <- tone of the `filing` text
 *   - Sentiment verdict   <- tone of the `headline` text
 *   - Confidence for all three agents = that stock's `signalAccuracy`,
 *     reused as-is (no fabricated numbers)
 * Evidence values (RSI, 30-day change, volume note, filing, headline) are
 * quoted verbatim from the source file.
 */
export const AGENT_DATA: Record<string, AgentSet> = {
  RELIANCE: {
    technical: {
      kind: 'technical',
      verdict: 'BULLISH',
      confidence: 71,
      signals: [
        'RSI at 68 signals strong bullish momentum',
        '30-day price up 12.4%, confirming an uptrend',
        'Volume running 2.3x above the 90-day average',
      ],
      evidence: [
        { label: 'RSI (14-day)', value: '68 — Strong', sourceId: 'nse' },
        { label: '30-Day Price Change', value: '+12.4%', sourceId: 'nse' },
        { label: 'Volume Activity', value: 'Volume 2.3x above 90-day average', sourceId: 'nse' },
      ],
      reasoningSteps: [
        'Pulled RSI, 30-day price change and volume activity from the NSE feed.',
        'An RSI of 68 alongside a 12.4% rally indicates sustained buying pressure rather than a short-lived spike.',
        'Volume running well above average confirms the move is backed by real participation.',
      ],
      sourceIds: ['nse'],
    },
    fundamental: {
      kind: 'fundamental',
      verdict: 'BULLISH',
      confidence: 71,
      signals: [
        'Revenue grew 8.4% YoY to Rs 2.41 lakh cr',
        'Operating margin improved 120 bps to 14.2%',
        'Jio ARPU rose to Rs 195, showing telecom monetization gains',
      ],
      evidence: [
        {
          label: 'Quarterly Filing Summary',
          value: 'Q3 FY26 filing: consolidated revenue up 8.4% YoY to Rs 2.41 lakh cr. Operating margin improved 120 bps to 14.2%. Jio ARPU rose to Rs 195.',
          sourceId: 'earnings',
        },
      ],
      reasoningSteps: [
        'Parsed the Q3 FY26 filing for revenue, margin and segment KPIs.',
        'Revenue growth paired with margin expansion signals improving operating efficiency, not just top-line growth.',
        'Rising Jio ARPU adds a second, independent growth driver alongside the core energy and retail business.',
      ],
      sourceIds: ['earnings'],
    },
    sentiment: {
      kind: 'sentiment',
      verdict: 'BULLISH',
      confidence: 71,
      signals: [
        'Rs 75,000 cr green energy capex signals long-term growth ambition',
        'Headline coverage frames the announcement positively',
        'Large-scale capex commitment reinforces investor confidence',
      ],
      evidence: [
        { label: 'Latest Headline', value: 'Reliance announces Rs 75,000 cr green energy capex over three years', sourceId: 'news' },
      ],
      reasoningSteps: [
        'Scored the latest headline for tone and market framing.',
        'A large forward-looking capex announcement is typically read as a confidence signal by the market.',
        'No offsetting negative coverage was found alongside this headline.',
      ],
      sourceIds: ['news'],
    },
  },

  TCS: {
    technical: {
      kind: 'technical',
      verdict: 'BULLISH',
      confidence: 74,
      signals: [
        'RSI at 64 reflects healthy bullish momentum',
        '30-day price up 6.7%',
        'Volume 35% above the 90-day average confirms participation',
      ],
      evidence: [
        { label: 'RSI (14-day)', value: '64 — Bullish', sourceId: 'nse' },
        { label: '30-Day Price Change', value: '+6.7%', sourceId: 'nse' },
        { label: 'Volume Activity', value: 'Volume 35% above 90-day average', sourceId: 'nse' },
      ],
      reasoningSteps: [
        'Pulled RSI, 30-day price change and volume activity from the NSE feed.',
        'An RSI of 64 with a steady 6.7% rally reflects controlled, healthy momentum rather than a blow-off move.',
        'Above-average volume corroborates the trend.',
      ],
      sourceIds: ['nse'],
    },
    fundamental: {
      kind: 'fundamental',
      verdict: 'BULLISH',
      confidence: 74,
      signals: [
        'Revenue up 5.8% YoY on cloud and AI transformation demand',
        'Operating margin held stable at 24.6% despite cost pressure',
        'Deal momentum concentrated in high-value transformation work',
      ],
      evidence: [
        {
          label: 'Quarterly Filing Summary',
          value: 'Q3 FY26 revenue increased 5.8% YoY, supported by growth in cloud and AI transformation deals. Operating margin remained stable at 24.6% despite higher employee costs.',
          sourceId: 'earnings',
        },
      ],
      reasoningSteps: [
        'Parsed the Q3 FY26 filing for revenue drivers and margin trend.',
        'Margin held stable even against rising employee costs, indicating pricing power on transformation deals.',
        'Growth concentrated in cloud/AI work points to a durable, higher-value demand mix.',
      ],
      sourceIds: ['earnings'],
    },
    sentiment: {
      kind: 'sentiment',
      verdict: 'BULLISH',
      confidence: 74,
      signals: [
        'Major multi-year AI transformation contract win from a global banking client',
        'Headline signals continued large-deal momentum',
        'Positive framing reinforces confidence in the demand pipeline',
      ],
      evidence: [
        { label: 'Latest Headline', value: 'TCS secures major multi-year AI transformation contract from global banking client', sourceId: 'news' },
      ],
      reasoningSteps: [
        'Scored the latest headline for tone and deal significance.',
        'A large multi-year contract win is a strong, unambiguous positive signal.',
        'No offsetting negative coverage was found alongside this headline.',
      ],
      sourceIds: ['news'],
    },
  },

  INFY: {
    technical: {
      kind: 'technical',
      verdict: 'BEARISH',
      confidence: 68,
      signals: [
        'RSI at 42 signals weakening momentum',
        '30-day price down 4.6%',
        'Volume 18% below average shows fading participation',
      ],
      evidence: [
        { label: 'RSI (14-day)', value: '42 — Weak', sourceId: 'nse' },
        { label: '30-Day Price Change', value: '-4.6%', sourceId: 'nse' },
        { label: 'Volume Activity', value: 'Volume 18% below 90-day average', sourceId: 'nse' },
      ],
      reasoningSteps: [
        'Pulled RSI, 30-day price change and volume activity from the NSE feed.',
        'An RSI of 42 combined with a 4.6% decline points to weakening rather than stabilizing momentum.',
        'Below-average volume suggests limited conviction on either side, but the trend is down.',
      ],
      sourceIds: ['nse'],
    },
    fundamental: {
      kind: 'fundamental',
      verdict: 'NEUTRAL',
      confidence: 68,
      signals: [
        'Revenue growth slowed on weaker discretionary spending',
        'Full-year guidance maintained despite the slowdown',
        'Large deal conversion timelines remain under pressure',
      ],
      evidence: [
        {
          label: 'Quarterly Filing Summary',
          value: 'Q3 FY26 revenue growth slowed due to weaker discretionary technology spending in key markets. Management maintained full-year guidance but noted continued pressure on large deal conversion timelines.',
          sourceId: 'earnings',
        },
      ],
      reasoningSteps: [
        'Parsed the Q3 FY26 filing for revenue trend and management commentary.',
        'A slowdown in discretionary spending is a genuine headwind, but maintained guidance tempers the concern.',
        'Balanced positive and negative signals nets out to a neutral fundamental read.',
      ],
      sourceIds: ['earnings'],
    },
    sentiment: {
      kind: 'sentiment',
      verdict: 'BEARISH',
      confidence: 68,
      signals: [
        'Hiring plans revised amid cautious client spending',
        'Headline reflects a defensive, cost-conscious posture',
        'Coverage tone leans cautious rather than confident',
      ],
      evidence: [
        { label: 'Latest Headline', value: 'Infosys revises near-term hiring plans amid cautious client spending', sourceId: 'news' },
      ],
      reasoningSteps: [
        'Scored the latest headline for tone and forward-looking signal.',
        'Revising hiring plans is typically read as a defensive move tied to softer demand expectations.',
        'The framing leans cautious rather than reassuring.',
      ],
      sourceIds: ['news'],
    },
  },

  HDFCBANK: {
    technical: {
      kind: 'technical',
      verdict: 'NEUTRAL',
      confidence: 72,
      signals: [
        'RSI at 55 sits in a neutral mid-range band',
        '30-day price change modest at +3.2%',
        'Volume trading near its 90-day average, no breakout signal',
      ],
      evidence: [
        { label: 'RSI (14-day)', value: '55 — Neutral', sourceId: 'nse' },
        { label: '30-Day Price Change', value: '+3.2%', sourceId: 'nse' },
        { label: 'Volume Activity', value: 'Volume near 90-day average', sourceId: 'nse' },
      ],
      reasoningSteps: [
        'Pulled RSI, 30-day price change and volume activity from the NSE feed.',
        'An RSI of 55 with a modest 3.2% gain shows no strong directional conviction.',
        'Volume in line with average confirms there is no breakout to confirm a trend either way.',
      ],
      sourceIds: ['nse'],
    },
    fundamental: {
      kind: 'fundamental',
      verdict: 'BULLISH',
      confidence: 72,
      signals: [
        'Net interest income grew 9.1% YoY',
        'Loan growth remained healthy across segments',
        'Net interest margin under mild pressure from higher funding costs',
      ],
      evidence: [
        {
          label: 'Quarterly Filing Summary',
          value: 'Q3 FY26 net interest income grew 9.1% YoY while loan growth remained healthy. Net interest margin faced mild pressure due to higher funding costs.',
          sourceId: 'earnings',
        },
      ],
      reasoningSteps: [
        'Parsed the Q3 FY26 filing for core banking metrics.',
        'Double-digit-adjacent NII growth with healthy loan growth outweighs the mild margin pressure noted.',
        'Funding-cost pressure is flagged as a watch item rather than a structural concern.',
      ],
      sourceIds: ['earnings'],
    },
    sentiment: {
      kind: 'sentiment',
      verdict: 'NEUTRAL',
      confidence: 72,
      signals: [
        'Headline reports steady, factual credit growth',
        'Coverage tone is even rather than strongly positive or negative',
        'No standout catalyst in recent news flow',
      ],
      evidence: [
        { label: 'Latest Headline', value: 'HDFC Bank reports steady credit growth across retail and corporate segments', sourceId: 'news' },
      ],
      reasoningSteps: [
        'Scored the latest headline for tone.',
        'The language is descriptive and factual rather than promotional or alarming.',
        'Classified as neutral in the absence of a clear directional catalyst.',
      ],
      sourceIds: ['news'],
    },
  },

  TATAMOTORS: {
    technical: {
      kind: 'technical',
      verdict: 'BEARISH',
      confidence: 66,
      signals: [
        'RSI at 29 signals oversold conditions',
        '30-day price down 8.2% on a confirmed downtrend',
        'Volume spiked 2.7x above average during the sell-off',
      ],
      evidence: [
        { label: 'RSI (14-day)', value: '29 — Oversold', sourceId: 'nse' },
        { label: '30-Day Price Change', value: '-8.2%', sourceId: 'nse' },
        { label: 'Volume Activity', value: 'Volume spike 2.7x above average during sell-off', sourceId: 'nse' },
      ],
      reasoningSteps: [
        'Pulled RSI, 30-day price change and volume activity from the NSE feed.',
        'An RSI of 29 with an 8.2% decline confirms a genuine downtrend rather than noise.',
        'A 2.7x volume spike during the decline indicates active, high-conviction selling.',
      ],
      sourceIds: ['nse'],
    },
    fundamental: {
      kind: 'fundamental',
      verdict: 'BEARISH',
      confidence: 66,
      signals: [
        'Operating margins declined on rising input costs',
        'Demand softened in selected international markets',
        'Management flagged continued margin pressure and cautious guidance',
      ],
      evidence: [
        {
          label: 'Quarterly Filing Summary',
          value: 'Q3 FY26 revenue remained broadly stable, but operating margins declined due to rising input costs and weaker demand in selected international markets. Management flagged continued margin pressure and cautious near-term guidance.',
          sourceId: 'earnings',
        },
      ],
      reasoningSteps: [
        'Parsed the Q3 FY26 filing for margin trend and management guidance.',
        'Stable revenue could not offset declining margins driven by costs and softer international demand.',
        'Management explicitly flagging continued pressure and cautious guidance reinforces a bearish fundamental read.',
      ],
      sourceIds: ['earnings'],
    },
    sentiment: {
      kind: 'sentiment',
      verdict: 'BEARISH',
      confidence: 66,
      signals: [
        'Headline highlights margin concerns directly',
        'Coverage frames rising costs and slower demand negatively',
        'Tone aligns with the broader sell-off in the stock',
      ],
      evidence: [
        { label: 'Latest Headline', value: 'Tata Motors faces margin concerns amid rising costs and slower global demand', sourceId: 'news' },
      ],
      reasoningSteps: [
        'Scored the latest headline for tone.',
        'The framing centers on cost and demand concerns with no offsetting positive angle.',
        'Sentiment aligns with the weak technical and fundamental picture.',
      ],
      sourceIds: ['news'],
    },
  },

  ZOMATO: {
    technical: {
      kind: 'technical',
      verdict: 'BULLISH',
      confidence: 78,
      signals: [
        'RSI at 76 shows strong, though overbought, momentum',
        '30-day price up 14.8% on a sharp rally',
        'Volume spiked 3.4x on the back of strong results',
      ],
      evidence: [
        { label: 'RSI (14-day)', value: '76 — Overbought', sourceId: 'nse' },
        { label: '30-Day Price Change', value: '+14.8%', sourceId: 'nse' },
        { label: 'Volume Activity', value: 'Volume spike 3.4x on strong quarterly results', sourceId: 'nse' },
      ],
      reasoningSteps: [
        'Pulled RSI, 30-day price change and volume activity from the NSE feed.',
        'A 14.8% rally on 3.4x volume confirms a results-driven breakout with real participation.',
        'RSI of 76 is overbought, a mild caution flag even within an otherwise strong bullish read.',
      ],
      sourceIds: ['nse'],
    },
    fundamental: {
      kind: 'fundamental',
      verdict: 'BULLISH',
      confidence: 78,
      signals: [
        'Revenue grew 28.6% YoY on higher order volumes',
        'Quick-commerce expansion is a key growth driver',
        'EBITDA margin improved despite rising opex from expansion',
      ],
      evidence: [
        {
          label: 'Quarterly Filing Summary',
          value: 'Q3 FY26 revenue grew 28.6% YoY, driven by higher order volumes and quick-commerce expansion. EBITDA margin improved, although aggressive expansion continues to increase operating expenditure.',
          sourceId: 'earnings',
        },
      ],
      reasoningSteps: [
        'Parsed the Q3 FY26 filing for growth and profitability trend.',
        'Margin improvement alongside 28.6% growth shows the business is scaling efficiently, not just growing revenue.',
        'Rising opex from expansion is a normal trade-off at this growth stage rather than a red flag.',
      ],
      sourceIds: ['earnings'],
    },
    sentiment: {
      kind: 'sentiment',
      verdict: 'BULLISH',
      confidence: 78,
      signals: [
        'Headline confirms strong growth momentum',
        'Quick-commerce narrative gaining market attention',
        'Coverage tone is clearly positive',
      ],
      evidence: [
        { label: 'Latest Headline', value: 'Zomato reports strong growth as quick-commerce business gains momentum', sourceId: 'news' },
      ],
      reasoningSteps: [
        'Scored the latest headline for tone.',
        'The language directly emphasizes strength and momentum with no hedging.',
        'Sentiment is fully aligned with the technical and fundamental picture.',
      ],
      sourceIds: ['news'],
    },
  },

  SBIN: {
    technical: {
      kind: 'technical',
      verdict: 'BULLISH',
      confidence: 75,
      signals: [
        'RSI at 66 reflects solid bullish momentum',
        '30-day price up 7.9%',
        'Volume 1.8x above average supports the move',
      ],
      evidence: [
        { label: 'RSI (14-day)', value: '66 — Bullish', sourceId: 'nse' },
        { label: '30-Day Price Change', value: '+7.9%', sourceId: 'nse' },
        { label: 'Volume Activity', value: 'Volume 1.8x above 90-day average', sourceId: 'nse' },
      ],
      reasoningSteps: [
        'Pulled RSI, 30-day price change and volume activity from the NSE feed.',
        'An RSI of 66 with a 7.9% gain reflects steady, confirmed buying interest.',
        'Above-average volume supports the durability of the move.',
      ],
      sourceIds: ['nse'],
    },
    fundamental: {
      kind: 'fundamental',
      verdict: 'BULLISH',
      confidence: 75,
      signals: [
        'Net profit increased on strong credit growth',
        'Gross NPAs declined, improving asset quality',
        'Provisions remained under control',
      ],
      evidence: [
        {
          label: 'Quarterly Filing Summary',
          value: 'Q3 FY26 net profit increased on strong credit growth and improved asset quality. Gross non-performing assets declined while provisions remained under control.',
          sourceId: 'earnings',
        },
      ],
      reasoningSteps: [
        'Parsed the Q3 FY26 filing for profitability and asset-quality trend.',
        'Profit growth paired with declining NPAs indicates quality growth, not growth funded by rising risk.',
        'Controlled provisions reinforce a clean fundamental picture.',
      ],
      sourceIds: ['earnings'],
    },
    sentiment: {
      kind: 'sentiment',
      verdict: 'BULLISH',
      confidence: 75,
      signals: [
        'Headline highlights a strong quarterly profit beat',
        'Improving asset quality reinforces the positive narrative',
        'Coverage tone is confidently positive',
      ],
      evidence: [
        { label: 'Latest Headline', value: 'SBI posts strong quarterly profit supported by improving asset quality', sourceId: 'news' },
      ],
      reasoningSteps: [
        'Scored the latest headline for tone.',
        'The language directly pairs strong results with improving quality, a strong combined signal.',
        'No offsetting negative coverage was found alongside this headline.',
      ],
      sourceIds: ['news'],
    },
  },

  ADANIENT: {
    technical: {
      kind: 'technical',
      verdict: 'BULLISH',
      confidence: 69,
      signals: [
        'RSI at 74 shows strong bullish momentum, nearing overbought',
        '30-day price up 18.6%, the sharpest rally in this set',
        'Volume 2.9x above average with strong buying interest',
      ],
      evidence: [
        { label: 'RSI (14-day)', value: '74 — Strong', sourceId: 'nse' },
        { label: '30-Day Price Change', value: '+18.6%', sourceId: 'nse' },
        { label: 'Volume Activity', value: 'Volume 2.9x above 90-day average with strong buying interest', sourceId: 'nse' },
      ],
      reasoningSteps: [
        'Pulled RSI, 30-day price change and volume activity from the NSE feed.',
        'An 18.6% rally on 2.9x volume shows a strong, well-participated uptrend.',
        'RSI of 74 is close to overbought, a mild caution flag despite the strength.',
      ],
      sourceIds: ['nse'],
    },
    fundamental: {
      kind: 'fundamental',
      verdict: 'NEUTRAL',
      confidence: 69,
      signals: [
        'Revenue rose sharply on infrastructure and energy growth',
        'Operating performance improved year-on-year',
        'Consolidated debt increased, raising leverage concerns',
      ],
      evidence: [
        {
          label: 'Quarterly Filing Summary',
          value: 'Q3 FY26 revenue increased sharply due to growth across infrastructure and energy businesses, with improved operating performance. However, consolidated debt increased following major capital expenditure, raising concerns about leverage and financing costs.',
          sourceId: 'earnings',
        },
      ],
      reasoningSteps: [
        'Parsed the Q3 FY26 filing for growth and balance-sheet trend.',
        'Strong revenue and operating growth is a genuine positive, but rising leverage from capex is a real, explicitly flagged risk.',
        'The two effects roughly offset, producing a neutral fundamental read rather than a clean bullish one.',
      ],
      sourceIds: ['earnings'],
    },
    sentiment: {
      kind: 'sentiment',
      verdict: 'NEUTRAL',
      confidence: 69,
      signals: [
        'Headline confirms a rally alongside renewed debt concerns',
        'Coverage tone is mixed rather than purely positive',
        'Leverage concerns temper an otherwise strong growth story',
      ],
      evidence: [
        { label: 'Latest Headline', value: 'Adani Enterprises rallies on infrastructure expansion despite renewed debt concerns', sourceId: 'news' },
      ],
      reasoningSteps: [
        'Scored the latest headline for tone.',
        'The headline itself pairs a positive ("rallies") with an explicit caveat ("despite renewed debt concerns").',
        'That internal contrast is classified as mixed rather than clearly bullish or bearish.',
      ],
      sourceIds: ['news'],
    },
  },
}

export function getAgentSet(symbol: string): AgentSet {
  const found = AGENT_DATA[symbol]
  if (!found) throw new Error(`No agent data for symbol: ${symbol}`)
  return found
}
