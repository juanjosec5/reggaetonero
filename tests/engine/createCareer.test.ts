import { describe, expect, it } from 'vitest'

import { createCareer } from '@/engine/createCareer'
import type { ArtistProfile } from '@/types/career'

const baseProfile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Colombia',
  city: 'Medellín',
  age: 19,
  genre: 'reggaeton',
  archetype: 'hitmaker',
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

  it('applies the archetype attribute bias', () => {
    const executive = createCareer({
      profile: { ...baseProfile, archetype: 'executive' },
      seed: 42,
    })
    const lyricist = createCareer({
      profile: { ...baseProfile, archetype: 'lyricist' },
      seed: 42,
    })
    // executive is biased toward business, lyricist is biased against charisma-adjacent traits
    expect(executive.attributes.business).toBeGreaterThan(lyricist.attributes.business)
  })

  it('starts with sane defaults', () => {
    const career = createCareer({ profile: baseProfile, seed: 7 })
    expect(career.status).toBe('active')
    expect(career.era).toBe('underground')
    expect(career.year).toBe(1)
    expect(career.releases).toEqual([])
    expect(career.history).toEqual([])
    expect(career.finances.ownershipPercent).toBe(100)
  })
})
