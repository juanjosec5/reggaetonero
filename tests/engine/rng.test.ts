import { describe, expect, it } from 'vitest'

import { hashSeed, makeRng, rollRange, weightedPick } from '@/engine/rng'

describe('makeRng', () => {
  it('produces the same sequence for the same seed', () => {
    const a = makeRng(42)
    const b = makeRng(42)
    const seqA = Array.from({ length: 20 }, () => a())
    const seqB = Array.from({ length: 20 }, () => b())
    expect(seqA).toEqual(seqB)
  })

  it('produces different sequences for different seeds', () => {
    const a = makeRng(1)
    const b = makeRng(2)
    const seqA = Array.from({ length: 20 }, () => a())
    const seqB = Array.from({ length: 20 }, () => b())
    expect(seqA).not.toEqual(seqB)
  })

  it('always returns values in [0, 1)', () => {
    const rng = makeRng(7)
    for (let i = 0; i < 1000; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('rollRange', () => {
  it('stays within [min, max] inclusive', () => {
    const rng = makeRng(99)
    for (let i = 0; i < 1000; i++) {
      const v = rollRange(rng, 5, 8)
      expect(v).toBeGreaterThanOrEqual(5)
      expect(v).toBeLessThanOrEqual(8)
      expect(Number.isInteger(v)).toBe(true)
    }
  })

  it('handles min === max', () => {
    const rng = makeRng(1)
    expect(rollRange(rng, 3, 3)).toBe(3)
  })

  it('throws when max < min', () => {
    const rng = makeRng(1)
    expect(() => rollRange(rng, 5, 1)).toThrow()
  })

  it('is deterministic for a given seed', () => {
    const a = makeRng(123)
    const b = makeRng(123)
    const seqA = Array.from({ length: 10 }, () => rollRange(a, 0, 100))
    const seqB = Array.from({ length: 10 }, () => rollRange(b, 0, 100))
    expect(seqA).toEqual(seqB)
  })
})

describe('weightedPick', () => {
  it('returns undefined for an empty list', () => {
    const rng = makeRng(1)
    expect(weightedPick([], () => 1, rng)).toBeUndefined()
  })

  it('returns undefined when all weights are zero', () => {
    const rng = makeRng(1)
    expect(weightedPick(['a', 'b'], () => 0, rng)).toBeUndefined()
  })

  it('only ever picks items with positive weight', () => {
    const rng = makeRng(5)
    const items = ['a', 'b', 'c']
    for (let i = 0; i < 200; i++) {
      const picked = weightedPick(items, (item) => (item === 'c' ? 0 : 1), rng)
      expect(picked).not.toBe('c')
    }
  })

  it('roughly respects weight distribution over many samples', () => {
    const rng = makeRng(2024)
    const counts: Record<string, number> = { a: 0, b: 0 }
    const items = ['a', 'b']
    const weight = (item: string) => (item === 'a' ? 9 : 1)
    const samples = 5000

    for (let i = 0; i < samples; i++) {
      const picked = weightedPick(items, weight, rng)
      if (picked) counts[picked] = (counts[picked] ?? 0) + 1
    }

    const ratio = counts.a / samples
    expect(ratio).toBeGreaterThan(0.8)
    expect(ratio).toBeLessThan(0.98)
  })

  it('is deterministic for a given seed', () => {
    const items = ['a', 'b', 'c', 'd']
    const weight = (item: string) => item.charCodeAt(0)

    const a = makeRng(77)
    const b = makeRng(77)
    const seqA = Array.from({ length: 15 }, () => weightedPick(items, weight, a))
    const seqB = Array.from({ length: 15 }, () => weightedPick(items, weight, b))
    expect(seqA).toEqual(seqB)
  })
})

describe('hashSeed', () => {
  it('is deterministic for the same parts', () => {
    expect(hashSeed(1, 2, 3)).toBe(hashSeed(1, 2, 3))
  })

  it('differs when any part differs', () => {
    expect(hashSeed(1, 2, 3)).not.toBe(hashSeed(1, 2, 4))
    expect(hashSeed(1, 2, 3)).not.toBe(hashSeed(1, 3, 3))
    expect(hashSeed(1, 2, 3)).not.toBe(hashSeed(2, 2, 3))
  })

  it('always returns a non-negative integer', () => {
    for (const parts of [[0, 0], [-5, 10], [999999, 1], [1, 2, 3, 4, 5]]) {
      const h = hashSeed(...parts)
      expect(Number.isInteger(h)).toBe(true)
      expect(h).toBeGreaterThanOrEqual(0)
    }
  })
})
