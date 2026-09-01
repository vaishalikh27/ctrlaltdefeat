/**
 * Small deterministic PRNG utilities so mock data is stable across renders
 * and reloads (same seed -> same output), keeping the demo repeatable.
 */

function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

/** mulberry32 seeded generator, returns a function producing floats in [0, 1). */
export function seededRandom(seed: string): () => number {
  let a = hashSeed(seed)
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Deterministic random walk sparkline for a given seed, trending toward `driftPct`. */
export function generateSparkline(seed: string, points: number, driftPct: number): number[] {
  const rand = seededRandom(seed)
  const start = 100
  const end = start * (1 + driftPct / 100)
  const totalDrift = end - start
  const series: number[] = [start]
  for (let i = 1; i < points; i++) {
    const progress = i / (points - 1)
    const target = start + totalDrift * progress
    const noise = (rand() - 0.5) * (totalDrift === 0 ? 3 : Math.abs(totalDrift) * 0.9 + 1.5)
    const prev = series[i - 1]
    const next = prev + (target - prev) * 0.4 + noise
    series.push(Number(next.toFixed(2)))
  }
  series[series.length - 1] = Number(end.toFixed(2))
  return series
}
