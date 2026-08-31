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

  // Commercial and live standing are judged on what the career *reached* at its
  // height, tempered by where it ended - a hitmaker who faded still made hits.
  const snapshots = [...career.history.map((h) => h.statsSnapshot), stats]
  const peakOf = (sel: (s: typeof stats) => number) => Math.max(...snapshots.map(sel))

  const commercialFinal = (stats.fame + stats.hype + stats.catalogStrength + stats.fanbase) / 4
  const commercialPeak = peakOf((s) => (s.fame + s.hype + s.catalogStrength + s.fanbase) / 4)
  const commercialScore = clampStat(commercialPeak * 0.55 + commercialFinal * 0.45)

  const artisticScore = clampStat(
    attributes.talent * 0.2 +
      attributes.writing * 0.15 +
      attributes.originality * 0.3 +
      hiddenTraits.authenticity * 0.2 +
      stats.catalogStrength * 0.15,
  )

  const livePowerPeak = Math.max(stats.livePower, peakOf((s) => s.livePower) * 0.85)
  const liveScore = clampStat(
    attributes.performance * 0.36 +
      attributes.charisma * 0.22 +
      attributes.voice * 0.12 +
      livePowerPeak * 0.3,
  )

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

  // Every career now runs a fixed 21 years, so raw length says nothing. Reward
  // *sustained* relevance: mean fame across the run rewards a long plateau and
  // punishes a brief peak or a late rise / early collapse.
  const fameHistory = career.history.map((h) => h.statsSnapshot.fame)
  const meanFame = fameHistory.length
    ? fameHistory.reduce((sum, f) => sum + f, 0) / fameHistory.length
    : stats.fame
  const longevity = clampStat(meanFame * 0.7 + career.peakFame * 0.3)
  const catalogValueScore = clampStat(finances.catalogValue / 45)

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
    longevityScore: Math.round(longevity),
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
