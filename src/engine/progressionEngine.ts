import { applyStatDelta } from '@/engine/statPath'
import type { Rng } from '@/engine/rng'
import { rollRange } from '@/engine/rng'
import type { Career, Era } from '@/types/career'

/** Maps a career year to its era (year N ⇒ age 21 + N; career runs 22 → 35). */
export function computeEra(year: number): Era {
  if (year <= 3) return 'debut' // ages 22-24
  if (year <= 6) return 'ascenso' // 25-27
  if (year <= 9) return 'cima' // 28-30
  if (year <= 12) return 'veterano' // 31-33
  return 'leyenda' // 34-35
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

  // An artist with fans plays shows: live power drifts toward what the fanbase
  // and fame support, so the touring subsystem breathes without the player
  // having to chain a specific run of tour choices.
  const liveTarget = career.stats.fanbase * 0.5 + career.stats.fame * 0.28
  applyStatDelta(career, 'stats.livePower', Math.round((liveTarget - career.stats.livePower) * 0.12))

  // Momentum becomes recognition: a slice of this year's hype converts to fame,
  // with diminishing returns once you're already huge - the climb from famous to
  // superstar is far harder than from nobody to famous.
  const fameHeadroom = Math.max(0.3, 1 - career.stats.fame / 175)
  applyStatDelta(career, 'stats.fame', Math.round(career.stats.hype * 0.25 * fameHeadroom))
  // Hype is use-it-or-lose-it: it cools fast, so holding on to fame means a
  // steady stream of releases/moments, not one big year.
  applyStatDelta(career, 'stats.hype', -Math.round(career.stats.hype * 0.32))

  // Your back catalogue slowly stops carrying you - "what have you done lately".
  applyStatDelta(career, 'stats.catalogStrength', -Math.round(career.stats.catalogStrength * 0.025))

  // Fame slips every year and the slide steepens once you're past 30 - staying
  // famous into your mid-30s means fighting it with fresh output. A big
  // catalogue and cultural weight cushion the fall but don't stop it. This is
  // what turns a career into an arc instead of an endless ramp.
  const fameFloor = career.stats.catalogStrength * 0.4 + career.stats.culturalImpact * 0.28
  const above = Math.max(0, career.stats.fame - fameFloor)
  const decayRate = 0.026 + Math.max(0, career.age - 30) * 0.024
  applyStatDelta(career, 'stats.fame', -Math.round(above * decayRate))

  const credibilityDelta = Math.round((career.hiddenTraits.authenticity - career.stats.credibility) * 0.05)
  applyStatDelta(career, 'stats.credibility', credibilityDelta)
}
