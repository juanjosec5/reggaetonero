import type { RelationshipRole } from '@/types/career'

import { defineCatalog } from './catalog'

/**
 * Narrative-only people referenced by relationship events who are not hireable
 * staff, producers, or rivals (mentors, label execs, family, etc.).
 */
export interface PersonDef {
  id: string
  name: string // fictional
  role: RelationshipRole
}

export const PEOPLE = defineCatalog<PersonDef>('person', [
  { id: 'mentor_el_patriarca', name: 'El Patriarca', role: 'mentor' },
  { id: 'exec_la_disquera', name: 'Vega (A&R)', role: 'label_exec' },
])
