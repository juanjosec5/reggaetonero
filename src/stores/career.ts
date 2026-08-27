import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, toRaw } from 'vue'

import { getEventById } from '@/data/events'
import type { EmphasisId } from '@/data/emphasis'
import type { OpportunityId } from '@/data/opportunities'
import { simulateYear } from '@/engine/careerEngine'
import { createCareer } from '@/engine/createCareer'
import { applyChoice as resolveChoice } from '@/engine/decisionEngine'
import { retire as retireCareer } from '@/engine/legacyEngine'
import { hashSeed, makeRng } from '@/engine/rng'
import type { ArtistProfile, Career, CareerChoice, CareerMode } from '@/types/career'

const STORAGE_KEY = 'reggaetonero:save'

// Salts keep the year-advance roll and the choice-resolution roll for the
// same career year from landing on the same derived seed.
const ADVANCE_SALT = 1
const CHOICE_SALT = 2

export const useCareerStore = defineStore('career', () => {
  const career = ref<Career | null>(null)

  const hasActiveCareer = computed(() => career.value !== null && career.value.status === 'active')
  const isRetired = computed(() => career.value?.status === 'retired')

  const pendingChoice = computed(() => {
    const lastYear = career.value?.history.at(-1)
    return Boolean(lastYear?.eventId && !lastYear.choiceTaken)
  })

  // Only surface the event while it's still unresolved - once a choice has
  // been applied, `choiceTaken` is set and the decision panel should close
  // even though the year's `eventId` stays on the history entry as a record.
  const currentEvent = computed(() => {
    if (!pendingChoice.value) return undefined
    const eventId = career.value?.history.at(-1)?.eventId
    return eventId ? getEventById(eventId) : undefined
  })

  function startCareer(
    profile: ArtistProfile,
    seed: number,
    options: { mode?: CareerMode; emphasis?: EmphasisId; opportunity?: OpportunityId } = {},
  ) {
    career.value = createCareer({ profile, seed, mode: options.mode ?? 'quick', ...options })
    save()
  }

  function advanceYear() {
    if (!career.value || career.value.status !== 'active' || pendingChoice.value) return
    const rng = makeRng(hashSeed(career.value.seed, career.value.year + 1, ADVANCE_SALT))
    career.value = simulateYear(toRaw(career.value), rng)
    save()
  }

  function applyChoice(choice: CareerChoice) {
    if (!career.value || !currentEvent.value) return
    const rng = makeRng(hashSeed(career.value.seed, career.value.year, CHOICE_SALT))
    career.value = resolveChoice(toRaw(career.value), currentEvent.value, choice, rng)
    save()
  }

  function retire() {
    if (!career.value) return
    career.value = retireCareer(toRaw(career.value))
    save()
  }

  function save() {
    if (!career.value) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(career.value))
  }

  function hasSave(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null
  }

  function load(): boolean {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    career.value = JSON.parse(raw) as Career
    return true
  }

  function clearSave() {
    localStorage.removeItem(STORAGE_KEY)
    career.value = null
  }

  return {
    career,
    hasActiveCareer,
    isRetired,
    currentEvent,
    pendingChoice,
    startCareer,
    advanceYear,
    applyChoice,
    retire,
    save,
    load,
    hasSave,
    clearSave,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCareerStore, import.meta.hot))
}
