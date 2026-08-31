import { describe, expect, it } from 'vitest'

import { getEventById } from '@/data/events'
import { simulateYear } from '@/engine/careerEngine'
import { createCareer } from '@/engine/createCareer'
import { applyChoice } from '@/engine/decisionEngine'
import { makeRng } from '@/engine/rng'
import {
  currentStars,
  formatCount,
  recordDelta,
  recordStars,
  starTierLabel,
  ZERO_DELTA,
} from '@/engine/stars'

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

  it('rates a year higher for a bigger artist even with the same activity', () => {
    const activity = { ...ZERO_DELTA, clubShows: 10, ticketsSold: 120_000 }
    const nobody = recordStars(activity, { fame: 12, fanbase: 6, culturalImpact: 0, internationalReach: 0 })
    const star = recordStars(activity, { fame: 65, fanbase: 55, culturalImpact: 22, internationalReach: 25 })
    expect(star).toBeGreaterThan(nobody)
    expect(star).toBeGreaterThanOrEqual(3)
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

describe('starTierLabel', () => {
  it('names the band a rating sits in', () => {
    expect(starTierLabel(0)).toBe('Empezando')
    expect(starTierLabel(0.5)).toBe('Empezando')
    expect(starTierLabel(2.5)).toBe('En subida')
    expect(starTierLabel(3)).toBe('En la cima')
    expect(starTierLabel(4.5)).toBe('Cabeza de cartel')
    expect(starTierLabel(5)).toBe('Leyenda')
  })
})

describe('currentStars', () => {
  it('is 0 before any year is resolved', () => {
    const career = createCareer({ profile: { stageName: 'X', country: 'Colombia' }, seed: 1 })
    expect(currentStars(career)).toBe(0)
    // year 1 simulated but its decision still pending -> not resolved yet
    const y1 = simulateYear(career, makeRng(1))
    if (y1.history.at(-1)?.eventId) expect(currentStars(y1)).toBe(0)
  })

  it('matches the last resolved year and is a 0-5 half step', () => {
    const rng = makeRng(7)
    let c = createCareer({ profile: { stageName: 'MC Prueba', country: 'México' }, seed: 7 })
    for (let i = 0; i < 12; i++) {
      c = simulateYear(c, rng)
      const id = c.history.at(-1)?.eventId
      const event = id ? getEventById(id) : undefined
      if (event?.choices.length) c = applyChoice(c, event, event.choices[0]!, rng)
    }
    const entry = c.history.at(-1)!
    const prev = c.history.at(-2)?.recordSnapshot ?? ZERO_DELTA
    const expected = recordStars(recordDelta(entry.recordSnapshot, prev), entry.statsSnapshot)

    const stars = currentStars(c)
    expect(stars).toBe(expected)
    expect(stars).toBeGreaterThanOrEqual(0)
    expect(stars).toBeLessThanOrEqual(5)
    expect(stars * 2).toBe(Math.round(stars * 2))
  })
})
