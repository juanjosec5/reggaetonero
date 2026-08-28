import { applyStatDelta } from '@/engine/statPath'
import type { Rng } from '@/engine/rng'
import { rollRange } from '@/engine/rng'
import type { Career, Era } from '@/types/career'

/** Maps a career year to its era — one per 4-year age bucket (year N ⇒ age 19 + N). */
export function computeEra(year: number): Era {
  if (year <= 4) return 'debut' // ages 20-23
  if (year <= 8) return 'ascenso' // 24-27
  if (year <= 12) return 'cima' // 28-31
  if (year <= 16) return 'veterano' // 32-35
  return 'leyenda' // 36-40
}

/**
 * Drifts career state that isn't directly tied to a release or a decision:
 * skill growth from discipline, fanbase settling toward hype/fame, and fame
 * decaying slightly without fresh output. Mutates the given career in place;
 * callers are expected to have already cloned it.
 */
export function applyProgression(career: Career, rng: Rng): void {
  // Skill growth: disciplined, ambitious artists get better year over year,
  // faster while young and hungry. Two attributes can move in a strong year.
  const growthPotential = Math.max(0.15, (45 - career.age) / 40)
  const disciplineFactor = career.hiddenTraits.discipline / 100
  const ambitionFactor = career.hiddenTraits.ambition / 100
  const attrKeys = Object.keys(career.attributes) as (keyof Career['attributes'])[]
  const growthChance = 45 + career.hiddenTraits.discipline / 3 + career.hiddenTraits.ambition / 6
  const rolls = career.age < 30 ? 2 : 1
  for (let i = 0; i < rolls; i++) {
    if (rollRange(rng, 1, 100) > growthChance) continue
    const growth = Math.round(
      rollRange(rng, 1, 4) * (0.6 + disciplineFactor + ambitionFactor * 0.5) * (0.5 + growthPotential),
    )
    const key = attrKeys[rollRange(rng, 0, attrKeys.length - 1)]!
    applyStatDelta(career, `attributes.${key}`, Math.max(1, growth))
  }

  // Fanbase drifts toward hype + fame; hype naturally cools off each year.
  const fanTarget = (career.stats.hype + career.stats.fame) / 2
  const fanDelta = Math.round((fanTarget - career.stats.fanbase) * 0.15)
  applyStatDelta(career, 'stats.fanbase', fanDelta)

  // Momentum becomes recognition: a slice of this year's hype converts to fame
  // before hype cools off. This is the main way fame compounds over a career.
  applyStatDelta(career, 'stats.fame', Math.round(career.stats.hype * 0.2))
  applyStatDelta(career, 'stats.hype', -Math.round(career.stats.hype * 0.25))

  // Fame decays slowly without fresh output; credibility drifts toward authenticity.
  applyStatDelta(career, 'stats.fame', -Math.round(career.stats.fame * 0.035))
  const credibilityDelta = Math.round((career.hiddenTraits.authenticity - career.stats.credibility) * 0.05)
  applyStatDelta(career, 'stats.credibility', credibilityDelta)
}
