import { describe, expect, it } from 'vitest'

import { formatCount, recordDelta, recordStars, ZERO_DELTA } from '@/engine/stars'

describe('recordStars', () => {
  it('is 0 for a year with nothing to show', () => {
    expect(recordStars(ZERO_DELTA)).toBe(0)
  })

  it('climbs with achievements and caps at 5', () => {
    const modest = recordStars({ ...ZERO_DELTA, clubShows: 8, ticketsSold: 20_000 })
    const big = recordStars({
      ...ZERO_DELTA,
      grammys: 1,
      billboards: 2,
      platinumRecords: 2,
      stadiumShows: 14,
      ticketsSold: 700_000,
    })
    expect(modest).toBeGreaterThan(0)
    expect(modest).toBeLessThan(big)
    expect(big).toBeLessThanOrEqual(5)
  })

  it('returns half steps', () => {
    for (let i = 0; i < 30; i++) {
      const s = recordStars({ ...ZERO_DELTA, clubShows: i, ticketsSold: i * 4000 })
      expect(s * 2).toBe(Math.round(s * 2))
    }
  })
})

describe('recordDelta', () => {
  it('subtracts and floors at 0 over the star-rating counters', () => {
    const d = recordDelta(
      { releases: 9, hits: 3, smashHits: 1, platinumRecords: 4, grammys: 1, billboards: 2, clubShows: 30, stadiumShows: 5, ticketsSold: 500_000 },
      { ...ZERO_DELTA, platinumRecords: 2, grammys: 1, clubShows: 12, ticketsSold: 200_000 },
    )
    expect(d.platinumRecords).toBe(2)
    expect(d.grammys).toBe(0)
    expect(d.clubShows).toBe(18)
    expect(d.ticketsSold).toBe(300_000)
  })
})

describe('formatCount', () => {
  it('formats plain / thousands / millions', () => {
    expect(formatCount(840)).toBe('840')
    expect(formatCount(4200)).toBe('4.2k')
    expect(formatCount(52_000)).toBe('52k')
    expect(formatCount(1_400_000)).toBe('1.4M')
  })
})
