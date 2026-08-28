import { getLabel, pickLabel } from '@/data/labels'
import { getProducer, pickProducer } from '@/data/producers'
import { getStaff, pickStaff } from '@/data/staff'
import {
  TEAM_COST_FACTOR,
  TEAM_LOYALTY_PAID,
  TEAM_LOYALTY_QUIT,
  TEAM_LOYALTY_UNPAID,
  clampStat,
} from '@/engine/constants'
import type { Rng } from '@/engine/rng'
import { rollRange } from '@/engine/rng'
import type { Career, TeamMember, TeamRole } from '@/types/career'

export function getTeamMember(career: Career, role: TeamRole): TeamMember | undefined {
  return career.team[role]
}

/**
 * Hires someone into `role`. `personId` names a specific candidate; omitting it
 * lets the engine pick one that fits the artist's genre and current cash.
 * No-ops if the role is already filled. Mutates `career` in place.
 */
export function hireTeamMember(career: Career, role: TeamRole, rng: Rng, personId?: string): void {
  if (career.team[role]) return

  if (role === 'producer') {
    const def = personId
      ? getProducer(personId)
      : pickProducer(rng, { genre: career.artist.genre, maxCost: career.finances.cash })
    if (!def) return
    career.team.producer = {
      id: def.id,
      name: def.name,
      skill: def.skill,
      loyalty: 55,
      cost: def.cost,
      influence: def.influence,
      sinceYear: career.year,
    }
    return
  }

  const def = personId ? getStaff(personId) : pickStaff(role, rng, career.finances.cash)
  if (!def || def.role !== role) return
  career.team[role] = {
    id: def.id,
    name: def.name,
    skill: def.skill,
    loyalty: 55,
    cost: def.cost,
    influence: def.influence,
    sinceYear: career.year,
  }
}

/** Removes whoever fills `role`. Mutates `career` in place. */
export function releaseTeamMember(career: Career, role: TeamRole): void {
  delete career.team[role]
}

/**
 * Signs the artist to a label: records the deal on `career.team.label` and hands
 * the label the masters share it demands. `labelId` names a specific label;
 * omitting it lets the engine pick one that fits the artist's current fame.
 * No-ops if already signed. Mutates `career` in place.
 */
export function signLabel(career: Career, rng: Rng, labelId?: string): void {
  if (career.team.label) return
  const def = labelId ? getLabel(labelId) : pickLabel(rng, career.stats.fame)
  const ownershipTaken = Math.min(
    career.finances.ownershipPercent,
    rollRange(rng, def.ownershipDemandMin, def.ownershipDemandMax),
  )
  career.finances.ownershipPercent = clampStat(career.finances.ownershipPercent - ownershipTaken)
  career.team.label = { id: def.id, name: def.name, ownershipTaken, signedYear: career.year }
}

/** Ends the label deal. The artist keeps whatever masters share they now hold. */
export function leaveLabel(career: Career): void {
  delete career.team.label
}

export function adjustTeamLoyalty(career: Career, role: TeamRole, amount: number): void {
  const member = career.team[role]
  if (!member) return
  member.loyalty = clampStat(member.loyalty + amount)
}

const TEAM_ROLES: TeamRole[] = ['manager', 'producer', 'lawyer', 'publicist', 'bookingAgent']

/**
 * Yearly team upkeep: bill salaries against cash, move loyalty based on whether
 * the artist could actually pay, and let anyone whose loyalty has collapsed
 * walk. Mutates `career` in place; callers are expected to have already cloned it.
 */
export function applyTeamUpkeep(career: Career): void {
  for (const role of TEAM_ROLES) {
    const member = career.team[role]
    if (!member) continue

    const bill = Math.round(member.cost * TEAM_COST_FACTOR)
    if (career.finances.cash >= bill) {
      career.finances.cash -= bill
      member.loyalty = clampStat(member.loyalty + TEAM_LOYALTY_PAID)
    } else {
      career.finances.cash = 0
      member.loyalty = clampStat(member.loyalty + TEAM_LOYALTY_UNPAID)
    }

    if (member.loyalty <= TEAM_LOYALTY_QUIT) delete career.team[role]
  }
}

/** Effectiveness of a team member: skill scaled by how loyal they currently are. */
export function memberWeight(member: { skill: number; loyalty: number }): number {
  return (member.skill / 100) * (0.5 + member.loyalty / 200)
}

/**
 * Passive per-year stat benefits from a healthy team. The manager's income
 * multiplier is applied inside `financeEngine`, not here. Mutates in place;
 * callers are expected to have already cloned the career.
 */
export function applyTeamBonuses(career: Career): void {
  const { team, stats, finances } = career

  // A label's machine keeps the artist in front of people every year.
  if (team.label) stats.hype = clampStat(stats.hype + getLabel(team.label.id).reach * 0.04)

  if (team.publicist) stats.hype = clampStat(stats.hype + 4 * memberWeight(team.publicist))
  if (team.bookingAgent) stats.livePower = clampStat(stats.livePower + 4 * memberWeight(team.bookingAgent))
  if (team.lawyer) {
    // A good lawyer slows the bleed of masters ownership.
    finances.ownershipPercent = clampStat(finances.ownershipPercent + 1 * memberWeight(team.lawyer))
  }
}
