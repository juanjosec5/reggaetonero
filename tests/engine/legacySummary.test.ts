import { describe, expect, it } from 'vitest'

import { simulateYear } from '@/engine/careerEngine'
import { createCareer } from '@/engine/createCareer'
import { applyChoice } from '@/engine/decisionEngine'
import { getEventById } from '@/data/events'
import { retire } from '@/engine/legacyEngine'
import { buildRecap, buildShareText, formatStars, peakStars, scoreBand } from '@/engine/legacySummary'
import { makeRng } from '@/engine/rng'
import type { Career } from '@/types/career'

function playedToRetirement(seed: number, years = 12): Career {
  const rng = makeRng(seed)
  let c = createCareer({ profile: { stageName: 'MC Prueba', country: 'México' }, seed })
  for (let i = 0; i < years; i++) {
    c = simulateYear(c, rng)
    const id = c.history.at(-1)?.eventId
    const event = id ? getEventById(id) : undefined
    if (event?.choices.length) c = applyChoice(c, event, event.choices[seed % event.choices.length]!, rng)
  }
  return retire(c)
}

describe('scoreBand', () => {
  it('maps the 0-100 scale to a word', () => {
    expect(scoreBand(0)).toBe('Flojo')
    expect(scoreBand(24)).toBe('Flojo')
    expect(scoreBand(25)).toBe('Discreto')
    expect(scoreBand(54)).toBe('Sólido')
    expect(scoreBand(55)).toBe('Fuerte')
    expect(scoreBand(95)).toBe('De época')
  })
})

describe('formatStars', () => {
  it('renders whole and half steps', () => {
    expect(formatStars(0)).toBe('0★')
    expect(formatStars(0.5)).toBe('½★')
    expect(formatStars(3)).toBe('3★')
    expect(formatStars(4.5)).toBe('4½★')
  })
})

describe('peakStars', () => {
  it('is a 0-5 half step over a full career', () => {
    const p = peakStars(playedToRetirement(7))
    expect(p).toBeGreaterThanOrEqual(0)
    expect(p).toBeLessThanOrEqual(5)
    expect(p * 2).toBe(Math.round(p * 2))
  })
})

describe('buildRecap', () => {
  it('produces a non-empty recap naming the career', () => {
    const career = playedToRetirement(3)
    const recap = buildRecap(career)
    expect(recap.length).toBeGreaterThan(20)
    expect(recap).toContain('MC Prueba')
    expect(recap).toContain(`Legado ${career.legacy!.legacyScore}/100`)
  })
})

describe('buildShareText', () => {
  it('includes the name, country, verdict title, scores and legado', () => {
    const career = playedToRetirement(5)
    const text = buildShareText(career)
    expect(text).toContain('MC Prueba · México')
    expect(text).toContain(`Legado ${career.legacy!.legacyScore}/100`)
    expect(text).toContain('Comercial')
    expect(text).toContain('Permanencia')
    // every verdict title is uppercase in the data
    expect(text).toMatch(/EL |LA /)
  })

  it('shows a city arrow once the artist has relocated', () => {
    // A long strong run relocates; find one and check the arrow renders.
    for (const seed of [1, 2, 4, 8, 11, 21, 33, 40]) {
      const career = playedToRetirement(seed, 14)
      const cities = new Set(career.history.map((h) => h.residence))
      if (cities.size > 1) {
        expect(buildShareText(career)).toContain(' → ')
        return
      }
    }
    throw new Error('expected at least one seeded career to relocate')
  })
})
