import { grammyTitle, grantAward, grantMilestone, hasMilestone, MILESTONES } from '@/data/awards'
import { relocationTarget, sceneVenueBoost } from '@/data/cities'
import { clampStat } from '@/engine/constants'
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
    // Rooms scale smoothly with fame instead of flipping at a hard threshold:
    // ~all clubs at fame 34, ~all stadiums by fame 64, with live chops, reach
    // and the scene you live in nudging it up.
    const venueScale = clampStat(
      100 *
        ((stats.fame - 34) / 30 +
          (Math.max(stats.livePower, stats.internationalReach) / 100) * 0.3 +
          sceneVenueBoost(career.residence)),
    ) / 100
    const stadiumRun = Math.round(shows * venueScale)
    const clubRun = shows - stadiumRun
    if (stadiumRun > 0) {
      record.stadiumShows += stadiumRun
      record.ticketsSold += stadiumRun * (24_000 + Math.round(stats.fanbase * 360))
    }
    if (clubRun > 0) {
      record.clubShows += clubRun
      record.ticketsSold += clubRun * (1_600 + Math.round(stats.fanbase * 120))
    }
  }

  // Platinum plaques: your smashes, plus certifications a strong commercial
  // catalogue racks up over time. Monotonic; a new plaque is a celebration.
  const platinumEligible =
    record.smashHits + Math.floor((stats.catalogStrength * (stats.fame / 100)) / 13)
  for (let n = record.platinumRecords; n < platinumEligible && n < record.platinumRecords + 3; n++) {
    grantAward(career, 'plat', 'platinum', 'Disco de platino')
  }
  record.platinumRecords = Math.max(record.platinumRecords, platinumEligible)

  // Awards - Grammy leans cultural/critical, Billboard leans chart/commercial.
  if ((stats.culturalImpact >= 24 || stats.credibility >= 52) && rollRange(rng, 1, 100) <= 16) {
    record.grammys += 1
    grantAward(career, 'gr', 'grammy', grammyTitle(career))
  }
  if (stats.fame >= 48 && stats.hype >= 28 && rollRange(rng, 1, 100) <= 22) {
    record.billboards += 1
    grantAward(career, 'bb', 'billboard', 'Premio Billboard')
  }

  // Grand once-in-a-career milestones.
  for (const m of MILESTONES) {
    if (!hasMilestone(career, m.id) && m.reached(career)) grantMilestone(career, m)
  }

  // As bigger markets open you move to the scene carrying you — a regional hub,
  // then Miami, then a global base. Automatic and upward-only.
  const move = relocationTarget(career.residence, stats.internationalReach, career.markets)
  if (move) career.residence = move
}
