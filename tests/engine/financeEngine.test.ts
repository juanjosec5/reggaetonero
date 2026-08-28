import { describe, expect, it } from 'vitest'

import { createCareer } from '@/engine/createCareer'
import { applyFinances } from '@/engine/financeEngine'
import type { ArtistProfile } from '@/types/career'

const baseProfile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Colombia',
  age: 19,
  genre: 'reggaeton',
  archetype: 'hitmaker',
}

describe('applyFinances', () => {
  it('never leaves cash, netWorth, or catalogValue negative', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    applyFinances(career, [])
    expect(career.finances.cash).toBeGreaterThanOrEqual(0)
    expect(career.finances.netWorth).toBeGreaterThanOrEqual(0)
    expect(career.finances.catalogValue).toBeGreaterThanOrEqual(0)
  })

  it('increases catalog value when releases land', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    const before = career.finances.catalogValue
    applyFinances(career, [
      {
        title: 'x',
        year: 1,
        quality: 90,
        originality: 90,
        commerciality: 90,
        artistBuzz: 90,
        featurePower: 90,
        marketing: 90,
        timing: 90,
        hitScore: 90,
        tier: 'smash',
      },
    ])
    expect(career.finances.catalogValue).toBeGreaterThan(before)
  })

  it('reduces income when ownership percent is lower', () => {
    const fullOwnership = createCareer({ profile: baseProfile, seed: 1 })
    fullOwnership.stats.fame = 50
    fullOwnership.stats.fanbase = 50

    const partialOwnership = structuredClone(fullOwnership)
    partialOwnership.finances.ownershipPercent = 20

    applyFinances(fullOwnership, [])
    applyFinances(partialOwnership, [])

    expect(partialOwnership.finances.annualIncome).toBeLessThan(fullOwnership.finances.annualIncome)
  })
})
