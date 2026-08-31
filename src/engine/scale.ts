/**
 * Tiny shared numeric helpers used across the engine: threshold-table lookups
 * (star ratings, wealth bands, score words) and the "ease a value toward a
 * target" drift that several yearly-progression formulas share.
 */

/** A `[max, value]` row: `value` applies to inputs strictly below `max`. */
export type Band<T> = readonly [max: number, value: T]

/**
 * The value of the first band the input hasn't reached. Tables run low → high
 * and must end in an `Infinity` row, so a match is always found.
 */
export function bandFor<T>(bands: readonly Band<T>[], value: number): T {
  return bands.find(([max]) => value < max)![1]
}

/** Eases `current` a fraction `rate` of the way toward `target` (0 = no move, 1 = snap). */
export function driftToward(current: number, target: number, rate: number): number {
  return current + (target - current) * rate
}

/** The rounded delta that drifts `current` toward `target` — for `applyStatDelta`. */
export function driftDelta(current: number, target: number, rate: number): number {
  return Math.round((target - current) * rate)
}
