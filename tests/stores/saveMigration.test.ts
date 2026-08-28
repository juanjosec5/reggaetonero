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
    record: { releases: 3, singles: 3, hits: 1, smashHits: 0, awards: 0 }, // pre-revamp shape
    team: {},
    relationships: [{ personId: 'x', trust: 60, loyalty: 60, professionalValue: 50, tension: 0 }] as never,
    rivals: [{ name: 'Bravo', fame: 30, credibility: 20, style: 'Radio', relationship: -10 }] as never,
    releases: [],
    history: [{ year: 3, age: 21, era: 'underground', releases: [], statsSnapshot: {} }] as never,
    pendingEffects: [],
    firedEventIds: [],
    age: 22,
    year: 4,
    era: 'first_buzz', // a pre-revamp 8-era value
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
    expect(migrated.rivals.every((r) => r.discovered)).toBe(true)
    expect(migrated.relationships[0]!.memory).toEqual([])
    expect(migrated.relationships[0]!.name).toBeDefined()
    // era is re-derived under the current thresholds (v8); year 4 ⇒ ascenso
    expect(migrated.era).toBe('ascenso')
    expect(migrated.peakFame).toBe(migrated.stats.fame)
    // v5 → v6: new record counters, residence, per-year snapshots
    expect(migrated.record.grammys).toBe(0)
    expect(migrated.record.ticketsSold).toBe(0)
    expect(migrated.residence).toBe('San Juan') // Puerto Rico home city
    expect(migrated.history[0]!.recordSnapshot).toBeDefined()
    expect(migrated.history[0]!.residence).toBe('San Juan')
  })

  it('seeds a full rival roster for a Phase 1 save that had none', () => {
    const save = legacySave()
    save.rivals = []
    delete (save as { saveVersion?: number }).saveVersion
    const migrated = migrateSave(save)
    expect(migrated.rivals.length).toBe(3)
    expect(migrated.rivals.every((r) => r.id && r.discovered)).toBe(true)
  })

  it('leaves an already-current save untouched', () => {
    const current = migrateSave(legacySave())
    const again = migrateSave(current)
    expect(again).toEqual(current)
  })

  it('brings a v2 save to v3 without re-running the v1 backfills', () => {
    const v2 = migrateSave(legacySave())
    v2.saveVersion = 2
    // a stale field a v2 save could still carry - migration must not choke on it
    ;(v2.artist as { city?: string }).city = 'San Juan'
    const rivalsBefore = v2.rivals

    const v3 = migrateSave(v2)
    expect(v3.saveVersion).toBe(CURRENT_SAVE_VERSION)
    expect(v3.rivals).toBe(rivalsBefore) // untouched - not re-mapped
  })
})
