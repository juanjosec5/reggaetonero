import { describe, expect, it } from 'vitest'

import { createCareer } from '@/engine/createCareer'
import { pickEligibleEvent, selectYearEvent } from '@/engine/eventEngine'
import { makeRng } from '@/engine/rng'
import type { ArtistProfile } from '@/types/career'

const baseProfile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Colombia',
  city: 'Medellín',
  age: 19,
  genre: 'reggaeton',
  archetype: 'hitmaker',
}

describe('pickEligibleEvent', () => {
  it('never returns an event whose condition is false', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    for (const seed of [1, 2, 3, 4, 5, 6, 7]) {
      const event = pickEligibleEvent(career, makeRng(seed))
      if (event) expect(event.condition(career)).toBe(true)
    }
  })

  it('never returns an already-fired oncePerCareer event', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    career.stats.hype = 100
    career.stats.fame = 100
    career.firedEventIds.push('music_first_studio_session', 'label_major_three_album_deal')

    for (const seed of [1, 2, 3, 4, 5]) {
      const event = pickEligibleEvent(career, makeRng(seed))
      expect(event?.id).not.toBe('music_first_studio_session')
      expect(event?.id).not.toBe('label_major_three_album_deal')
    }
  })
})

describe('selectYearEvent', () => {
  it('prioritizes a due delayed effect over a fresh eligible event', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    career.year = 5
    career.pendingEffects = [{ eventId: 'label_negotiation_backlash', triggerYear: 5 }]

    const { event, remainingPendingEffects } = selectYearEvent(career, makeRng(1))
    expect(event?.id).toBe('label_negotiation_backlash')
    expect(remainingPendingEffects).toEqual([])
  })

  it('leaves a not-yet-due delayed effect pending', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    career.year = 2
    career.pendingEffects = [{ eventId: 'label_negotiation_backlash', triggerYear: 5 }]

    const { remainingPendingEffects } = selectYearEvent(career, makeRng(1))
    expect(remainingPendingEffects).toEqual([{ eventId: 'label_negotiation_backlash', triggerYear: 5 }])
  })
})
