import { describe, expect, it } from 'vitest'

import { createCareer } from '@/engine/createCareer'
import { computeLegacy, retire } from '@/engine/legacyEngine'
import { VERDICTS } from '@/data/verdicts'
import type { ArtistProfile } from '@/types/career'

const baseProfile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Colombia',
  city: 'Medellín',
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

describe('retire', () => {
  it('marks the career as retired and attaches a legacy result', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    const retired = retire(career)
    expect(retired.status).toBe('retired')
    expect(retired.legacy).toBeDefined()
    expect(career.status).toBe('active') // original untouched
  })
})
