import { describe, expect, it } from 'vitest'

import { bandFor, driftDelta, driftToward, type Band } from '@/engine/scale'

const BANDS: Band<string>[] = [
  [10, 'low'],
  [20, 'mid'],
  [Infinity, 'high'],
]

describe('bandFor', () => {
  it('returns the first band the value has not reached', () => {
    expect(bandFor(BANDS, 0)).toBe('low')
    expect(bandFor(BANDS, 9.99)).toBe('low')
    expect(bandFor(BANDS, 10)).toBe('mid')
    expect(bandFor(BANDS, 19)).toBe('mid')
    expect(bandFor(BANDS, 20)).toBe('high')
    expect(bandFor(BANDS, 9999)).toBe('high')
  })
})

describe('driftToward', () => {
  it('eases a fraction of the way toward the target', () => {
    expect(driftToward(0, 100, 0)).toBe(0)
    expect(driftToward(0, 100, 1)).toBe(100)
    expect(driftToward(0, 100, 0.25)).toBe(25)
    expect(driftToward(50, 10, 0.5)).toBe(30)
  })
})

describe('driftDelta', () => {
  it('is the rounded change driftToward would produce', () => {
    expect(driftDelta(0, 100, 0.15)).toBe(15)
    expect(driftDelta(50, 10, 0.5)).toBe(-20)
    expect(driftDelta(0, 10, 0.15)).toBe(2) // 1.5 rounds to 2
  })
})
