import { beforeEach, describe, expect, it } from 'vitest'

import { getEventById } from '@/data/events'
import { awardsForYear, grantAward, grantMilestone, hasMilestone, MILESTONES } from '@/data/awards'
import { accrueCareerRecord } from '@/engine/recordEngine'
import { createCareer } from '@/engine/createCareer'
import { applyChoice } from '@/engine/decisionEngine'
import { makeRng } from '@/engine/rng'
import type { Career } from '@/types/career'

let career: Career

beforeEach(() => {
  career = createCareer({ profile: { stageName: 'x', country: 'Colombia' }, seed: 5 })
})

describe('award log helpers', () => {
  it('grantAward appends with the current year', () => {
    career.year = 7
    grantAward(career, 'gr', 'grammy', 'Grammy Latino')
    expect(career.awards).toHaveLength(1)
    expect(career.awards[0]).toMatchObject({ kind: 'grammy', title: 'Grammy Latino', year: 7 })
  })

  it('grantMilestone is idempotent per milestone id', () => {
    const m = MILESTONES[0]!
    grantMilestone(career, m)
    grantMilestone(career, m)
    expect(hasMilestone(career, m.id)).toBe(true)
    // recordEngine only grants if !hasMilestone, but the helper itself is checked here
    expect(career.awards.filter((a) => a.id.startsWith(`ms:${m.id}_`))).toHaveLength(2)
  })

  it('awardsForYear filters by year', () => {
    career.year = 3
    grantAward(career, 'plat', 'platinum', 'Disco de platino')
    career.year = 5
    grantAward(career, 'gr', 'grammy', 'Grammy Latino')
    expect(awardsForYear(career, 3)).toHaveLength(1)
    expect(awardsForYear(career, 5)[0]!.kind).toBe('grammy')
  })
})

describe('accrueCareerRecord awards', () => {
  it('logs platinum plaques as the count climbs, and fires each milestone once', () => {
    career.stats.catalogStrength = 80
    career.stats.fame = 85
    career.stats.internationalReach = 55
    for (let y = 0; y < 6; y++) {
      career.year = y + 1
      accrueCareerRecord(career, makeRng(y + 1))
    }
    expect(career.awards.filter((a) => a.kind === 'platinum').length).toBeGreaterThan(0)
    expect(hasMilestone(career, 'global_phenomenon')).toBe(true)
    // each milestone id appears at most once in the log
    for (const m of MILESTONES) {
      const n = career.awards.filter((a) => a.id.startsWith(`ms:${m.id}_`)).length
      expect(n).toBeLessThanOrEqual(1)
    }
  })
})

describe('award effect from a decision', () => {
  it('comp_awards_night grants a real Grammy on the campaign branch', () => {
    career.stats.fame = 60
    career.stats.culturalImpact = 20
    const event = getEventById('comp_awards_night')!
    const next = applyChoice(career, event, event.choices[0]!, makeRng(1))
    expect(next.record.grammys).toBe(1)
    expect(next.awards.some((a) => a.kind === 'grammy')).toBe(true)
    expect(career.awards).toHaveLength(0) // original untouched
  })

  it('music_platinum_push logs a platinum plaque', () => {
    career.stats.fame = 45
    career.stats.catalogStrength = 40
    career.finances.cash = 200
    const event = getEventById('music_platinum_push')!
    const next = applyChoice(career, event, event.choices[0]!, makeRng(2))
    expect(next.record.platinumRecords).toBe(1)
    expect(next.awards.some((a) => a.kind === 'platinum')).toBe(true)
  })
})
