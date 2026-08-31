import { getMarket } from '@/data/markets'
import {
  MARKET_ESTABLISHED_THRESHOLD,
  MARKET_GROWTH_BASE,
  MARKET_SATURATION_FLOOR,
  MARKET_SATURATION_RATE,
  MARKET_SPILLOVER_RATE,
  MARKET_UNLOCK_THRESHOLD,
  clampStat,
} from '@/engine/constants'
import type { Rng } from '@/engine/rng'
import { rollRange } from '@/engine/rng'
import { driftToward } from '@/engine/scale'
import type { Career, MarketState } from '@/types/career'

export function getMarketState(career: Career, marketId: string): MarketState | undefined {
  return career.markets.find((m) => m.id === marketId)
}

/** Markets the artist is genuinely established in — unlocked and past the established threshold. */
export function establishedMarkets(career: Career): MarketState[] {
  return career.markets.filter((m) => m.unlocked && m.penetration >= MARKET_ESTABLISHED_THRESHOLD)
}

/** Unlocks a market (idempotent). Mutates `career` in place. */
export function unlockMarket(career: Career, marketId: string): void {
  const state = getMarketState(career, marketId)
  if (state) state.unlocked = true
}

export function adjustMarket(
  career: Career,
  marketId: string,
  field: 'penetration' | 'saturation',
  amount: number,
): void {
  const state = getMarketState(career, marketId)
  if (!state) return
  if (field === 'penetration') state.unlocked = true
  state[field] = clampStat(state[field] + amount)
}

/**
 * Yearly market progression: grow penetration in unlocked markets (scaled by
 * fame and market difficulty), accrue saturation once a market is well
 * established, unlock adjacent markets past the threshold, then recompute the
 * public reach/impact stats from the overall spread. Mutates `career` in place;
 * callers are expected to have already cloned it.
 */
export function advanceMarkets(career: Career, rng: Rng): void {
  const fameFactor = 0.35 + career.stats.fame / 115

  for (const state of career.markets) {
    if (!state.unlocked) continue

    const def = getMarket(state.id)
    const difficultyFactor = 1 - def.difficulty / 160
    const growth =
      (MARKET_GROWTH_BASE + rollRange(rng, 0, 4)) * fameFactor * difficultyFactor * (1 - state.saturation / 150)
    // An established market needs upkeep - a fading artist whose `growth` no
    // longer clears this drag slides back out of it.
    const drag = state.penetration * 0.05
    state.penetration = clampStat(state.penetration + growth - drag)

    if (state.penetration >= MARKET_UNLOCK_THRESHOLD) {
      for (const adjacentId of def.adjacency) {
        const neighbour = getMarketState(career, adjacentId)
        const wasLocked = !neighbour?.unlocked
        unlockMarket(career, adjacentId)
        if (wasLocked && neighbour) {
          // Spillover: a new market opens with an audience carried over from the
          // one that unlocked it, so the chain can reach far markets in a career.
          neighbour.penetration = clampStat(
            Math.max(neighbour.penetration, state.penetration * MARKET_SPILLOVER_RATE),
          )
        }
      }
    }

    if (state.penetration >= MARKET_SATURATION_FLOOR) {
      state.saturation = clampStat(state.saturation + MARKET_SATURATION_RATE)
    }
  }

  applyMarketStats(career)
}

/** Derives internationalReach and nudges culturalImpact from the market spread. */
export function applyMarketStats(career: Career): void {
  const established = establishedMarkets(career)

  const weightedReach = career.markets.reduce((sum, state) => {
    if (!state.unlocked) return sum
    return sum + (state.penetration / 100) * getMarket(state.id).size
  }, 0)

  // Reach drifts toward what the market spread currently supports — up as you
  // expand, down as markets slip. An event bump fades over a few years rather
  // than being wiped instantly or locked in forever.
  const reachTarget = weightedReach / 3
  career.stats.internationalReach = clampStat(
    driftToward(career.stats.internationalReach, reachTarget, 0.4),
  )

  // Cultural impact is stickier - you don't un-impact culture - but it still
  // erodes slowly if the market presence behind it collapses.
  const impactFromMarkets = established.length * 8 + career.stats.internationalReach * 0.4
  career.stats.culturalImpact = clampStat(
    Math.max(career.stats.culturalImpact * 0.98, impactFromMarkets),
  )
}
