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
  const income = Math.round(
    (stats.fame * 0.6 + stats.fanbase * 0.4 + stats.catalogStrength * 0.4 + stats.livePower * 0.3) *
      ownershipShare *
      managerBoost,
  )
  finances.annualIncome = Math.max(0, income)
  finances.cash = Math.max(0, finances.cash + finances.annualIncome)

  const releaseValue = releasesThisYear.reduce((sum, r) => sum + r.hitScore, 0)
  finances.catalogValue = Math.max(
    0,
    Math.round(finances.catalogValue * 0.95 + releaseValue * 1.5 * ownershipShare),
  )

  finances.netWorth = Math.round(finances.cash + finances.catalogValue * ownershipShare)
}
