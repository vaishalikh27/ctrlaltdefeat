import type { StockMeta } from '../types'
import { generateSparkline } from '../lib/rng'

interface StockSeed {
  symbol: string
  name: string
  sector: string
  price: number
  changePercent: number
  volumeLabel: string
  volatility: StockMeta['volatility']
}

// Sourced verbatim from Stock Data.txt (price, change30d, volumeNote).
// `volatility` is not present in that dataset and is derived here from the
// magnitude of the 30-day change: >=10% -> High, 4-10% -> Medium, <4% -> Low.
const SEEDS: StockSeed[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy & Retail', price: 2847.5, changePercent: 12.4, volumeLabel: 'Volume 2.3x above 90-day average', volatility: 'High' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', sector: 'Information Technology', price: 4185.3, changePercent: 6.7, volumeLabel: 'Volume 35% above 90-day average', volatility: 'Medium' },
  { symbol: 'INFY', name: 'Infosys Ltd', sector: 'Information Technology', price: 1928.4, changePercent: -4.6, volumeLabel: 'Volume 18% below 90-day average', volatility: 'Medium' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking & Financial Services', price: 1764.85, changePercent: 3.2, volumeLabel: 'Volume near 90-day average', volatility: 'Low' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Automobile', price: 684.2, changePercent: -8.2, volumeLabel: 'Volume spike 2.7x above average during sell-off', volatility: 'Medium' },
  { symbol: 'ZOMATO', name: 'Zomato Ltd', sector: 'Consumer Technology & Food Delivery', price: 312.6, changePercent: 14.8, volumeLabel: 'Volume spike 3.4x on strong quarterly results', volatility: 'High' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking & Financial Services', price: 842.75, changePercent: 7.9, volumeLabel: 'Volume 1.8x above 90-day average', volatility: 'Medium' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', sector: 'Infrastructure & Energy', price: 3568.9, changePercent: 18.6, volumeLabel: 'Volume 2.9x above 90-day average with strong buying interest', volatility: 'High' },
]

export const STOCKS: StockMeta[] = SEEDS.map((seed) => ({
  ...seed,
  sparkline: generateSparkline(seed.symbol, 24, seed.changePercent),
}))

export const DEFAULT_SYMBOL = STOCKS[0].symbol

export function getStockMeta(symbol: string): StockMeta {
  const found = STOCKS.find((s) => s.symbol === symbol)
  if (!found) throw new Error(`Unknown stock symbol: ${symbol}`)
  return found
}
