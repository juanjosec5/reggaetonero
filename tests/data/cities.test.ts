import { describe, expect, it } from 'vitest'

import { INTERNATIONAL_HUB, relocationTarget, sceneTier, sceneVenueBoost } from '@/data/cities'
import { initialMarkets } from '@/data/markets'

const withMarket = (country: string, id: string, penetration: number) => {
  const markets = initialMarkets(country)
  const m = markets.find((x) => x.id === id)!
  m.unlocked = true
  m.penetration = penetration
  return markets
}

describe('relocationTarget', () => {
  it('keeps a local act home', () => {
    expect(relocationTarget('Caracas', 8, initialMarkets('Venezuela'))).toBeNull()
  })

  it('pulls a broken-out artist toward the biggest established market hub', () => {
    expect(relocationTarget('Caracas', 24, withMarket('Venezuela', 'mx', 55))).toBe('Ciudad de México')
    expect(relocationTarget('Caracas', 24, withMarket('Venezuela', 'us_latin', 55))).toBe(INTERNATIONAL_HUB)
  })

  it('falls back to the crossover hub when reach is high but no market dominates', () => {
    expect(relocationTarget('Medellín', 30, initialMarkets('Colombia'))).toBe(INTERNATIONAL_HUB)
  })

  it('never moves sideways or backward', () => {
    // Already in Miami (tier 2): a tier-1 market hub must not pull you back.
    expect(relocationTarget('Miami', 40, withMarket('Colombia', 'mx', 70))).toBeNull()
    // Home city that is itself a regional hub: a same-tier market hub is a no-op.
    expect(relocationTarget('Medellín', 25, withMarket('Colombia', 'co', 70))).toBe(INTERNATIONAL_HUB)
  })
})

describe('scene lookups', () => {
  it('ranks cities by tier and gives a home city no boost', () => {
    expect(sceneTier('Caracas')).toBe(0)
    expect(sceneTier('Medellín')).toBe(1)
    expect(sceneTier('Miami')).toBe(2)
    expect(sceneTier('Los Ángeles')).toBe(3)
    expect(sceneVenueBoost('Caracas')).toBe(0)
    expect(sceneVenueBoost('Miami')).toBeGreaterThan(sceneVenueBoost('Medellín'))
  })
})
