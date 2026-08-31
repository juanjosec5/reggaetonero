import { describe, expect, it } from 'vitest'

import { ARCHETYPES } from '@/data/archetypes'
import { GENRES } from '@/data/genres'
import { STARTING_AGE } from '@/engine/constants'
import { createCareer } from '@/engine/createCareer'
import type { CreationInput } from '@/types/career'

const baseProfile: CreationInput = {
  stageName: 'MC Prueba',
  country: 'Colombia',
}

describe('createCareer', () => {
  it('produces identical careers for the same seed', () => {
    const a = createCareer({ profile: baseProfile, seed: 12345 })
    const b = createCareer({ profile: baseProfile, seed: 12345 })
    expect(a).toEqual(b)
  })

  it('produces different attribute rolls for different seeds', () => {
    const a = createCareer({ profile: baseProfile, seed: 1 })
    const b = createCareer({ profile: baseProfile, seed: 2 })
    expect(a.attributes).not.toEqual(b.attributes)
  })

  it('clamps all attributes to 1-100', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const career = createCareer({ profile: baseProfile, seed })
      for (const value of Object.values(career.attributes)) {
        expect(value).toBeGreaterThanOrEqual(1)
        expect(value).toBeLessThanOrEqual(100)
      }
    }
  })

  it('clamps all hidden traits to 0-100', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const career = createCareer({ profile: baseProfile, seed })
      for (const value of Object.values(career.hiddenTraits)) {
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThanOrEqual(100)
      }
    }
  })

  it('rolls a hidden genre and archetype from the seed', () => {
    const career = createCareer({ profile: baseProfile, seed: 42 })
    expect(GENRES.map((g) => g.id)).toContain(career.artist.genre)
    expect(ARCHETYPES.all.map((a) => a.id)).toContain(career.artist.archetype)
  })

  it('different seeds can produce different hidden builds', () => {
    const builds = new Set(
      [1, 2, 3, 4, 5, 6, 7, 8].map((seed) => {
        const c = createCareer({ profile: baseProfile, seed })
        return `${c.artist.genre}/${c.artist.archetype}`
      }),
    )
    expect(builds.size).toBeGreaterThan(1)
  })

  it('starts with sane defaults', () => {
    const career = createCareer({ profile: baseProfile, seed: 7 })
    expect(career.status).toBe('active')
    expect(career.era).toBe('debut')
    // A fresh career is seeded pre-simulation at year 0 / age 21; the store runs
    // year 1 immediately so the player lands inside a real age-22 year.
    expect(career.year).toBe(0)
    expect(career.age).toBe(STARTING_AGE - 1)
    expect(career.artist.age).toBe(STARTING_AGE)
    expect(career.releases).toEqual([])
    expect(career.history).toEqual([])
    expect(career.finances.ownershipPercent).toBe(100)
  })
})
