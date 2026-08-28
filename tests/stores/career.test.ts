import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useCareerStore } from '@/stores/career'
import type { ArtistProfile } from '@/types/career'

const profile: ArtistProfile = {
  stageName: 'MC Prueba',
  country: 'Colombia',
  age: 19,
  genre: 'reggaeton',
  archetype: 'perreo_king',
}

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

describe('career store', () => {
  it('has no active career before starting one', () => {
    const store = useCareerStore()
    expect(store.hasActiveCareer).toBe(false)
  })

  it('starts a career and persists it', () => {
    const store = useCareerStore()
    store.startCareer(profile, 42)
    expect(store.hasActiveCareer).toBe(true)
    expect(store.hasSave()).toBe(true)
  })

  it('blocks advanceYear while a decision is pending', () => {
    const store = useCareerStore()
    store.startCareer(profile, 42)

    // Keep advancing until an event with choices shows up, or bail after a
    // generous number of years so the test can't hang if content changes.
    let guard = 0
    while (!store.currentEvent && guard < 30) {
      store.advanceYear()
      guard++
    }

    if (store.currentEvent) {
      const yearBefore = store.career?.year
      store.advanceYear() // should no-op: pending choice blocks it
      expect(store.career?.year).toBe(yearBefore)
    }
  })

  it('applyChoice resolves the pending event and unblocks advanceYear', () => {
    const store = useCareerStore()
    store.startCareer(profile, 42)

    let guard = 0
    while (!store.currentEvent && guard < 30) {
      store.advanceYear()
      guard++
    }

    if (store.currentEvent) {
      const choice = store.currentEvent.choices[0]!
      store.applyChoice(choice)
      expect(store.pendingChoice).toBe(false)
      // Regression guard: currentEvent must close along with pendingChoice,
      // otherwise the decision panel stays open and choices can be re-applied.
      expect(store.currentEvent).toBeUndefined()

      const yearBefore = store.career?.year
      store.advanceYear()
      expect(store.career?.year).toBe((yearBefore ?? 0) + 1)
    }
  })

  it('retire marks the career retired with a legacy verdict', () => {
    const store = useCareerStore()
    store.startCareer(profile, 42)
    store.retire()
    expect(store.isRetired).toBe(true)
    expect(store.career?.legacy?.verdictId).toBeTruthy()
  })

  it('load restores a career saved by another store instance', () => {
    const a = useCareerStore()
    a.startCareer(profile, 99)
    const savedId = a.career?.id

    setActivePinia(createPinia())
    const b = useCareerStore()
    expect(b.hasActiveCareer).toBe(false)
    const loaded = b.load()
    expect(loaded).toBe(true)
    expect(b.career?.id).toBe(savedId)
  })

  it('clearSave removes the save and resets state', () => {
    const store = useCareerStore()
    store.startCareer(profile, 1)
    store.clearSave()
    expect(store.hasSave()).toBe(false)
    expect(store.career).toBeNull()
  })
})
