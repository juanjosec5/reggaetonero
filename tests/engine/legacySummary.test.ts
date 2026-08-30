import { describe, expect, it } from 'vitest'

import { simulateYear } from '@/engine/careerEngine'
import { createCareer } from '@/engine/createCareer'
import { applyChoice } from '@/engine/decisionEngine'
import { getEventById } from '@/data/events'
import { retire } from '@/engine/legacyEngine'
import { buildRecap, buildShareText, formatStars, peakStars, scoreBand, starEmoji } from '@/engine/legacySummary'
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

describe('starEmoji', () => {
  it('fills whole stars and adds a sparkle for a half', () => {
    expect(starEmoji(0)).toBe('')
    expect(starEmoji(3)).toBe('⭐⭐⭐')
    expect(starEmoji(3.5)).toBe('⭐⭐⭐✨')
    expect(starEmoji(4)).toBe('⭐⭐⭐⭐')
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
  it('is a short headline with the name, verdict, trophies and legado', () => {
    const career = playedToRetirement(5)
    const text = buildShareText(career)
    expect(text).toContain('MC Prueba (México)')
    expect(text).toMatch(/🏆 (EL |LA )/) // verdict title, uppercase in the data
    expect(text).toContain('💿 ')
    expect(text).toContain(`Legado ${career.legacy!.legacyScore}/100`)
    expect(text.split('\n').filter((l) => l.trim()).length).toBeLessThanOrEqual(5)
  })

  it('drops the verbose sections from the old summary', () => {
    const text = buildShareText(playedToRetirement(5))
    for (const gone of ['Comercial', 'Permanencia', 'Patrimonio', 'masters propios']) {
      expect(text).not.toContain(gone)
    }
  })
})
