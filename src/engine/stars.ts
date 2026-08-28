import type { MusicCareerRecord } from '@/types/career'

/** The achievement counters an era's star rating is derived from. */
export type EraRecordDelta = Pick<
  MusicCareerRecord,
  'grammys' | 'billboards' | 'platinumRecords' | 'stadiumShows' | 'clubShows' | 'ticketsSold'
>

export const ZERO_ERA_DELTA: EraRecordDelta = {
  grammys: 0,
  billboards: 0,
  platinumRecords: 0,
  stadiumShows: 0,
  clubShows: 0,
  ticketsSold: 0,
}

const STAR_BANDS: [max: number, stars: number][] = [
  [3, 0],
  [8, 0.5],
  [16, 1],
  [26, 1.5],
  [40, 2],
  [58, 2.5],
  [80, 3],
  [108, 3.5],
  [142, 4],
  [185, 4.5],
  [Infinity, 5],
]

/** 0–5 stars in half steps for what the artist achieved in one era. */
export function eraStars(d: EraRecordDelta): number {
  const score =
    d.grammys * 13 +
    d.billboards * 9 +
    d.platinumRecords * 7 +
    d.stadiumShows * 2.6 +
    d.clubShows * 0.5 +
    d.ticketsSold / 28_000
  return STAR_BANDS.find(([max]) => score < max)![1]
}

/** "840" · "12k" · "1.4M" — compact ticket / count formatting. */
export function formatCount(n: number): string {
  if (n < 1000) return String(Math.round(n))
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`
  return `${(n / 1_000_000).toFixed(1)}M`
}
