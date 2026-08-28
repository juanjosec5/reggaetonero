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

  // Momentum becomes recognition: a slice of this year's hype converts to fame,
  // with diminishing returns once you're already huge.
  const fameHeadroom = Math.max(0.3, 1 - career.stats.fame / 180)
  applyStatDelta(career, 'stats.fame', Math.round(career.stats.hype * 0.2 * fameHeadroom))
  // Hype is use-it-or-lose-it: it cools fast, so holding on to fame means a
  // steady stream of releases/moments, not one big year.
  applyStatDelta(career, 'stats.hype', -Math.round(career.stats.hype * 0.34))

  // Your back catalogue slowly stops carrying you - "what have you done lately".
  applyStatDelta(career, 'stats.catalogStrength', -Math.round(career.stats.catalogStrength * 0.03))

  // Fame slips every year and the slide steepens with age - staying famous past
  // your early 30s means fighting it with fresh output. A big catalogue and
  // cultural weight cushion the fall but don't stop it. This is what turns a
  // career into an arc instead of an endless ramp.
  const fameFloor = career.stats.catalogStrength * 0.4 + career.stats.culturalImpact * 0.25
  const above = Math.max(0, career.stats.fame - fameFloor)
  const decayRate = 0.03 + Math.max(0, career.age - 28) * 0.014
  applyStatDelta(career, 'stats.fame', -Math.round(above * decayRate))

  const credibilityDelta = Math.round((career.hiddenTraits.authenticity - career.stats.credibility) * 0.05)
  applyStatDelta(career, 'stats.credibility', credibilityDelta)
}
