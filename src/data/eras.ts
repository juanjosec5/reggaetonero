import type { Era } from '@/types/career'

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
