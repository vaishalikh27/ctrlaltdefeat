import type { Holding } from '../types'

/**
 * Simulated existing portfolio, used to demonstrate position-aware reasoning.
 * Symbols and current values are kept in sync with the 8 tickers in
 * Stock Data.txt (RELIANCE, TCS, INFY, HDFCBANK, TATAMOTORS, ZOMATO, SBIN,
 * ADANIENT) — ITC and ICICIBANK are no longer part of that set.
 */
export const HOLDINGS: Holding[] = [
  { symbol: 'RELIANCE', allocationPct: 32, costBasis: 2650, currentValue: 2847.5 },
  { symbol: 'HDFCBANK', allocationPct: 24, costBasis: 1710, currentValue: 1764.85 },
  { symbol: 'TCS', allocationPct: 18, costBasis: 3980, currentValue: 4185.3 },
  { symbol: 'SBIN', allocationPct: 14, costBasis: 790, currentValue: 842.75 },
  { symbol: 'TATAMOTORS', allocationPct: 12, costBasis: 745, currentValue: 684.2 },
]

export const WATCHLIST: string[] = ['ZOMATO', 'ADANIENT', 'INFY', 'SBIN']

/** Herfindahl-style concentration score (0-100, higher = more concentrated) from allocation weights. */
export function computeConcentrationScore(holdings: Holding[]): number {
  const hhi = holdings.reduce((sum, h) => sum + (h.allocationPct / 100) ** 2, 0)
  return Math.round(hhi * 100)
}
