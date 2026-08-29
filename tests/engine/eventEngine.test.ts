import { describe, expect, it } from 'vitest'

import { createCareer } from '@/engine/createCareer'
import { pickEligibleEvent, selectYearEvent } from '@/engine/eventEngine'
import { makeRng } from '@/engine/rng'
import type { ArtistProfile } from '@/types/career'

const baseProfile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Colombia',
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

  it('damps an event that fired last year vs. a never-fired peer', () => {
    const base = createCareer({ profile: baseProfile, seed: 1 })
    base.year = 5

    const withoutHistory = { ...base, history: [] as typeof base.history }
    const withRecent = {
      ...base,
      history: [{ year: 4, eventId: 'music_trending_sound_pivot' } as (typeof base.history)[number]],
    }

    const hits = (career: typeof base) => {
      let n = 0
      for (let s = 0; s < 400; s++) {
        if (pickEligibleEvent(career, makeRng(s))?.id === 'music_trending_sound_pivot') n++
      }
      return n
    }

    expect(hits(withRecent)).toBeLessThan(hits(withoutHistory))
  })

  it('still returns an event when the only eligible ones fired last year', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    career.year = 5
    // recencyFactor floors at 0.15, never 0 - selection must not collapse.
    career.history = [
      { year: 4, eventId: 'music_trending_sound_pivot' },
      { year: 4, eventId: 'music_writers_block' },
    ] as typeof career.history
    for (const seed of [1, 2, 3, 4, 5]) {
      expect(pickEligibleEvent(career, makeRng(seed))).toBeDefined()
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
