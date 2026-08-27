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
