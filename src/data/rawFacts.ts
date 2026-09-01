/**
 * Ground-truth facts per stock, verbatim from Stock Data.txt. This is the
 * only information handed to the Gemini agents as prompt context — each
 * agent only ever reasons over the facts relevant to its specialty.
 */
export interface RawFacts {
  rsi: number
  change30d: number
  volumeNote: string
  filing: string
  headline: string
}

export const RAW_FACTS: Record<string, RawFacts> = {
  RELIANCE: {
    rsi: 68,
    change30d: 12.4,
    volumeNote: 'Volume 2.3x above 90-day average',
    filing:
      'Q3 FY26 filing: consolidated revenue up 8.4% YoY to Rs 2.41 lakh cr. Operating margin improved 120 bps to 14.2%. Jio ARPU rose to Rs 195.',
    headline: 'Reliance announces Rs 75,000 cr green energy capex over three years',
  },
  TCS: {
    rsi: 64,
    change30d: 6.7,
    volumeNote: 'Volume 35% above 90-day average',
    filing:
      'Q3 FY26 revenue increased 5.8% YoY, supported by growth in cloud and AI transformation deals. Operating margin remained stable at 24.6% despite higher employee costs.',
    headline: 'TCS secures major multi-year AI transformation contract from global banking client',
  },
  INFY: {
    rsi: 42,
    change30d: -4.6,
    volumeNote: 'Volume 18% below 90-day average',
    filing:
      'Q3 FY26 revenue growth slowed due to weaker discretionary technology spending in key markets. Management maintained full-year guidance but noted continued pressure on large deal conversion timelines.',
    headline: 'Infosys revises near-term hiring plans amid cautious client spending',
  },
  HDFCBANK: {
    rsi: 55,
    change30d: 3.2,
    volumeNote: 'Volume near 90-day average',
    filing:
      'Q3 FY26 net interest income grew 9.1% YoY while loan growth remained healthy. Net interest margin faced mild pressure due to higher funding costs.',
    headline: 'HDFC Bank reports steady credit growth across retail and corporate segments',
  },
  TATAMOTORS: {
    rsi: 29,
    change30d: -8.2,
    volumeNote: 'Volume spike 2.7x above average during sell-off',
    filing:
      'Q3 FY26 revenue remained broadly stable, but operating margins declined due to rising input costs and weaker demand in selected international markets. Management flagged continued margin pressure and cautious near-term guidance.',
    headline: 'Tata Motors faces margin concerns amid rising costs and slower global demand',
  },
  ZOMATO: {
    rsi: 76,
    change30d: 14.8,
    volumeNote: 'Volume spike 3.4x on strong quarterly results',
    filing:
      'Q3 FY26 revenue grew 28.6% YoY, driven by higher order volumes and quick-commerce expansion. EBITDA margin improved, although aggressive expansion continues to increase operating expenditure.',
    headline: 'Zomato reports strong growth as quick-commerce business gains momentum',
  },
  SBIN: {
    rsi: 66,
    change30d: 7.9,
    volumeNote: 'Volume 1.8x above 90-day average',
    filing:
      'Q3 FY26 net profit increased on strong credit growth and improved asset quality. Gross non-performing assets declined while provisions remained under control.',
    headline: 'SBI posts strong quarterly profit supported by improving asset quality',
  },
  ADANIENT: {
    rsi: 74,
    change30d: 18.6,
    volumeNote: 'Volume 2.9x above 90-day average with strong buying interest',
    filing:
      'Q3 FY26 revenue increased sharply due to growth across infrastructure and energy businesses, with improved operating performance. However, consolidated debt increased following major capital expenditure, raising concerns about leverage and financing costs.',
    headline: 'Adani Enterprises rallies on infrastructure expansion despite renewed debt concerns',
  },
}

export function getRawFacts(symbol: string): RawFacts {
  const found = RAW_FACTS[symbol]
  if (!found) throw new Error(`No raw facts for symbol: ${symbol}`)
  return found
}
