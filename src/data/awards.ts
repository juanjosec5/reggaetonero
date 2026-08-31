import { hashSeed } from '@/engine/rng'
import type { AwardKind, Career, CareerAward } from '@/types/career'

export const AWARD_ICON: Record<AwardKind, string> = {
  grammy: '🏆',
  billboard: '📈',
  platinum: '💿',
  milestone: '⭐',
}

/** Grammy Latino comes in categories — the ceremony hands out several. */
const GRAMMY_CATEGORIES = [
  'Mejor Sencillo',
  'Mejor Video',
  'Mejor Álbum',
  'Mejor Colaboración',
] as const

/**
 * The Grammy category for the next win — rotated deterministically from the
 * career's own state so it varies across a run without consuming the RNG stream.
 */
export function grammyTitle(career: Career): string {
  const i = hashSeed(career.seed, career.year, career.record.grammys) % GRAMMY_CATEGORIES.length
  return `Grammy Latino — ${GRAMMY_CATEGORIES[i]}`
}

/** Grand once-in-a-career moments, checked every year after the record accrues. */
export interface MilestoneDef {
  id: string
  title: string
  grand: boolean
  reached: (career: Career) => boolean
}

export const MILESTONES: MilestoneDef[] = [
  { id: 'first_hit', title: 'Tu primer hit', grand: false, reached: (c) => c.record.hits >= 1 },
  {
    id: 'first_stadium',
    title: 'Cabeza de cartel en un estadio',
    grand: false,
    reached: (c) => c.record.stadiumShows >= 1,
  },
  {
    id: 'first_million_tickets',
    title: 'Un millón de entradas vendidas',
    grand: true,
    reached: (c) => c.record.ticketsSold >= 1_000_000,
  },
  {
    id: 'global_phenomenon',
    title: 'Fenómeno global',
    grand: true,
    reached: (c) => c.stats.internationalReach >= 48,
  },
  {
    id: 'five_platinum',
    title: 'Cinco discos de platino',
    grand: true,
    reached: (c) => c.record.platinumRecords >= 5,
  },
]

/** Appends an award to the career's log (mutates in place). `key` must be unique. */
export function grantAward(
  career: Career,
  key: string,
  kind: AwardKind,
  title: string,
  grand = false,
): void {
  career.awards.push({ id: `${key}_${career.year}_${career.awards.length}`, kind, title, year: career.year, grand })
}

export function grantMilestone(career: Career, m: MilestoneDef): void {
  grantAward(career, `ms:${m.id}`, 'milestone', m.title, m.grand)
}

export function hasMilestone(career: Career, milestoneId: string): boolean {
  return career.awards.some((a) => a.id.startsWith(`ms:${milestoneId}_`))
}

/** Awards won in a given career year — used to fire the celebration. */
export function awardsForYear(career: Career, year: number): CareerAward[] {
  return career.awards.filter((a) => a.year === year)
}
