import { describe, expect, it } from 'vitest'

import { migrateSave } from '@/stores/career'
import { CURRENT_SAVE_VERSION, type Career } from '@/types/career'

// A trimmed Phase 1 save shape: no saveVersion, no markets, rivals without ids.
function legacySave(): Career {
  return {
    id: 'career_1_2',
    seed: 1,
    mode: 'quick',
    artist: {
      stageName: 'MC Vieja Escuela',
      country: 'Puerto Rico',
      city: 'San Juan',
      age: 22,
      genre: 'reggaeton',
      archetype: 'perreo_king',
    },
    attributes: {
      talent: 50,
      writing: 50,
      voice: 50,
      productionSense: 50,
      charisma: 50,
      performance: 50,
      originality: 50,
      business: 50,
    },
    hiddenTraits: {
      ambition: 50,
      discipline: 50,
      loyalty: 50,
      resilience: 50,
      ego: 50,
      patience: 50,
      riskTolerance: 50,
      authenticity: 50,
      adaptability: 50,
    },
    stats: {
      fame: 20,
      fanbase: 15,
      hype: 10,
      credibility: 10,
      catalogStrength: 5,
      livePower: 8,
      industryRespect: 4,
      internationalReach: 0,
      culturalImpact: 0,
    },
    finances: { cash: 200, netWorth: 200, catalogValue: 30, ownershipPercent: 100, annualIncome: 20 },
    record: {
      releases: 3,
      singles: 3,
      albums: 0,
      eps: 0,
      hits: 1,
      smashHits: 0,
      features: 0,
      streams: 0,
      certifications: 0,
      shows: 0,
      countriesPerformed: 0,
      awards: 0,
      numberOneRecords: 0,
    },
    team: {},
    relationships: [{ personId: 'x', trust: 60, loyalty: 60, professionalValue: 50, tension: 0 }] as never,
    rivals: [{ name: 'Bravo', fame: 30, credibility: 20, style: 'Radio', relationship: -10 }] as never,
    releases: [],
    history: [],
    pendingEffects: [],
    firedEventIds: [],
    age: 22,
    year: 4,
    era: 'first_buzz',
    currentMarket: 'Puerto Rico',
  } as unknown as Career
}

describe('migrateSave', () => {
  it('backfills the Phase 2 shape without throwing', () => {
    const migrated = migrateSave(legacySave())

    expect(migrated.saveVersion).toBe(CURRENT_SAVE_VERSION)
    expect(migrated.markets.length).toBeGreaterThan(0)
    expect(migrated.markets.find((m) => m.id === 'pr')?.unlocked).toBe(true)
    expect(migrated.rivals[0]!.id).toBeDefined()
    expect(migrated.rivals[0]!.archetype).toBeDefined()
    expect(migrated.relationships[0]!.memory).toEqual([])
    expect(migrated.relationships[0]!.name).toBeDefined()
  })

  it('leaves an already-current save untouched', () => {
    const current = migrateSave(legacySave())
    const again = migrateSave(current)
    expect(again).toEqual(current)
  })
})
