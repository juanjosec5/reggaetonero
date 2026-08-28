import { describe, expect, it } from 'vitest'

import { eraStars, formatCount, ZERO_ERA_DELTA } from '@/engine/stars'

describe('eraStars', () => {
  it('is 0 for an era with nothing to show', () => {
    expect(eraStars(ZERO_ERA_DELTA)).toBe(0)
  })

  it('climbs with achievements and caps at 5', () => {
    const modest = eraStars({ ...ZERO_ERA_DELTA, clubShows: 15, ticketsSold: 40_000 })
    const big = eraStars({
      ...ZERO_ERA_DELTA,
      grammys: 2,
      billboards: 3,
      platinumRecords: 4,
      stadiumShows: 25,
      ticketsSold: 900_000,
    })
    expect(modest).toBeGreaterThan(0)
    expect(modest).toBeLessThan(big)
    expect(big).toBeLessThanOrEqual(5)
  })

  it('returns half steps', () => {
    for (let i = 0; i < 40; i++) {
      const s = eraStars({ ...ZERO_ERA_DELTA, clubShows: i, ticketsSold: i * 5000 })
      expect(s * 2).toBe(Math.round(s * 2))
    }
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
