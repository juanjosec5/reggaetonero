import { describe, expect, it } from 'vitest'

import { createCareer } from '@/engine/createCareer'
import { applyChoice } from '@/engine/decisionEngine'
import { makeRng } from '@/engine/rng'
import type { ArtistProfile, CareerChoice, CareerEvent } from '@/types/career'

const baseProfile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Colombia',
  age: 19,
  genre: 'reggaeton',
  archetype: 'hitmaker',
}

const testEvent: CareerEvent = {
  id: 'test_event',
  category: 'music',
  title: 'Evento de prueba',
  description: 'Descripción de prueba',
  visibleRisk: 'low',
  condition: () => true,
  weight: () => 1,
  oncePerCareer: true,
  choices: [],
}

describe('applyChoice', () => {
  it('resolves each effect within its range and clamps the result', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    career.attributes.talent = 98

    const choice: CareerChoice = {
      text: 'Elegir A',
      style: 'ambitious',
      effects: [{ target: 'attributes.talent', min: 10, max: 20 }],
    }

    const next = applyChoice(career, testEvent, choice, makeRng(5))
    expect(next.attributes.talent).toBe(100) // clamped
    expect(career.attributes.talent).toBe(98) // original untouched
  })

  it('marks a oncePerCareer event as fired', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    const choice: CareerChoice = { text: 'x', style: 'safe', effects: [] }
    const next = applyChoice(career, testEvent, choice, makeRng(1))
    expect(next.firedEventIds).toContain('test_event')
  })

  it('converts a relative delayed-effect triggerYear into an absolute year', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    career.year = 4
    const choice: CareerChoice = {
      text: 'x',
      style: 'safe',
      effects: [],
      delayedEffects: [{ eventId: 'followup_event', triggerYear: 3 }],
    }
    const next = applyChoice(career, testEvent, choice, makeRng(1))
    expect(next.pendingEffects).toEqual([{ eventId: 'followup_event', triggerYear: 7 }])
  })

  it('records the choice text on the matching history entry', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    career.history.push({
      year: 1,
      age: 19,
      era: 'underground',
      releases: [],
      eventId: 'test_event',
      statsSnapshot: { ...career.stats },
    })
    const choice: CareerChoice = { text: 'Mi elección', style: 'safe', effects: [] }
    const next = applyChoice(career, testEvent, choice, makeRng(1))
    expect(next.history[0]?.choiceTaken).toBe('Mi elección')
  })

  it('is deterministic for the same seed', () => {
    const career = createCareer({ profile: baseProfile, seed: 1 })
    const choice: CareerChoice = {
      text: 'x',
      style: 'safe',
      effects: [{ target: 'finances.cash', min: -50, max: 50 }],
    }
    const a = applyChoice(career, testEvent, choice, makeRng(9))
    const b = applyChoice(career, testEvent, choice, makeRng(9))
    expect(a.finances.cash).toBe(b.finances.cash)
  })
})
