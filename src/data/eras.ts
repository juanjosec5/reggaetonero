import type { Era } from '@/types/career'

/** Player-facing name for each era, and the age window it covers. */
export const ERAS: { id: Era; label: string; ageRange: [number, number] }[] = [
  { id: 'debut', label: 'El Come Up', ageRange: [22, 24] },
  { id: 'ascenso', label: 'El Boom', ageRange: [25, 27] },
  { id: 'cima', label: 'La Cima', ageRange: [28, 30] },
  { id: 'veterano', label: 'El Veterano', ageRange: [31, 33] },
  { id: 'leyenda', label: 'La Leyenda', ageRange: [34, 35] },
]

export const ERA_LABELS: Record<Era, string> = Object.fromEntries(
  ERAS.map((e) => [e.id, e.label]),
) as Record<Era, string>

/** Maps a pre-revamp save's 8-era value to the new 5-era model. */
export const LEGACY_ERA_REMAP: Record<string, Era> = {
  underground: 'debut',
  first_buzz: 'debut',
  breakout: 'ascenso',
  national: 'ascenso',
  international: 'cima',
  superstar: 'cima',
  reinvention: 'veterano',
  legacy: 'leyenda',
}
