import { memberWeight } from '@/engine/teamEngine'
import type { Career, Release } from '@/types/career'

/**
 * Recomputes cash, income, net worth, and catalog value for the year. A manager
 * lifts income; team salaries are billed separately in `teamEngine`. Mutates
 * `career` in place; callers are expected to have already cloned it.
 */
export function applyFinances(career: Career, releasesThisYear: Release[]): void {
  const { stats, finances, team } = career
  const ownershipShare = finances.ownershipPercent / 100

  const managerBoost = team.manager ? 1 + 0.25 * memberWeight(team.manager) : 1
  // Stardom pays superlinearly - the jump from famous to massive is where the
  // real money is. `stardom` is 0 at fame 38 and 1 at fame 100.
  const stardom = Math.pow(Math.max(0, stats.fame - 38) / 62, 2)
  // A back-catalogue you own keeps paying you every year.
  const royalty = finances.catalogValue * 0.06 * ownershipShare
  const income = Math.round(
    (stats.fame * 0.55 + stats.fanbase * 0.4 + stats.catalogStrength * 0.45 + stats.livePower * 0.7) *
      ownershipShare *
      managerBoost +
      stardom * 780 +
      royalty,
  )
  finances.annualIncome = Math.max(0, income)
  finances.cash = Math.max(0, finances.cash + finances.annualIncome)

  const releaseValue = releasesThisYear.reduce((sum, r) => sum + r.hitScore, 0)
  finances.catalogValue = Math.max(
    0,
    Math.round(finances.catalogValue * 0.975 + releaseValue * 3 * ownershipShare),
  )

  finances.netWorth = Math.round(finances.cash + finances.catalogValue * ownershipShare)
}
