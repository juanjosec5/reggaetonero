import type { Rng } from '@/engine/rng'
import { rollRange } from '@/engine/rng'
import { applyStatDelta } from '@/engine/statPath'
import type { Career, CareerChoice, CareerEvent } from '@/types/career'

/**
 * Applies the player's choice for `event` to a clone of `career`: resolves
 * each effect's range through the RNG, queues delayed effects (their
 * `triggerYear`, if set, is authored as an *offset* in years from now - this
 * is where it gets converted to the absolute career year it should fire on),
 * marks the event as fired if it's `oncePerCareer`, and records the choice
 * text on the matching history entry.
 */
export function applyChoice(career: Career, event: CareerEvent, choice: CareerChoice, rng: Rng): Career {
  const next = structuredClone(career)

  for (const effect of choice.effects) {
    const amount = rollRange(rng, effect.min, effect.max)
    applyStatDelta(next, effect.target, amount)
  }

  if (choice.delayedEffects) {
    for (const delayed of choice.delayedEffects) {
      next.pendingEffects.push({
        ...delayed,
        triggerYear: delayed.triggerYear !== undefined ? next.year + delayed.triggerYear : undefined,
      })
    }
  }

  if (event.oncePerCareer && !next.firedEventIds.includes(event.id)) {
    next.firedEventIds.push(event.id)
  }

  const currentYear = next.history.at(-1)
  if (currentYear && currentYear.eventId === event.id) {
    currentYear.choiceTaken = choice.text
  }

  return next
}
