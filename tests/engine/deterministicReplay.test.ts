import { describe, expect, it } from 'vitest'

import { simulateYear } from '@/engine/careerEngine'
import { createCareer } from '@/engine/createCareer'
import { applyChoice } from '@/engine/decisionEngine'
import { getEventById } from '@/data/events'
import { makeRng } from '@/engine/rng'
import { retire } from '@/engine/legacyEngine'
import type { ArtistProfile, Career } from '@/types/career'

const baseProfile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Colombia',
  city: 'Medellín',
  age: 19,
  genre: 'reggaeton',
  archetype: 'perreo_king',
}

/**
 * Plays out a full career for `years` years from a given seed, always taking
 * the first available choice whenever an event fires. A single seeded RNG
 * stream drives every roll across the whole run, mirroring how the store
 * would drive a real playthrough.
 */
function playCareer(seed: number, years: number): Career {
  const rng = makeRng(seed)
  let career = createCareer({ profile: baseProfile, seed })

  for (let i = 0; i < years; i++) {
    career = simulateYear(career, rng)
    const eventId = career.history.at(-1)?.eventId
    if (eventId) {
      const event = getEventById(eventId)
      const choice = event?.choices[0]
      if (event && choice) {
        career = applyChoice(career, event, choice, rng)
      }
    }
  }

  return retire(career)
}

describe('deterministic replay', () => {
  it('produces an identical career for the same seed and the same choices', () => {
    const a = playCareer(2024, 10)
    const b = playCareer(2024, 10)
    expect(a).toEqual(b)
  })

  it('produces a different career for a different seed', () => {
    const a = playCareer(1, 10)
    const b = playCareer(2, 10)
    expect(a).not.toEqual(b)
  })

  it('reaches retirement with a legacy verdict after 10 years', () => {
    const career = playCareer(555, 10)
    expect(career.status).toBe('retired')
    expect(career.legacy?.verdictId).toBeTruthy()
    expect(career.history).toHaveLength(10)
  })

  it('stays identical across a long run that exercises team/market/rival systems', () => {
    const a = playCareer(7777, 18)
    const b = playCareer(7777, 18)
    expect(a).toEqual(b)

    // The Phase 2 subsystems should have actually moved over 18 years.
    expect(a.markets.some((m) => m.penetration > 15)).toBe(true)
    expect(a.rivals.length).toBeGreaterThan(0)
    expect(a.stats.internationalReach).toBeGreaterThan(0)
  })
})
