import type { CareerStats, MusicCareerRecord } from '@/types/career'

/** The achievement counters a year's star rating is derived from. */
export type RecordDelta = Pick<
  MusicCareerRecord,
  'grammys' | 'billboards' | 'platinumRecords' | 'stadiumShows' | 'clubShows' | 'ticketsSold'
>

export const ZERO_DELTA: RecordDelta = {
  grammys: 0,
  billboards: 0,
  platinumRecords: 0,
  stadiumShows: 0,
  clubShows: 0,
  ticketsSold: 0,
}

const DELTA_KEYS = Object.keys(ZERO_DELTA) as (keyof RecordDelta)[]

/** end - start, floored at 0, over the counters that feed the star rating. */
export function recordDelta(end: MusicCareerRecord, start: RecordDelta): RecordDelta {
  const out = { ...ZERO_DELTA }
  for (const k of DELTA_KEYS) out[k] = Math.max(0, end[k] - start[k])
  return out
}

const STAR_BANDS: [max: number, stars: number][] = [
  [3, 0],
  [13, 0.5],
  [22, 1],
  [31, 1.5],
  [42, 2],
  [56, 2.5],
  [70, 3],
  [88, 3.5],
  [106, 4],
  [128, 4.5],
  [Infinity, 5],
]

/** The current-standing stats that give a year its baseline star rating. */
export type StarStats = Pick<CareerStats, 'fame' | 'fanbase' | 'culturalImpact' | 'internationalReach'>

/**
 * 0–5 stars in half steps for the year. Two parts: the "stature" the artist
 * carries (fame/fanbase/impact — a rising line that holds in a quiet year) plus
 * the "activity" they racked up (shows, tickets, awards won that year). Pass the
 * year's stats snapshot; omitting it scores activity only (legacy rows).
 */
export function recordStars(d: RecordDelta, stats?: StarStats): number {
  const activity = Math.min(
    66,
    d.grammys * 12 +
      d.billboards * 9 +
      d.platinumRecords * 7 +
      d.stadiumShows * 2 +
      d.clubShows * 0.7 +
      d.ticketsSold / 28_000,
  )
  const stature = stats
    ? stats.fame * 0.66 + stats.fanbase * 0.24 + stats.culturalImpact * 0.34 + stats.internationalReach * 0.16
    : 0
  return STAR_BANDS.find(([max]) => stature + activity < max)![1]
}

/** "840" · "12k" · "1.4M" — compact ticket / count formatting. */
export function formatCount(n: number): string {
  if (n < 1000) return String(Math.round(n))
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`
  return `${(n / 1_000_000).toFixed(1)}M`
}
