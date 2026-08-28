import { RIVAL_DEFS } from '@/data/fictionalArtists'
import { getPerson } from '@/data/people'
import { PRODUCERS } from '@/data/producers'
import { STAFF } from '@/data/staff'
import {
  RELATIONSHIP_BASELINE,
  RELATIONSHIP_DECAY_RATE,
  TENSION_COOLDOWN_RATE,
  clampStat,
} from '@/engine/constants'
import type { Career, Relationship, RelationshipRole } from '@/types/career'

const STAFF_ROLE_TO_RELATIONSHIP: Record<string, RelationshipRole> = {
  manager: 'manager',
  producer: 'producer',
  lawyer: 'collaborator',
  publicist: 'collaborator',
  bookingAgent: 'collaborator',
}

/** Resolves a personId to a display name + relationship role from the data catalogs. */
function resolvePerson(personId: string): { name: string; role: RelationshipRole } {
  const producer = PRODUCERS.find((p) => p.id === personId)
  if (producer) return { name: producer.name, role: 'producer' }

  const staff = STAFF.find((s) => s.id === personId)
  if (staff) return { name: staff.name, role: STAFF_ROLE_TO_RELATIONSHIP[staff.role] ?? 'collaborator' }

  const rival = RIVAL_DEFS.find((r) => r.id === personId)
  if (rival) return { name: rival.name, role: 'rival' }

  const person = getPerson(personId)
  if (person) return { name: person.name, role: person.role }

  return { name: personId, role: 'collaborator' }
}

export function getRelationship(career: Career, personId: string): Relationship | undefined {
  return career.relationships.find((r) => r.personId === personId)
}

/** Returns the existing relationship for `personId`, creating a neutral one if absent. */
export function ensureRelationship(career: Career, personId: string): Relationship {
  const existing = getRelationship(career, personId)
  if (existing) return existing

  const { name, role } = resolvePerson(personId)
  const created: Relationship = {
    personId,
    name,
    role,
    trust: RELATIONSHIP_BASELINE,
    loyalty: RELATIONSHIP_BASELINE,
    professionalValue: RELATIONSHIP_BASELINE,
    tension: 0,
    memory: [],
  }
  career.relationships.push(created)
  return created
}

type RelationshipField = 'trust' | 'loyalty' | 'professionalValue' | 'tension'

/** Mutates `career` in place: adjusts one relationship field and clamps it. */
export function adjustRelationship(
  career: Career,
  personId: string,
  field: RelationshipField,
  amount: number,
): void {
  const relationship = ensureRelationship(career, personId)
  relationship[field] = clampStat(relationship[field] + amount)
}

/** Appends a memory entry to a relationship (creating the relationship if needed). */
export function rememberInteraction(
  career: Career,
  personId: string,
  eventId: string,
  year: number,
  summary: string,
  delta: number,
): void {
  ensureRelationship(career, personId).memory.push({ eventId, year, summary, delta })
}

/**
 * Yearly drift: trust/loyalty/professionalValue ease back toward the neutral
 * baseline, tension cools toward zero. Mutates `career` in place; callers are
 * expected to have already cloned it.
 */
export function decayRelationships(career: Career): void {
  for (const relationship of career.relationships) {
    for (const field of ['trust', 'loyalty', 'professionalValue'] as const) {
      const gap = RELATIONSHIP_BASELINE - relationship[field]
      relationship[field] = clampStat(relationship[field] + gap * RELATIONSHIP_DECAY_RATE)
    }
    relationship.tension = clampStat(relationship.tension * (1 - TENSION_COOLDOWN_RATE))
  }
}
