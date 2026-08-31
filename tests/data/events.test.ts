import { beforeEach, describe, expect, it } from 'vitest'

import { ALL_EVENTS, getEventById } from '@/data/events'
import { PEOPLE } from '@/data/people'
import { PRODUCERS } from '@/data/producers'
import { RIVAL_DEFS } from '@/data/fictionalArtists'
import { STAFF } from '@/data/staff'
import { createCareer } from '@/engine/createCareer'
import { applyStatDelta } from '@/engine/statPath'
import type { ArtistProfile, Career, TeamRole } from '@/types/career'

const baseProfile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Colombia',
  age: 19,
  genre: 'reggaeton',
  archetype: 'hitmaker',
}

const KNOWN_PERSON_IDS = new Set([
  ...PRODUCERS.all.map((p) => p.id),
  ...STAFF.all.map((s) => s.id),
  ...RIVAL_DEFS.all.map((r) => r.id),
  ...PEOPLE.all.map((p) => p.id),
])

const TEAM_ROLES: TeamRole[] = ['manager', 'producer', 'lawyer', 'publicist', 'bookingAgent']

let career: Career

beforeEach(() => {
  career = createCareer({ profile: baseProfile, seed: 1 })
})

describe('event catalog integrity', () => {
  it('has at least 50 events', () => {
    expect(ALL_EVENTS.length).toBeGreaterThanOrEqual(50)
  })

  it('offers a fresh artist more than one first decision', () => {
    // Guards against the early game collapsing back to a single event (or a
    // mis-gated business event) — see docs/decisions.md.
    let atLeastTwo = 0
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const fresh = createCareer({ profile: { stageName: 'x', country: 'Colombia' }, seed })
      const eligible = ALL_EVENTS.filter((e) => {
        try {
          return e.condition(fresh)
        } catch {
          return false
        }
      })
      if (eligible.length >= 2) atLeastTwo += 1
    }
    expect(atLeastTwo).toBe(8)
  })

  it('has unique ids', () => {
    const ids = ALL_EVENTS.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every event 2-4 choices with non-empty Spanish text', () => {
    for (const event of ALL_EVENTS) {
      expect(event.choices.length, event.id).toBeGreaterThanOrEqual(2)
      expect(event.choices.length, event.id).toBeLessThanOrEqual(4)
      expect(event.title.trim().length, event.id).toBeGreaterThan(0)
      expect(event.description.trim().length, event.id).toBeGreaterThan(0)
      for (const choice of event.choices) {
        expect(choice.text.trim().length, `${event.id} choice`).toBeGreaterThan(0)
      }
    }
  })

  it('points every delayedEffect at a real event', () => {
    for (const event of ALL_EVENTS) {
      for (const choice of event.choices) {
        for (const delayed of choice.delayedEffects ?? []) {
          expect(getEventById(delayed.eventId), `${event.id} -> ${delayed.eventId}`).toBeDefined()
        }
      }
    }
  })

  it('uses only resolvable effect targets', () => {
    for (const event of ALL_EVENTS) {
      for (const choice of event.choices) {
        for (const effect of choice.effects) {
          if (effect.kind === undefined || effect.kind === 'stat') {
            expect(() => applyStatDelta(career, effect.target, 0), `${event.id}: ${effect.target}`).not.toThrow()
          } else if (effect.kind === 'relationship') {
            expect(KNOWN_PERSON_IDS.has(effect.personId), `${event.id}: ${effect.personId}`).toBe(true)
          } else if (effect.kind === 'team') {
            // role may be omitted only for op: 'leave' (engine drops the weakest member)
            if (effect.role !== undefined) expect(TEAM_ROLES).toContain(effect.role)
            else expect(effect.op, `${event.id}: team effect without role`).toBe('leave')
          } else if (effect.kind === 'market') {
            expect(['penetrate', 'saturate', 'unlock']).toContain(effect.op)
          }
        }
      }
    }
  })

  it('evaluates every condition and weight without throwing', () => {
    for (const event of ALL_EVENTS) {
      expect(() => event.condition(career), event.id).not.toThrow()
      expect(() => event.weight(career), event.id).not.toThrow()
      expect(typeof event.weight(career), event.id).toBe('number')
    }
  })
})
