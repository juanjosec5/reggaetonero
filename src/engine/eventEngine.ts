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

// Weight multiplier for how recently a repeatable event last fired, so the same
// prompt doesn't come back year after year. Index 0 = fired last year.
const RECENCY_DECAY = [0.15, 0.4, 0.7] as const

/** 1 if the event never fired or fired 4+ years ago, otherwise a decayed factor. */
function recencyFactor(career: Career, eventId: string): number {
  const h = career.history
  // `history` here is last year's and earlier - this year's entry isn't pushed yet.
  for (let i = h.length - 1; i >= 0; i--) {
    if (h[i]?.eventId === eventId) {
      return RECENCY_DECAY[h.length - 1 - i] ?? 1
    }
  }
  return 1
}

export function pickEligibleEvent(career: Career, rng: Rng): CareerEvent | undefined {
  const eligible = ALL_EVENTS.filter((event) => isEligible(career, event))
  // The decay floor is 0.15 (never 0), so this can only return undefined when
  // nothing is eligible - same as before. No fallback roll: a second weightedPick
  // would consume an extra rng() and desync the year's stream.
  return weightedPick(eligible, (event) => event.weight(career) * recencyFactor(career, event.id), rng)
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
