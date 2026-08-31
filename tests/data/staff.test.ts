import { describe, expect, it } from 'vitest'

import { PRODUCERS, pickProducer } from '@/data/producers'
import { pickStaff, staffForRole } from '@/data/staff'
import { makeRng } from '@/engine/rng'

describe('pickStaff budget handling', () => {
  it('stays within budget when something is affordable', () => {
    const pick = pickStaff('manager', makeRng(3), 120)
    expect(pick).toBeDefined()
    expect(pick!.cost).toBeLessThanOrEqual(120)
  })

  it('falls back to the cheapest candidate when nothing fits the budget', () => {
    const cheapest = [...staffForRole('manager')].sort((a, b) => a.cost - b.cost)[0]!
    for (const seed of [1, 2, 3, 4, 5]) {
      expect(pickStaff('manager', makeRng(seed), 1)!.id).toBe(cheapest.id)
    }
  })
})

describe('pickProducer budget handling', () => {
  it('falls back to the cheapest producer when nothing fits the budget', () => {
    const cheapest = Math.min(...PRODUCERS.all.map((p) => p.cost))
    expect(pickProducer(makeRng(1), { maxCost: 1 })!.cost).toBe(cheapest)
  })
})
