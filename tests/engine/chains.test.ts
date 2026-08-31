import { describe, expect, it } from 'vitest'

import { ALL_EVENTS, getEventById } from '@/data/events'
import { simulateYear } from '@/engine/careerEngine'
import { createCareer } from '@/engine/createCareer'
import { applyChoice } from '@/engine/decisionEngine'
import { makeRng } from '@/engine/rng'
import { getStatValue } from '@/engine/statPath'
import type { ArtistProfile, Career } from '@/types/career'

const profile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Colombia',
  age: 19,
  genre: 'reggaeton',
  archetype: 'hitmaker',
}

describe('delayed-effect chains', () => {
  it('schedules a follow-up as an absolute year and fires it exactly then', () => {
    const rng = makeRng(99)
    let c: Career = createCareer({ profile, seed: 99 })
    for (let i = 0; i < 3; i++) c = simulateYear(c, rng) // → year 3

    const trigger = getEventById('label_major_three_album_deal')!
    c = applyChoice(c, trigger, trigger.choices[0]!, rng) // "Firmar el contrato" → +3y

    const pending = c.pendingEffects.find((e) => e.eventId === 'setback_label_shelves_album')
    expect(pending?.triggerYear).toBe(6)

    while (c.year < 6) c = simulateYear(c, rng)
    expect(c.history.at(-1)?.eventId).toBe('setback_label_shelves_album')
    expect(c.pendingEffects.some((e) => e.eventId === 'setback_label_shelves_album')).toBe(false)
  })

  it('keeps chains well-formed and shallow across many playthroughs', () => {
    // every follow-up-only event (never rolled: weight is a constant 0)
    const followUps = new Set(
      ALL_EVENTS.filter((e) => {
        try {
          return e.weight(createCareer({ profile, seed: 1 })) === 0
        } catch {
          return false
        }
      }).map((e) => e.id),
    )
    expect(followUps.size).toBeGreaterThan(8)

    const fired = new Set<string>()
    let maxDepth = 0

    for (let s = 0; s < 160; s++) {
      const rng = makeRng(s * 31 + 1)
      let c: Career = createCareer({ profile: { ...profile, stageName: `Sim ${s}` }, seed: s })
      // rough per-chain depth: a follow-up inherits its parent's depth + 1
      const depthOf = new Map<string, number>()

      for (let y = 0; y < 14; y++) {
        // no pending effect may sit un-fireable — it must carry a real trigger
        for (const p of c.pendingEffects) {
          const ok =
            p.triggerYear !== undefined ||
            (p.triggerStat !== undefined && p.minimumValue !== undefined && canRead(c, p.triggerStat))
          expect(ok, `malformed pending effect ${p.eventId}`).toBe(true)
        }

        c = simulateYear(c, rng)
        const eid = c.history.at(-1)?.eventId
        if (!eid) continue
        fired.add(eid)

        const ev = getEventById(eid)
        if (!ev?.choices.length) continue
        const choice = ev.choices[s % ev.choices.length]!
        const parentDepth = followUps.has(eid) ? (depthOf.get(eid) ?? 1) : 0
        maxDepth = Math.max(maxDepth, parentDepth)
        for (const d of choice.delayedEffects ?? []) {
          depthOf.set(d.eventId, parentDepth + 1)
        }
        c = applyChoice(c, ev, choice, rng)
      }
    }

    expect(maxDepth).toBeLessThanOrEqual(4)
    // the load-bearing chains all reach their follow-up somewhere in the run
    for (const id of [
      'mgmt_manager_conflict',
      'setback_label_shelves_album',
      'controversy_sample_lawsuit',
      'rel_producer_loyalty_test',
      'rel_beatmaker_wants_his_cut',
    ]) {
      expect(fired.has(id), `chain never reached ${id}`).toBe(true)
    }
  })
})

function canRead(c: Career, target: string): boolean {
  try {
    getStatValue(c, target)
    return true
  } catch {
    return false
  }
}
