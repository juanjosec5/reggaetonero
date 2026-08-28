import { RIVAL_GROWTH_MAX, clampStat } from '@/engine/constants'
import type { Rng } from '@/engine/rng'
import { rollRange } from '@/engine/rng'
import type { Career, Rival } from '@/types/career'

const clampRelationship = (value: number) => Math.max(-100, Math.min(100, value))

export function getRival(career: Career, rivalId: string): Rival | undefined {
  return career.rivals.find((r) => r.id === rivalId)
}

/** The rival closest to the artist in fame — the natural "current" rival. */
export function nearestRival(career: Career): Rival | undefined {
  if (career.rivals.length === 0) return undefined
  return [...career.rivals].sort(
    (a, b) => Math.abs(a.fame - career.stats.fame) - Math.abs(b.fame - career.stats.fame),
  )[0]
}

export function adjustRival(
  career: Career,
  rivalId: string,
  field: 'fame' | 'credibility' | 'relationship',
  amount: number,
): void {
  const rival = getRival(career, rivalId)
  if (!rival) return
  rival[field] = field === 'relationship' ? clampRelationship(rival[field] + amount) : clampStat(rival[field] + amount)
}

/**
 * Yearly rival drift: each rival's fame wanders, pulled slightly upward when
 * they trail the artist (the scene keeps producing challengers) and downward
 * when they lead by a lot. Mutates `career` in place; callers are expected to
 * have already cloned it.
 */
export function progressRivals(career: Career, rng: Rng): void {
  for (const rival of career.rivals) {
    const gap = career.stats.fame - rival.fame
    const pull = Math.sign(gap) * Math.min(2, Math.abs(gap) / 20)
    const drift = rollRange(rng, -RIVAL_GROWTH_MAX, RIVAL_GROWTH_MAX) + pull
    rival.fame = clampStat(rival.fame + drift)
    rival.credibility = clampStat(rival.credibility + rollRange(rng, -2, 3))
  }
}
