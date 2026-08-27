import { applyStatDelta } from '@/engine/statPath'
import type { Rng } from '@/engine/rng'
import { rollRange } from '@/engine/rng'
import type { Career, Era } from '@/types/career'

const ERA_ORDER: Era[] = [
  'underground',
  'first_buzz',
  'breakout',
  'national',
  'international',
  'superstar',
  'reinvention',
  'legacy',
]

/** Maps a career year to its narrative era. Purely year-based for the Phase 1 MVP. */
export function computeEra(year: number): Era {
  if (year <= 2) return 'underground'
  if (year <= 4) return 'first_buzz'
  if (year <= 6) return 'breakout'
  if (year <= 9) return 'national'
  if (year <= 12) return 'international'
  if (year <= 15) return 'superstar'
  if (year <= 18) return 'reinvention'
  return 'legacy'
}

export function eraIndex(era: Era): number {
  return ERA_ORDER.indexOf(era)
}

/**
 * Drifts career state that isn't directly tied to a release or a decision:
 * skill growth from discipline, fanbase settling toward hype/fame, and fame
 * decaying slightly without fresh output. Mutates the given career in place;
 * callers are expected to have already cloned it.
 */
export function applyProgression(career: Career, rng: Rng): void {
  // Skill growth: disciplined, ambitious artists still get better year over year,
  // but growth tapers off with age.
  const growthPotential = Math.max(0, 40 - career.age) / 40
  const disciplineFactor = career.hiddenTraits.discipline / 100
  if (rollRange(rng, 1, 100) <= 15 + career.hiddenTraits.discipline / 4) {
    const growth = Math.round(rollRange(rng, 1, 4) * (0.4 + disciplineFactor) * (0.5 + growthPotential))
    const attrKeys = Object.keys(career.attributes) as (keyof Career['attributes'])[]
    const key = attrKeys[rollRange(rng, 0, attrKeys.length - 1)]!
    applyStatDelta(career, `attributes.${key}`, growth)
  }

  // Fanbase drifts toward hype + fame; hype naturally cools off each year.
  const fanTarget = (career.stats.hype + career.stats.fame) / 2
  const fanDelta = Math.round((fanTarget - career.stats.fanbase) * 0.15)
  applyStatDelta(career, 'stats.fanbase', fanDelta)
  applyStatDelta(career, 'stats.hype', -Math.round(career.stats.hype * 0.2))

  // Fame decays slowly without fresh output; credibility drifts toward authenticity.
  applyStatDelta(career, 'stats.fame', -Math.round(career.stats.fame * 0.05))
  const credibilityDelta = Math.round((career.hiddenTraits.authenticity - career.stats.credibility) * 0.05)
  applyStatDelta(career, 'stats.credibility', credibilityDelta)
}
