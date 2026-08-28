import { beforeEach, describe, expect, it } from 'vitest'

import { INTERNATIONAL_HUB } from '@/data/cities'
import { createCareer } from '@/engine/createCareer'
import { accrueCareerRecord } from '@/engine/recordEngine'
import { makeRng } from '@/engine/rng'
import type { Career } from '@/types/career'

let career: Career

beforeEach(() => {
  career = createCareer({ profile: { stageName: 'x', country: 'Colombia' }, seed: 5 })
})

describe('accrueCareerRecord', () => {
  it('adds shows and tickets scaled to fame + fanbase', () => {
    career.stats.fame = 60
    career.stats.fanbase = 55
    career.stats.livePower = 40
    accrueCareerRecord(career, makeRng(1))
    expect(career.record.clubShows + career.record.stadiumShows).toBeGreaterThan(0)
    expect(career.record.ticketsSold).toBeGreaterThan(10_000)
  })

  it('books stadiums instead of clubs once you are big', () => {
    career.stats.fame = 70
    career.stats.fanbase = 60
    career.stats.internationalReach = 40
    accrueCareerRecord(career, makeRng(2))
    expect(career.record.stadiumShows).toBeGreaterThan(0)
    expect(career.record.clubShows).toBe(0)
  })

  it('relocates to the hub once you break internationally, one-way', () => {
    expect(career.residence).toBe('Medellín')
    career.stats.internationalReach = 45
    accrueCareerRecord(career, makeRng(3))
    expect(career.residence).toBe(INTERNATIONAL_HUB)

    career.stats.internationalReach = 5 // slips back
    accrueCareerRecord(career, makeRng(4))
    expect(career.residence).toBe(INTERNATIONAL_HUB) // stays
  })

  it('accrues platinum plaques from a strong commercial catalogue', () => {
    career.stats.catalogStrength = 70
    career.stats.fame = 80
    accrueCareerRecord(career, makeRng(5))
    expect(career.record.platinumRecords).toBeGreaterThan(0)
  })
})
