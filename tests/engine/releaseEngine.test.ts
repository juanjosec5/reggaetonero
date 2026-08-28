import { describe, expect, it } from 'vitest'

import { createCareer } from '@/engine/createCareer'
import { classifyTier, computeHitScore, generateReleases } from '@/engine/releaseEngine'
import { makeRng } from '@/engine/rng'
import type { ArtistProfile, Release } from '@/types/career'

const baseProfile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Colombia',
  city: 'Medellín',
  age: 19,
  genre: 'reggaeton',
  archetype: 'hitmaker',
}

const baseRelease: Omit<Release, 'hitScore' | 'tier'> = {
  title: 'x',
  year: 1,
  quality: 0,
  originality: 0,
  commerciality: 0,
  artistBuzz: 0,
  featurePower: 0,
  marketing: 0,
  timing: 0,
}

describe('classifyTier', () => {
  it('classifies boundaries correctly', () => {
    expect(classifyTier(0)).toBe('flop')
    expect(classifyTier(39)).toBe('flop')
    expect(classifyTier(40)).toBe('normal')
    expect(classifyTier(59)).toBe('normal')
    expect(classifyTier(60)).toBe('good')
    expect(classifyTier(74)).toBe('good')
    expect(classifyTier(75)).toBe('hit')
    expect(classifyTier(89)).toBe('hit')
    expect(classifyTier(90)).toBe('smash')
    expect(classifyTier(100)).toBe('smash')
  })
})

describe('computeHitScore', () => {
  it('returns the small base floor when every input is 0', () => {
    // A release is never quite worth nothing - there is a low fixed floor so an
    // early-career artist can still build a little momentum.
    expect(computeHitScore(baseRelease)).toBe(3)
    expect(classifyTier(computeHitScore(baseRelease))).toBe('flop')
  })

  it('returns 100 when every input is maxed', () => {
    const maxed = { ...baseRelease, quality: 100, originality: 100, commerciality: 100, artistBuzz: 100, featurePower: 100, marketing: 100, timing: 100 }
    expect(computeHitScore(maxed)).toBe(100)
  })
})

describe('generateReleases', () => {
  it('generates between 0 and 2 releases', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const rng = makeRng(seed)
      const releases = generateReleases(career, rng)
      expect(releases.length).toBeGreaterThanOrEqual(0)
      expect(releases.length).toBeLessThanOrEqual(2)
    }
  })

  it('gives every release a non-empty title and a valid tier', () => {
    const career = createCareer({ profile: baseProfile, seed: 3 })
    const rng = makeRng(3)
    const releases = generateReleases(career, rng)
    for (const { release } of releases) {
      expect(release.title.length).toBeGreaterThan(0)
      expect(['flop', 'normal', 'good', 'hit', 'smash']).toContain(release.tier)
    }
  })
})
