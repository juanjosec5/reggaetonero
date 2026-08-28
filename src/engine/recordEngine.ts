import { INTERNATIONAL_HUB, RELOCATE_REACH } from '@/data/cities'
import type { Rng } from '@/engine/rng'
import { rollRange } from '@/engine/rng'
import type { Career } from '@/types/career'

/**
 * Yearly accrual of the "career record" figures the era table shows — shows,
 * tickets, awards — and the artist's city. All derived from where the stats
 * currently stand; the player's choices move them through `stats`, not directly.
 * Mutates `career` in place (already cloned by `simulateYear`).
 */
export function accrueCareerRecord(career: Career, rng: Rng): void {
  const { stats, record } = career

  // Shows: a known artist with a fanbase tours, even without elite stage skill.
  // Output tapers with age.
  const ageThrottle = Math.max(0.4, 1 - Math.max(0, career.age - 32) * 0.06)
  const shows = Math.max(
    0,
    Math.round((stats.fame / 9 + stats.fanbase / 14 + stats.livePower / 18) * ageThrottle + rollRange(rng, -1, 1)),
  )

  if (shows > 0) {
    const stadiumTier = stats.fame >= 52 && (stats.livePower >= 30 || stats.internationalReach >= 30)
    if (stadiumTier) {
      record.stadiumShows += shows
      record.ticketsSold += shows * (26_000 + Math.round(stats.fanbase * 380))
    } else {
      record.clubShows += shows
      record.ticketsSold += shows * (1_100 + Math.round(stats.fanbase * 95))
    }
  }

  // Platinum plaques: your smashes, plus certifications a strong commercial
  // catalogue racks up over time. Monotonic.
  const platinumEligible =
    record.smashHits + Math.floor((stats.catalogStrength * (stats.fame / 100)) / 13)
  if (record.platinumRecords < platinumEligible) record.platinumRecords = platinumEligible

  // Awards - Grammy leans cultural/critical, Billboard leans chart/commercial.
  if ((stats.culturalImpact >= 24 || stats.credibility >= 52) && rollRange(rng, 1, 100) <= 16) {
    record.grammys += 1
  }
  if (stats.fame >= 48 && stats.hype >= 28 && rollRange(rng, 1, 100) <= 22) record.billboards += 1

  // Once you've truly broken internationally you move to the hub. One-way.
  if (career.residence !== INTERNATIONAL_HUB && stats.internationalReach >= RELOCATE_REACH) {
    career.residence = INTERNATIONAL_HUB
  }
}
