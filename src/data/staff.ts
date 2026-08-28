import type { Rng } from '@/engine/rng'
import { weightedPick } from '@/engine/rng'
import type { TeamRole } from '@/types/career'

export interface StaffDef {
  id: string
  name: string // fictional
  role: TeamRole
  skill: number // 0-100
  cost: number // annual, same units as finances.cash
  influence: number // 0-100
}

/** Hireable people for every non-producer team role. Producers live in `producers.ts`. */
export const STAFF: StaffDef[] = [
  // managers
  { id: 'mgr_tia_gloria', name: 'Tía Gloria', role: 'manager', skill: 64, cost: 70, influence: 45 },
  { id: 'mgr_rojas', name: 'Rojas', role: 'manager', skill: 80, cost: 130, influence: 70 },
  { id: 'mgr_la_jefa', name: 'La Jefa', role: 'manager', skill: 90, cost: 190, influence: 88 },
  // lawyers
  { id: 'law_del_valle', name: 'Del Valle & Asoc.', role: 'lawyer', skill: 72, cost: 60, influence: 40 },
  { id: 'law_ferro', name: 'Ferro', role: 'lawyer', skill: 88, cost: 120, influence: 55 },
  // publicists
  { id: 'pub_media_luna', name: 'Media Luna PR', role: 'publicist', skill: 68, cost: 55, influence: 50 },
  { id: 'pub_viral', name: 'Viral', role: 'publicist', skill: 83, cost: 110, influence: 74 },
  // booking agents
  { id: 'book_ruta_sur', name: 'Ruta Sur', role: 'bookingAgent', skill: 66, cost: 50, influence: 38 },
  { id: 'book_estadio', name: 'Estadio', role: 'bookingAgent', skill: 85, cost: 125, influence: 72 },
]

const STAFF_BY_ID = new Map(STAFF.map((s) => [s.id, s]))

export function getStaff(id: string): StaffDef {
  const staff = STAFF_BY_ID.get(id)
  if (!staff) throw new Error(`Unknown staff member: ${id}`)
  return staff
}

export function staffForRole(role: TeamRole): StaffDef[] {
  return STAFF.filter((s) => s.role === role)
}

/**
 * Weighted pick of a candidate for `role` within the budget ceiling. If nothing
 * fits the budget, returns the single cheapest candidate rather than a
 * skill-weighted pick (which would hand a broke artist the priciest hire).
 */
export function pickStaff(role: TeamRole, rng: Rng, maxCost?: number): StaffDef | undefined {
  const all = staffForRole(role)
  if (all.length === 0) return undefined
  const affordable = maxCost === undefined ? all : all.filter((s) => s.cost <= maxCost)
  if (affordable.length === 0) return all.reduce((a, b) => (b.cost < a.cost ? b : a))
  return weightedPick(affordable, (s) => 1 + s.skill / 50, rng)
}
