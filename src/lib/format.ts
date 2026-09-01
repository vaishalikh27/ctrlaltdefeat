export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value)
}

export function formatSignedPct(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

export function verdictTone(verdict: 'BULLISH' | 'NEUTRAL' | 'BEARISH'): 'bull' | 'amber' | 'bear' {
  if (verdict === 'BULLISH') return 'bull'
  if (verdict === 'BEARISH') return 'bear'
  return 'amber'
}
