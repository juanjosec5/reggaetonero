import { establishedMarkets } from '@/engine/marketEngine'
import type { Career, LegacyResult } from '@/types/career'

/** How many markets the artist is genuinely established in — used by several verdicts. */
function establishedMarketCount(career: Career): number {
  return establishedMarkets(career).length
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
      legacy.commercialScore * 1.3 -
      legacy.artisticScore * 0.3 +
      Math.max(0, legacy.commercialScore - 42) * 1.15 +
      career.record.smashHits * 8 +
      career.record.hits * 3,
  },
  {
    id: 'el_independiente',
    title: 'EL INDEPENDIENTE',
    description: 'Nunca soltaste el control de tu música ni de tu carrera.',
    score: (legacy, career) =>
      (career.finances.ownershipPercent - 45) * 0.9 +
      career.stats.credibility * 0.35 +
      legacy.artisticScore * 0.1 -
      legacy.industryScore * 0.2 -
      (career.team.label ? 45 : 0),
  },
  {
    id: 'la_leyenda',
    title: 'LA LEYENDA',
    description: 'Tu nombre va a seguir sonando mucho después de que te retiraste.',
    // Reserved for the rare career that stayed great for years, across axes.
    score: (legacy, career) =>
      Math.max(0, legacy.longevityScore - 54) * 3 +
      career.stats.culturalImpact * 0.25 +
      career.peakFame * 0.12 +
      establishedMarketCount(career) * 2,
  },
  {
    id: 'el_rey_del_perreo',
    title: 'EL REY DEL PERREO',
    description: 'No hubo tarima ni fiesta que no fuera tuya.',
    // The stage/street king - not the studio craftsman.
    score: (legacy, career) =>
      legacy.liveScore * 1.2 +
      career.stats.culturalImpact * 0.28 +
      career.hiddenTraits.authenticity * 0.2 +
      establishedMarketCount(career) * 2 -
      legacy.artisticScore * 0.25,
  },
  {
    id: 'el_artista_de_culto',
    title: 'EL ARTISTA DE CULTO',
    description: 'Nunca fuiste masivo, pero quien te encontró no te soltó jamás.',
    // Artistic, authentic, and never (or no longer) famous.
    score: (legacy, career) =>
      legacy.artisticScore * 1.35 -
      legacy.commercialScore * 0.5 +
      career.hiddenTraits.authenticity * 0.3 -
      career.stats.fame * 0.25,
  },
  {
    id: 'el_magnate',
    title: 'EL MAGNATE',
    description: 'La música fue solo el primer negocio de un imperio más grande.',
    score: (legacy, career) =>
      legacy.industryScore * 0.6 +
      career.finances.netWorth / 900 +
      career.finances.catalogValue / 800 +
      career.attributes.business * 0.5,
  },
  {
    id: 'el_what_if',
    title: 'EL WHAT IF',
    description: 'Tenías todo para ser el más grande. Nadie se explica qué pasó.',
    // A steep peak-then-collapse, or raw talent that never became a career.
    score: (legacy, career) =>
      (career.peakFame - career.stats.fame) * 0.85 +
      Math.max(0, career.attributes.talent - legacy.legacyScore) * 1.5,
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
