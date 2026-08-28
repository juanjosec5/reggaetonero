import type { RelationshipRole } from '@/types/career'

/**
 * Narrative-only people referenced by relationship events who are not hireable
 * staff, producers, or rivals (mentors, label execs, family, etc.).
 */
export interface PersonDef {
  id: string
  name: string // fictional
  role: RelationshipRole
}

export const PEOPLE: PersonDef[] = [
  { id: 'mentor_el_patriarca', name: 'El Patriarca', role: 'mentor' },
  { id: 'exec_la_disquera', name: 'Vega (A&R)', role: 'label_exec' },
]

const PERSON_BY_ID = new Map(PEOPLE.map((p) => [p.id, p]))

export function getPerson(id: string): PersonDef | undefined {
  return PERSON_BY_ID.get(id)
}
