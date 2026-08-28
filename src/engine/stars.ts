import type { MusicCareerRecord } from '@/types/career'

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
  [1, 0],
  [3, 0.5],
  [7, 1],
  [12, 1.5],
  [19, 2],
  [28, 2.5],
  [40, 3],
  [55, 3.5],
  [74, 4],
  [98, 4.5],
  [Infinity, 5],
]

/** 0–5 stars in half steps for what the artist achieved in a single year. */
export function recordStars(d: RecordDelta): number {
  const score =
    d.grammys * 14 +
    d.billboards * 10 +
    d.platinumRecords * 8 +
    d.stadiumShows * 3 +
    d.clubShows * 0.6 +
    d.ticketsSold / 22_000
  return STAR_BANDS.find(([max]) => score < max)![1]
}

/** "840" · "12k" · "1.4M" — compact ticket / count formatting. */
export function formatCount(n: number): string {
  if (n < 1000) return String(Math.round(n))
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`
  return `${(n / 1_000_000).toFixed(1)}M`
}
