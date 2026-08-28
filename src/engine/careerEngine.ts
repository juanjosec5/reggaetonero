import { selectYearEvent } from '@/engine/eventEngine'
import { applyFinances } from '@/engine/financeEngine'
import { advanceMarkets } from '@/engine/marketEngine'
import { applyProgression, computeEra } from '@/engine/progressionEngine'
import { decayRelationships } from '@/engine/relationshipEngine'
import { progressRivals } from '@/engine/rivalEngine'
import type { Rng } from '@/engine/rng'
import { applyReleasesToCareer, generateReleases } from '@/engine/releaseEngine'
import { applyTeamBonuses, applyTeamUpkeep } from '@/engine/teamEngine'
import type { Career, CareerYear } from '@/types/career'

/**
 * Simulates one career year and returns a new Career object: ages the artist,
 * drifts stats, generates releases, recomputes finances, runs team upkeep,
 * relationship decay, market progression and rival drift, then fires a due
 * delayed effect or rolls one fresh event. The player's decision on that event
 * (if any) is applied afterward via `decisionEngine.applyChoice`.
 */
export function simulateYear(career: Career, rng: Rng): Career {
  const next = structuredClone(career)

  next.age += 1
  next.year += 1
  next.era = computeEra(next.year)

  applyProgression(next, rng)

  const releasesThisYear = generateReleases(next, rng)
  applyReleasesToCareer(next, releasesThisYear)
  applyFinances(
    next,
    releasesThisYear.map((r) => r.release),
  )

  applyTeamUpkeep(next)
  applyTeamBonuses(next)
  decayRelationships(next)
  advanceMarkets(next, rng)
  progressRivals(next, rng)

  const { event, remainingPendingEffects } = selectYearEvent(next, rng)
  next.pendingEffects = remainingPendingEffects

  const yearEntry: CareerYear = {
    year: next.year,
    age: next.age,
    era: next.era,
    releases: releasesThisYear.map((r) => r.release),
    eventId: event?.id,
    statsSnapshot: { ...next.stats },
  }
  next.history.push(yearEntry)

  return next
}
