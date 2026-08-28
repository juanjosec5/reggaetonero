import type { Genre } from '@/types/career'

/**
 * Every genre an artist can start in. The player never picks this - `createCareer`
 * rolls one from the seed - but the list is shared so the roll and any future UI
 * stay in sync.
 */
export const GENRES: { id: Genre; label: string }[] = [
  { id: 'reggaeton', label: 'Reguetón' },
  { id: 'perreo', label: 'Perreo' },
  { id: 'trap', label: 'Trap' },
  { id: 'urbano', label: 'Urbano' },
  { id: 'experimental', label: 'Experimental' },
]
