import { adjustMarket, unlockMarket } from '@/engine/marketEngine'
import { adjustRelationship } from '@/engine/relationshipEngine'
import { adjustRival, getRival, nearestRival } from '@/engine/rivalEngine'
import type { Rng } from '@/engine/rng'
import { rollRange } from '@/engine/rng'
import { applyStatDelta } from '@/engine/statPath'
import {
  adjustTeamLoyalty,
  hireTeamMember,
  leaveLabel,
  releaseTeamMember,
  signLabel,
} from '@/engine/teamEngine'
import type { Career, CareerChoice, CareerEffect, CareerEvent } from '@/types/career'

/** Resolves one effect's range through the RNG and applies it to `career` in place. */
function applyEffect(career: Career, effect: CareerEffect, rng: Rng): void {
  const roll = (min = 0, max = 0) => rollRange(rng, min, max)

  switch (effect.kind) {
    case undefined:
    case 'stat':
      applyStatDelta(career, effect.target, roll(effect.min, effect.max))
      return

    case 'relationship':
      adjustRelationship(career, effect.personId, effect.field, roll(effect.min, effect.max))
      return

    case 'rival': {
      const rivalId = effect.rivalId ?? nearestRival(career)?.id
      if (rivalId) {
        adjustRival(career, rivalId, effect.field, roll(effect.min, effect.max))
        // A rival the player has now tangled with becomes visible in the panel.
        const rival = getRival(career, rivalId)
        if (rival) rival.discovered = true
      }
      return
    }

    case 'market': {
      const marketId = effect.marketId ?? career.currentMarket
      if (effect.op === 'unlock') {
        unlockMarket(career, marketId)
      } else {
        adjustMarket(career, marketId, effect.op === 'penetrate' ? 'penetration' : 'saturation', roll(effect.min, effect.max))
      }
      return
    }

    case 'team':
      if (effect.op === 'hire') hireTeamMember(career, effect.role, rng, effect.personId)
      else if (effect.op === 'leave') releaseTeamMember(career, effect.role)
      else adjustTeamLoyalty(career, effect.role, roll(effect.min, effect.max))
      return

    case 'label':
      if (effect.op === 'sign') signLabel(career, rng, effect.labelId)
      else leaveLabel(career)
      return
  }
}

/**
 * Applies the player's choice for `event` to a clone of `career`: resolves each
 * effect's range through the RNG, queues delayed effects (their `triggerYear`,
 * if set, is authored as an *offset* in years from now — converted here to the
 * absolute career year it should fire on), marks the event as fired if it's
 * `oncePerCareer`, and records the choice text on the matching history entry.
 */
export function applyChoice(career: Career, event: CareerEvent, choice: CareerChoice, rng: Rng): Career {
  const next = structuredClone(career)

  for (const effect of choice.effects) {
    applyEffect(next, effect, rng)
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
    currentYear.choiceStyle = choice.style
  }

  return next
}
