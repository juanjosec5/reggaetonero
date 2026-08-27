import type { Career, LegacyResult } from '@/types/career'

export interface VerdictDefinition {
  id: string
  title: string // Spanish
  description: string // Spanish
  /** Higher return = better fit. legacyEngine picks the highest-scoring verdict. */
  score: (legacy: LegacyResult, career: Career) => number
}

export const VERDICTS: VerdictDefinition[] = [
  {
    id: 'el_hitmaker',
    title: 'EL HITMAKER',
    description: 'Cada disco que soltaste terminó sonando en todos lados.',
    score: (legacy) => legacy.commercialScore * 1.4 - legacy.artisticScore * 0.3,
  },
  {
    id: 'el_independiente',
    title: 'EL INDEPENDIENTE',
    description: 'Nunca soltaste el control de tu música ni de tu carrera.',
    score: (legacy, career) =>
      career.finances.ownershipPercent * 1.2 + legacy.artisticScore * 0.5 - legacy.industryScore * 0.3,
  },
  {
    id: 'la_leyenda',
    title: 'LA LEYENDA',
    description: 'Tu nombre va a seguir sonando mucho después de que te retiraste.',
    score: (legacy) => legacy.legacyScore * 1.5,
  },
  {
    id: 'el_rey_del_perreo',
    title: 'EL REY DEL PERREO',
    description: 'No hubo tarima ni fiesta que no fuera tuya.',
    score: (legacy, career) =>
      legacy.liveScore * 1.1 + career.stats.culturalImpact * 0.6 + career.hiddenTraits.authenticity * 0.3,
  },
  {
    id: 'el_artista_de_culto',
    title: 'EL ARTISTA DE CULTO',
    description: 'Nunca fuiste masivo, pero quien te encontró no te soltó jamás.',
    score: (legacy) => legacy.artisticScore * 1.3 - legacy.commercialScore * 0.6,
  },
  {
    id: 'el_magnate',
    title: 'EL MAGNATE',
    description: 'La música fue solo el primer negocio de un imperio más grande.',
    score: (legacy, career) =>
      legacy.industryScore * 0.9 + career.finances.netWorth / 500 + career.finances.catalogValue / 500,
  },
  {
    id: 'el_what_if',
    title: 'EL WHAT IF',
    description: 'Tenías todo para ser el más grande. Nadie se explica qué pasó.',
    score: (legacy, career) => career.attributes.talent * 0.9 - legacy.legacyScore * 1.1,
  },
]

export function pickVerdict(legacy: LegacyResult, career: Career): VerdictDefinition {
  let best = VERDICTS[0]!
  let bestScore = -Infinity
  for (const verdict of VERDICTS) {
    const s = verdict.score(legacy, career)
    if (s > bestScore) {
      bestScore = s
      best = verdict
    }
  }
  return best
}
