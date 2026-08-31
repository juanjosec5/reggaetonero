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

  it('does not re-offer an event this career already saw while the pool is healthy', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    career.year = 6
    career.history = [
      { year: 3, eventId: 'music_trending_sound_pivot' },
      { year: 4, eventId: 'music_writers_block' },
    ] as typeof career.history

    for (let s = 0; s < 300; s++) {
      const id = pickEligibleEvent(career, makeRng(s))?.id
      expect(id).not.toBe('music_trending_sound_pivot')
      expect(id).not.toBe('music_writers_block')
    }
  })

  it('falls back to already-seen events only when too few fresh ones remain', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    career.year = 2
    // Stack the history so almost every year-<=3 eligible event has been seen;
    // selection must still return something rather than collapse.
    career.history = [
      'comeup_stage_name',
      'comeup_first_paid_slot',
      'comeup_first_check',
      'comeup_first_hater',
      'comeup_family_faith',
      'comeup_studio_hustle',
      'comeup_feature_swap',
      'comeup_viral_clip',
      'comeup_sketchy_manager',
      'comeup_freestyle_battle',
      'comeup_beat_pack_credit',
      'comeup_first_image',
      'music_first_studio_session',
      'money_day_job',
      'rel_barrio_crew',
      'media_local_radio',
    ].map((eventId, i) => ({ year: i + 1, eventId })) as typeof career.history

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
