import { describe, expect, it } from 'vitest'

import { ARCHETYPES } from '@/data/archetypes'
import { getEventById } from '@/data/events'
import { VERDICTS } from '@/data/verdicts'
import { simulateYear } from '@/engine/careerEngine'
import { createCareer } from '@/engine/createCareer'
import { applyChoice } from '@/engine/decisionEngine'
import { computeLegacy, retire } from '@/engine/legacyEngine'
import { makeRng } from '@/engine/rng'
import type { ArtistProfile } from '@/types/career'

const baseProfile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Colombia',
  age: 19,
  genre: 'reggaeton',
  archetype: 'hitmaker',
}

describe('computeLegacy', () => {
  it('keeps every score within 0-100', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    career.stats.fame = 90
    career.stats.hype = 80
    const legacy = computeLegacy(career)
    for (const score of [legacy.commercialScore, legacy.artisticScore, legacy.liveScore, legacy.industryScore, legacy.legacyScore]) {
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    }
  })

  it('picks a verdict from the known list', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    const legacy = computeLegacy(career)
    expect(VERDICTS.map((v) => v.id)).toContain(legacy.verdictId)
  })
})

/** Plays a full career from a seed, taking a deterministic-but-varied choice each event. */
function playToRetirement(seed: number, years: number) {
  const rng = makeRng(seed)
  const profile: ArtistProfile = {
    ...baseProfile,
    stageName: `Sim ${seed}`,
    archetype: ARCHETYPES.all[seed % ARCHETYPES.all.length]!.id,
  }
  let career = createCareer({ profile, seed })
  for (let i = 0; i < years; i++) {
    career = simulateYear(career, rng)
    const eventId = career.history.at(-1)?.eventId
    if (eventId) {
      const event = getEventById(eventId)
      if (event?.choices.length) {
        const choice = event.choices[seed % event.choices.length]!
        career = applyChoice(career, event, choice, rng)
      }
    }
  }
  return retire(career)
}

describe('verdict distribution (balance regression guard)', () => {
  it('spreads verdicts across the roster without one dominating', () => {
    const counts: Record<string, number> = {}
    const N = 200
    for (let s = 0; s < N; s++) {
      const v = playToRetirement(s * 13 + 1, 14).legacy!.verdictId
      counts[v] = (counts[v] ?? 0) + 1
    }
    const distinct = Object.keys(counts).length
    const topShare = Math.max(...Object.values(counts)) / N

    // A full career is 14 simulated years (22 → 35). With varied choices, at
    // least 5 of the 7 verdicts should show up and none should swallow the field.
    expect(distinct).toBeGreaterThanOrEqual(5)
    expect(topShare).toBeLessThan(0.45)
  })
})

describe('retire', () => {
  it('marks the career as retired and attaches a legacy result', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    const retired = retire(career)
    expect(retired.status).toBe('retired')
    expect(retired.legacy).toBeDefined()
    expect(career.status).toBe('active') // original untouched
  })
})
