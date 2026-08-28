import { MARKET_ESTABLISHED_THRESHOLD } from '@/engine/constants'
import type { Career, LegacyResult } from '@/types/career'

/** Markets the artist is genuinely established in — used by several verdicts. */
function establishedMarkets(career: Career): number {
  return career.markets.filter((m) => m.unlocked && m.penetration >= MARKET_ESTABLISHED_THRESHOLD).length
}

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
    score: (legacy, career) =>
      legacy.commercialScore * 1.5 -
      legacy.artisticScore * 0.5 +
      career.record.smashHits * 6 +
      career.record.hits * 2,
  },
  {
    id: 'el_independiente',
    title: 'EL INDEPENDIENTE',
    description: 'Nunca soltaste el control de tu música ni de tu carrera.',
    score: (legacy, career) =>
      (career.finances.ownershipPercent - 48) * 0.85 +
      career.stats.credibility * 0.3 +
      legacy.artisticScore * 0.15 -
      legacy.industryScore * 0.25 -
      (career.team.label ? 40 : 0),
  },
  {
    id: 'la_leyenda',
    title: 'LA LEYENDA',
    description: 'Tu nombre va a seguir sonando mucho después de que te retiraste.',
    // A top-end outlier: only a genuinely exceptional legacy clears the bar.
    score: (legacy, career) =>
      Math.max(0, legacy.legacyScore - 44) * 3.2 +
      career.stats.culturalImpact * 0.3 +
      establishedMarkets(career) * 3,
  },
  {
    id: 'el_rey_del_perreo',
    title: 'EL REY DEL PERREO',
    description: 'No hubo tarima ni fiesta que no fuera tuya.',
    score: (legacy, career) =>
      legacy.liveScore * 1.05 +
      career.stats.culturalImpact * 0.35 +
      career.hiddenTraits.authenticity * 0.2 +
      establishedMarkets(career) * 4,
  },
  {
    id: 'el_artista_de_culto',
    title: 'EL ARTISTA DE CULTO',
    description: 'Nunca fuiste masivo, pero quien te encontró no te soltó jamás.',
    score: (legacy, career) =>
      legacy.artisticScore * 1.3 - legacy.commercialScore * 0.7 + career.hiddenTraits.authenticity * 0.25,
  },
  {
    id: 'el_magnate',
    title: 'EL MAGNATE',
    description: 'La música fue solo el primer negocio de un imperio más grande.',
    score: (legacy, career) =>
      legacy.industryScore * 0.85 +
      career.finances.netWorth / 350 +
      career.finances.catalogValue / 350 +
      career.attributes.business * 0.3,
  },
  {
    id: 'el_what_if',
    title: 'EL WHAT IF',
    description: 'Tenías todo para ser el más grande. Nadie se explica qué pasó.',
    // Fires only when raw talent badly outran what the career actually became.
    score: (legacy, career) => Math.max(0, career.attributes.talent - legacy.legacyScore - 5) * 2.2,
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
