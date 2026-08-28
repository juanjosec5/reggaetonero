import { describe, expect, it } from 'vitest'

import { simulateYear } from '@/engine/careerEngine'
import { createCareer } from '@/engine/createCareer'
import { makeRng } from '@/engine/rng'
import type { ArtistProfile } from '@/types/career'

const baseProfile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Colombia',
  age: 19,
  genre: 'reggaeton',
  archetype: 'hitmaker',
}

describe('simulateYear', () => {
  it('advances age and year by one and appends a history entry', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    const next = simulateYear(career, makeRng(1))
    expect(next.age).toBe(career.age + 1)
    expect(next.year).toBe(career.year + 1)
    expect(next.history).toHaveLength(1)
    expect(next.history[0]?.year).toBe(next.year)
  })

  it('does not mutate the input career', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    const snapshot = structuredClone(career)
    simulateYear(career, makeRng(1))
    expect(career).toEqual(snapshot)
  })

  it('is deterministic for the same seed and starting career', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    const a = simulateYear(structuredClone(career), makeRng(42))
    const b = simulateYear(structuredClone(career), makeRng(42))
    expect(a).toEqual(b)
  })

  it('accumulates history across multiple years', () => {
    let career = createCareer({ profile: baseProfile, seed: 1 })
    const rng = makeRng(1)
    for (let i = 0; i < 5; i++) {
      career = simulateYear(career, rng)
    }
    expect(career.history).toHaveLength(5)
    expect(career.year).toBe(6)
  })
})
