import { beforeEach, describe, expect, it } from 'vitest'

import { getEventById } from '@/data/events'
import { createCareer } from '@/engine/createCareer'
import { applyChoice } from '@/engine/decisionEngine'
import {
  adjustRelationship,
  decayRelationships,
  ensureRelationship,
  rememberInteraction,
} from '@/engine/relationshipEngine'
import { advanceMarkets, getMarketState } from '@/engine/marketEngine'
import { nearestRival, progressRivals } from '@/engine/rivalEngine'
import { makeRng } from '@/engine/rng'
import { applyTeamUpkeep, hireTeamMember } from '@/engine/teamEngine'
import type { ArtistProfile, Career } from '@/types/career'

const baseProfile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Puerto Rico',
  city: 'San Juan',
  age: 19,
  genre: 'reggaeton',
  archetype: 'perreo_king',
}

let career: Career

beforeEach(() => {
  career = createCareer({ profile: baseProfile, seed: 42 })
})

describe('relationshipEngine', () => {
  it('creates a named relationship on first touch and clamps fields', () => {
    adjustRelationship(career, 'prod_nova', 'trust', 999)
    const rel = ensureRelationship(career, 'prod_nova')
    expect(rel.name).toBe('Nova')
    expect(rel.role).toBe('producer')
    expect(rel.trust).toBe(100)
  })

  it('decays trust toward the baseline each year', () => {
    adjustRelationship(career, 'prod_nova', 'trust', 40) // 50 -> 90
    decayRelationships(career)
    const rel = ensureRelationship(career, 'prod_nova')
    expect(rel.trust).toBeLessThan(90)
    expect(rel.trust).toBeGreaterThan(50)
  })

  it('records interaction memory', () => {
    rememberInteraction(career, 'rival_bravo', 'comp_rival_subtweet', 3, 'Le respondiste', -12)
    expect(ensureRelationship(career, 'rival_bravo').memory).toHaveLength(1)
  })
})

describe('teamEngine', () => {
  it('hires a producer that fits the genre', () => {
    career.finances.cash = 500
    hireTeamMember(career, 'producer', makeRng(1))
    expect(career.team.producer).toBeDefined()
    expect(career.team.producer!.sinceYear).toBe(career.year)
  })

  it('bills salary and drops loyalty when cash cannot cover pay', () => {
    hireTeamMember(career, 'manager', makeRng(1), 'mgr_la_jefa')
    career.finances.cash = 0
    const before = career.team.manager!.loyalty
    applyTeamUpkeep(career)
    expect(career.team.manager?.loyalty ?? 0).toBeLessThan(before)
  })

  it('lets a collapsed-loyalty member walk', () => {
    hireTeamMember(career, 'lawyer', makeRng(1), 'law_ferro')
    career.team.lawyer!.loyalty = 5
    career.finances.cash = 0
    applyTeamUpkeep(career)
    expect(career.team.lawyer).toBeUndefined()
  })
})

describe('marketEngine', () => {
  it('grows the home market and can unlock adjacent markets', () => {
    career.stats.fame = 80
    const home = getMarketState(career, 'pr')!
    home.penetration = 50
    for (let i = 0; i < 5; i++) advanceMarkets(career, makeRng(i + 1))
    expect(getMarketState(career, 'pr')!.penetration).toBeGreaterThan(50)
    expect(getMarketState(career, 'do')!.unlocked || getMarketState(career, 'us_latin')!.unlocked).toBe(true)
    expect(career.stats.internationalReach).toBeGreaterThan(0)
  })
})

describe('rivalEngine', () => {
  it('picks the rival closest in fame', () => {
    career.stats.fame = 24
    career.rivals = [
      { id: 'a', name: 'A', archetype: 'hitmaker', fame: 10, credibility: 10, style: '', relationship: 0 },
      { id: 'b', name: 'B', archetype: 'street', fame: 25, credibility: 10, style: '', relationship: 0 },
    ]
    expect(nearestRival(career)?.id).toBe('b')
  })

  it('keeps rival fame within 0-100', () => {
    for (let i = 0; i < 20; i++) progressRivals(career, makeRng(i + 1))
    for (const rival of career.rivals) {
      expect(rival.fame).toBeGreaterThanOrEqual(0)
      expect(rival.fame).toBeLessThanOrEqual(100)
    }
  })
})

describe('applyChoice with Phase 2 effects', () => {
  it('resolves a team-hire effect through a choice', () => {
    career.finances.cash = 500
    career.stats.hype = 40
    const event = getEventById('mgmt_first_manager')!
    const hireChoice = event.choices[0]!
    const next = applyChoice(career, event, hireChoice, makeRng(3))
    expect(next.team.manager).toBeDefined()
    expect(career.team.manager).toBeUndefined() // original untouched
  })

  it('resolves a rival relationship effect against the nearest rival', () => {
    career.stats.fame = career.rivals[0]!.fame
    const event = getEventById('comp_rival_subtweet')!
    const dissChoice = event.choices[0]!
    const next = applyChoice(career, event, dissChoice, makeRng(7))
    const totalRelationship = next.rivals.reduce((s, r) => s + r.relationship, 0)
    expect(totalRelationship).toBeLessThan(0)
  })
})
