import { describe, expect, it } from 'vitest'

import { createCareer } from '@/engine/createCareer'
import { computeIdentity, MIN_DECISIONS } from '@/engine/identityEngine'
import type { CareerStats, CareerYear, ChoiceStyle } from '@/types/career'

const EMPTY_STATS = {} as CareerStats

function careerWithChoices(styles: ChoiceStyle[]) {
  const career = createCareer({ profile: { stageName: 'X', country: 'Colombia', age: 20 }, seed: 1 })
  career.history = styles.map(
    (style, i): CareerYear => ({
      year: i + 1,
      age: 20 + i,
      era: 'underground',
      releases: [],
      choiceStyle: style,
      statsSnapshot: EMPTY_STATS,
    }),
  )
  return career
}

describe('computeIdentity', () => {
  it('is undefined until MIN_DECISIONS choices are recorded', () => {
    const career = careerWithChoices(Array(MIN_DECISIONS - 1).fill('commercial'))
    const identity = computeIdentity(career)
    expect(identity.defined).toBe(false)
    expect(identity.label).toBe('Sin definir')
  })

  it('resolves to the dominant single style', () => {
    const career = careerWithChoices(['commercial', 'commercial', 'commercial', 'safe'])
    const identity = computeIdentity(career)
    expect(identity.defined).toBe(true)
    expect(identity.id).toBe('el_del_billete')
  })

  it('resolves a blend when a secondary style is close behind', () => {
    const career = careerWithChoices(['ambitious', 'ambitious', 'commercial', 'commercial'])
    expect(computeIdentity(career).id).toBe('el_tiburon')
  })

  it('ignores years with no recorded choice style', () => {
    const career = careerWithChoices(['creative', 'creative', 'creative'])
    career.history.push({
      year: 4,
      age: 24,
      era: 'first_buzz',
      releases: [],
      statsSnapshot: EMPTY_STATS,
    })
    expect(computeIdentity(career).id).toBe('el_raro')
  })

  it('is deterministic for a fixed history', () => {
    const a = careerWithChoices(['loyal', 'loyal', 'safe', 'loyal'])
    const b = careerWithChoices(['loyal', 'loyal', 'safe', 'loyal'])
    expect(computeIdentity(a)).toEqual(computeIdentity(b))
  })
})
