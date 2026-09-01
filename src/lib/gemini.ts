import { GoogleGenAI, Type } from '@google/genai'
import type { AgentKind, Verdict } from '../types'
import { getRawFacts } from '../data/rawFacts'
import { getStockMeta } from '../data/stocks'

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim()
const MODEL = (import.meta.env.VITE_GEMINI_MODEL as string | undefined)?.trim() || 'gemini-flash-lite-latest'
const CALL_TIMEOUT_MS = 20000

export function isGeminiConfigured(): boolean {
  return Boolean(API_KEY)
}

let client: GoogleGenAI | null = null
function getClient(): GoogleGenAI {
  if (!API_KEY) throw new Error('VITE_GEMINI_API_KEY is not set')
  if (!client) client = new GoogleGenAI({ apiKey: API_KEY })
  return client
}

export interface AIAgentResult {
  verdict: Verdict
  confidence: number
  signals: string[]
  reasoningSteps: string[]
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    verdict: { type: Type.STRING, enum: ['BULLISH', 'NEUTRAL', 'BEARISH'] },
    confidence: { type: Type.INTEGER, description: 'Confidence in this verdict, 0-100.' },
    signals: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2-3 short bullet points (under 15 words each) explaining the verdict.',
    },
    reasoningSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2-3 sentences walking through how the verdict was reached from the given facts.',
    },
  },
  required: ['verdict', 'confidence', 'signals', 'reasoningSteps'],
}

const SYSTEM_PREAMBLE =
  'You are one of three specialist agents in a multi-agent equity research system for Indian retail investors. ' +
  'Reason ONLY from the facts given below — never invent numbers, news, or filings that are not stated. ' +
  'Be concise and concrete. Respond with strict JSON matching the provided schema.'

function buildPrompt(kind: AgentKind, symbol: string): string {
  const meta = getStockMeta(symbol)
  const facts = getRawFacts(symbol)
  const header = `Stock: ${meta.name} (${symbol}), sector: ${meta.sector}. Current price: Rs ${meta.price}.`

  if (kind === 'technical') {
    return `${SYSTEM_PREAMBLE}

You are the TECHNICAL agent. You analyze only price action, momentum and volume — never fundamentals or news.

${header}
Facts:
- 30-day price change: ${facts.change30d}%
- RSI (14-day): ${facts.rsi}
- Volume note: ${facts.volumeNote}

Produce a technical verdict (BULLISH/NEUTRAL/BEARISH) with a confidence score, 2-3 signal bullets, and a short reasoning chain.`
  }

  if (kind === 'fundamental') {
    return `${SYSTEM_PREAMBLE}

You are the FUNDAMENTAL agent. You analyze only company financials and filings — never price charts or news headlines.

${header}
Latest quarterly filing:
"${facts.filing}"

Produce a fundamental verdict (BULLISH/NEUTRAL/BEARISH) with a confidence score, 2-3 signal bullets, and a short reasoning chain.`
  }

  return `${SYSTEM_PREAMBLE}

You are the SENTIMENT agent. You analyze only news tone and market narrative — never price charts or financial statements.

${header}
Latest headline:
"${facts.headline}"

Produce a sentiment verdict (BULLISH/NEUTRAL/BEARISH) with a confidence score, 2-3 signal bullets, and a short reasoning chain.`
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Gemini request timed out')), ms)
    promise.then(
      (v) => {
        clearTimeout(timer)
        resolve(v)
      },
      (e) => {
        clearTimeout(timer)
        reject(e)
      },
    )
  })
}

/** Calls Gemini for one agent's analysis. Throws on any failure — callers should fall back to mock data. */
export async function analyzeWithAI(kind: AgentKind, symbol: string): Promise<AIAgentResult> {
  const ai = getClient()
  const response = await withTimeout(
    ai.models.generateContent({
      model: MODEL,
      contents: buildPrompt(kind, symbol),
      config: {
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.4,
      },
    }),
    CALL_TIMEOUT_MS,
  )

  const raw = response.text
  if (!raw) throw new Error('Empty response from Gemini')

  const parsed = JSON.parse(raw) as Partial<AIAgentResult>
  const verdict = parsed.verdict
  if (verdict !== 'BULLISH' && verdict !== 'NEUTRAL' && verdict !== 'BEARISH') {
    throw new Error(`Invalid verdict from Gemini: ${String(parsed.verdict)}`)
  }
  const confidence = Math.max(15, Math.min(96, Math.round(Number(parsed.confidence) || 0)))
  const signals = Array.isArray(parsed.signals) && parsed.signals.length > 0 ? parsed.signals.slice(0, 3) : ['No signal detail returned.']
  const reasoningSteps =
    Array.isArray(parsed.reasoningSteps) && parsed.reasoningSteps.length > 0 ? parsed.reasoningSteps.slice(0, 4) : ['No reasoning detail returned.']

  return { verdict, confidence, signals, reasoningSteps }
}
