import { ALL_EVENTS, getEventById } from '@/data/events'
import type { Rng } from '@/engine/rng'
import { weightedPick } from '@/engine/rng'
import { getStatValue } from '@/engine/statPath'
import type { Career, CareerEvent, DelayedEffect } from '@/types/career'

function isDue(career: Career, effect: DelayedEffect): boolean {
  if (effect.triggerYear !== undefined) return career.year >= effect.triggerYear
  if (effect.triggerStat !== undefined && effect.minimumValue !== undefined) {
    try {
      return getStatValue(career, effect.triggerStat) >= effect.minimumValue
    } catch {
      return false
    }
  }
  return false
}

function isEligible(career: Career, event: CareerEvent): boolean {
  if (event.oncePerCareer && career.firedEventIds.includes(event.id)) return false
  return event.condition(career)
}

export function pickEligibleEvent(career: Career, rng: Rng): CareerEvent | undefined {
  const eligible = ALL_EVENTS.filter((event) => isEligible(career, event))
  return weightedPick(eligible, (event) => event.weight(career), rng)
}

export interface YearEventSelection {
  event: CareerEvent | undefined
  remainingPendingEffects: DelayedEffect[]
}

/**
 * Picks at most one event for the year. A due delayed effect takes priority
 * over a freshly rolled eligible event, so follow-up storylines actually land.
 */
export function selectYearEvent(career: Career, rng: Rng): YearEventSelection {
  const due = career.pendingEffects.find((effect) => isDue(career, effect))
  if (due) {
    return {
      event: getEventById(due.eventId),
      remainingPendingEffects: career.pendingEffects.filter((effect) => effect !== due),
    }
  }

  return { event: pickEligibleEvent(career, rng), remainingPendingEffects: career.pendingEffects }
}
