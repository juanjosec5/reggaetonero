import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, toRaw } from 'vue'

import { homeCity } from '@/data/cities'
import { LEGACY_ERA_REMAP } from '@/data/eras'
import { getEventById } from '@/data/events'
import { pickRivals } from '@/data/fictionalArtists'
import { initialMarkets } from '@/data/markets'
import { simulateYear } from '@/engine/careerEngine'
import { MAX_CAREER_YEAR } from '@/engine/constants'
import { createCareer } from '@/engine/createCareer'
import { applyChoice as resolveChoice } from '@/engine/decisionEngine'
import { retire as retireCareer } from '@/engine/legacyEngine'
import { computeEra } from '@/engine/progressionEngine'
import { hashSeed, makeRng } from '@/engine/rng'
import { CURRENT_SAVE_VERSION } from '@/types/career'
import type { Career, CareerAward, CareerChoice, CareerMode, CreationInput } from '@/types/career'

const STORAGE_KEY = 'reggaetonero:save'

// Salts keep the year-advance roll and the choice-resolution roll for the
// same career year from landing on the same derived seed.
const ADVANCE_SALT = 1
const CHOICE_SALT = 2

/**
 * Brings a persisted career up to the current shape.
 * - v1 (Phase 1, no `saveVersion`): predates team memory, markets and rival ids.
 * - v2 → v3: the derived identity now reads `history[].choiceStyle`, which old
 *   entries lack - nothing to backfill, the identity just reads "Sin definir"
 *   until fresh decisions accrue. `artist.city` on old saves is now ignored.
 * - v3 → v4: rivals now hide until a decision surfaces them; existing rivals
 *   were already visible, so mark them discovered.
 * - v4 → v5: fixed 20-year arc. Remap the old 8-era values to the 5-era model
 *   and backfill `peakFame` from current fame.
 * - v5 → v6: new record counters, `residence`, per-year snapshots.
 * - v6 → v7: rebuild the `awards` log from the existing counters.
 * - v7 → v8: career arc shortened to 22 → 35; re-derive eras.
 */
export function migrateSave(raw: Career): Career {
  const career = raw as Career & { saveVersion?: number }
  const version = career.saveVersion ?? 1
  if (version >= CURRENT_SAVE_VERSION) return career

  if (version < 2) {
    career.markets = career.markets?.length ? career.markets : initialMarkets(career.artist.country)
    // Phase 1 saved no rivals at all - without them every competition event and
    // rival effect is dead, so seed a fresh set from the career's own seed.
    career.rivals = career.rivals?.length
      ? career.rivals.map((rival, i) => ({
          id: rival.id ?? `rival_legacy_${i}`,
          name: rival.name,
          archetype: rival.archetype ?? 'hitmaker',
          fame: rival.fame ?? 0,
          credibility: rival.credibility ?? 0,
          style: rival.style ?? '',
          relationship: rival.relationship ?? 0,
        }))
      : pickRivals(makeRng(career.seed), 3)
    career.relationships = (career.relationships ?? []).map((rel) => ({
      ...rel,
      name: rel.name ?? rel.personId,
      role: rel.role ?? 'collaborator',
      memory: rel.memory ?? [],
    }))
  }

  if (version < 4) {
    // Rivals now hide until a decision surfaces them; ones from an older save
    // were already on screen, so keep them visible.
    for (const rival of career.rivals ?? []) rival.discovered = true
  }

  if (version < 5) {
    const c = career as Career & { peakFame?: number }
    c.peakFame = c.peakFame ?? c.stats.fame
    c.era = LEGACY_ERA_REMAP[c.era as string] ?? computeEra(c.year)
    for (const entry of c.history ?? []) {
      entry.era = LEGACY_ERA_REMAP[entry.era as string] ?? computeEra(entry.year)
    }
  }

  if (version < 6) {
    const rec = career.record as unknown as Record<string, number>
    for (const k of ['platinumRecords', 'grammys', 'billboards', 'clubShows', 'stadiumShows', 'ticketsSold']) {
      rec[k] = rec[k] ?? 0
    }
    career.residence = career.residence ?? homeCity(career.artist.country)
    // Per-year record/residence snapshots can't be reconstructed - point every
    // old year at the current totals so the era table has something to show.
    for (const entry of career.history ?? []) {
      entry.recordSnapshot = entry.recordSnapshot ?? { ...career.record }
      entry.residence = entry.residence ?? career.residence
    }
  }

  if (version < 7) {
    // Rebuild the awards log from the existing counters (year unknown -> now).
    career.awards = career.awards ?? []
    if (career.awards.length === 0) {
      const push = (kind: CareerAward['kind'], title: string, n: number) => {
        for (let i = 0; i < n; i++) {
          career.awards.push({ id: `${kind}_legacy_${i}`, kind, title, year: career.year })
        }
      }
      push('grammy', 'Grammy Latino', career.record.grammys ?? 0)
      push('billboard', 'Premio Billboard', career.record.billboards ?? 0)
      push('platinum', 'Disco de platino', career.record.platinumRecords ?? 0)
    }
  }

  if (version < 8) {
    // Career arc shortened to 22 → 35; re-derive eras under the new thresholds.
    career.era = computeEra(career.year)
    for (const entry of career.history ?? []) entry.era = computeEra(entry.year)
  }

  career.saveVersion = CURRENT_SAVE_VERSION
  return career
}

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

  function startCareer(profile: CreationInput, seed: number, options: { mode?: CareerMode } = {}) {
    career.value = createCareer({ profile, seed, mode: options.mode ?? 'quick' })
    save()
  }

  const canAdvance = computed(
    () =>
      hasActiveCareer.value && !pendingChoice.value && (career.value?.year ?? 0) < MAX_CAREER_YEAR,
  )

  function advanceYear() {
    if (!career.value || career.value.status !== 'active' || pendingChoice.value) return
    if (career.value.year >= MAX_CAREER_YEAR) return
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
    career.value = migrateSave(JSON.parse(raw) as Career)
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
    canAdvance,
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
