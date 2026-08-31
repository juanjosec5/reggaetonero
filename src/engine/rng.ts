export type Rng = () => number

/**
 * Deterministically combines a base seed with extra integer parts (e.g. a
 * career's seed + its current year) into a single new seed. This lets the
 * store derive a fresh, reproducible RNG for each year/action straight from
 * data that's already persisted (`career.seed`, `career.year`), instead of
 * needing to persist an in-progress RNG stream's internal state.
 */
export function hashSeed(...parts: number[]): number {
  let h = 0x9e3779b9
  for (const part of parts) {
    h = Math.imul(h ^ part, 2654435761)
    h ^= h >>> 15
  }
  return h >>> 0
}

/**
 * mulberry32 - a small, fast, deterministic PRNG. Same seed always produces
 * the same sequence of [0, 1) floats, which is what makes seeded/daily/shareable
 * careers and reproducible tests possible.
 */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0

  return function rng() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Returns an integer in [min, max] inclusive. */
export function rollRange(rng: Rng, min: number, max: number): number {
  if (max < min) {
    throw new Error(`rollRange: max (${max}) must be >= min (${min})`)
  }
  return Math.floor(rng() * (max - min + 1)) + min
}

/** Picks one item from a list, weighted by the given weight function. */
export function weightedPick<T>(items: readonly T[], weight: (item: T) => number, rng: Rng): T | undefined {
  const weighted = items.map((item) => ({ item, weight: Math.max(0, weight(item)) }))
  const total = weighted.reduce((sum, w) => sum + w.weight, 0)
  if (total <= 0) return undefined

  let roll = rng() * total
  for (const w of weighted) {
    roll -= w.weight
    if (roll <= 0) return w.item
  }
  return weighted[weighted.length - 1]?.item
}
