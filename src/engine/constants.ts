export const ATTRIBUTE_MIN = 1
export const ATTRIBUTE_MAX = 100
export const TRAIT_MIN = 0
export const TRAIT_MAX = 100
export const STAT_MIN = 0
export const STAT_MAX = 100

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function clampAttribute(value: number): number {
  return clamp(value, ATTRIBUTE_MIN, ATTRIBUTE_MAX)
}

export function clampTrait(value: number): number {
  return clamp(value, TRAIT_MIN, TRAIT_MAX)
}

export function clampStat(value: number): number {
  return clamp(value, STAT_MIN, STAT_MAX)
}

/**
 * Shared 0-100 banding used for both attribute display bands and release hit
 * tiers, so the two systems read consistently to the player.
 */
export const BAND_THRESHOLDS = {
  low: 0,
  mid: 40,
  high: 60,
  veryHigh: 75,
  top: 90,
} as const

export const STARTING_CASH = 500
export const STARTING_YEAR = 1
export const RETIREMENT_MIN_YEAR = 8

// ---- Phase 2 tuning ----

/** Per-year drift of relationship trust/loyalty back toward this neutral baseline. */
export const RELATIONSHIP_BASELINE = 50
export const RELATIONSHIP_DECAY_RATE = 0.1
/** Tension cools toward zero each year at this rate. */
export const TENSION_COOLDOWN_RATE = 0.2

/** Fraction of a team member's annual cost that is actually billed each year. */
export const TEAM_COST_FACTOR = 1
/** Loyalty a team member gains/loses per year based on whether cash covers their pay. */
export const TEAM_LOYALTY_PAID = 2
export const TEAM_LOYALTY_UNPAID = -8
/** A member whose loyalty falls to/below this walks at year end. */
export const TEAM_LOYALTY_QUIT = 10

/** Base yearly market penetration growth before difficulty/fame scaling. */
export const MARKET_GROWTH_BASE = 6
/**
 * Penetration a market must reach before its adjacent markets unlock. A newly
 * unlocked neighbour inherits a fraction of this market's penetration as
 * spillover, so the map can actually open up within one career.
 */
export const MARKET_UNLOCK_THRESHOLD = 42
/** Fraction of the source market's penetration a freshly unlocked neighbour starts with. */
export const MARKET_SPILLOVER_RATE = 0.15
/** Penetration at which a market counts as "established" for stats and verdicts. */
export const MARKET_ESTABLISHED_THRESHOLD = 55
/** Penetration a market must reach before it starts to tap out. */
export const MARKET_SATURATION_FLOOR = 58
/** Saturation added per year once a market is past the saturation floor. */
export const MARKET_SATURATION_RATE = 2

/** Yearly rival fame drift magnitude. */
export const RIVAL_GROWTH_MAX = 6
