import { pickVerdict } from '@/data/verdicts'
import { clampStat } from '@/engine/constants'
import type { Career, LegacyResult } from '@/types/career'

/**
 * Computes the four derived career scores plus the overall legacy score and
 * narrative verdict. These formulas are intentionally never exposed to the
 * player as raw numbers during active play - they only surface on the final
 * legacy screen, and there only as the finished scores, never their inputs.
 */
export function computeLegacy(career: Career): LegacyResult {
  const { attributes, hiddenTraits, stats, finances } = career

  const commercialScore = clampStat(
    stats.fame * 0.25 + stats.hype * 0.25 + stats.catalogStrength * 0.25 + stats.fanbase * 0.25,
  )

  const artisticScore = clampStat(
    attributes.talent * 0.2 +
      attributes.writing * 0.15 +
      attributes.originality * 0.3 +
      hiddenTraits.authenticity * 0.2 +
      stats.catalogStrength * 0.15,
  )

  const liveScore = clampStat(attributes.performance * 0.4 + attributes.charisma * 0.25 + stats.livePower * 0.35)

  // "networking" is now a real term: the reach of the artist's team.
  const teamMembers = Object.values(career.team).filter(
    (m): m is NonNullable<typeof m> => Boolean(m) && 'influence' in (m as object),
  ) as { influence: number }[]
  const networking = teamMembers.length
    ? teamMembers.reduce((sum, m) => sum + m.influence, 0) / teamMembers.length
    : 0

  const industryScore = clampStat(
    attributes.business * 0.3 +
      stats.industryRespect * 0.3 +
      networking * 0.2 +
      hiddenTraits.adaptability * 0.2,
  )

  const longevity = clampStat(career.year * 5)
  const catalogValueScore = clampStat(finances.catalogValue / 10)

  const legacyScore = clampStat(
    commercialScore * 0.2 +
      artisticScore * 0.2 +
      longevity * 0.15 +
      stats.culturalImpact * 0.15 +
      catalogValueScore * 0.1 +
      liveScore * 0.1 +
      industryScore * 0.1,
  )

  const legacy: LegacyResult = {
    commercialScore: Math.round(commercialScore),
    artisticScore: Math.round(artisticScore),
    liveScore: Math.round(liveScore),
    industryScore: Math.round(industryScore),
    legacyScore: Math.round(legacyScore),
    verdictId: '',
  }

  legacy.verdictId = pickVerdict(legacy, career).id
  return legacy
}

/** Returns a new, retired Career with its `legacy` field populated. */
export function retire(career: Career): Career {
  const next = structuredClone(career)
  next.status = 'retired'
  next.legacy = computeLegacy(next)
  return next
}
