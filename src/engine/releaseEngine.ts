import { BAND_THRESHOLDS, clampStat } from '@/engine/constants'
import type { Rng } from '@/engine/rng'
import { rollRange, weightedPick } from '@/engine/rng'
import type { Career, Release, ReleaseTier } from '@/types/career'

function noise(rng: Rng, spread = 15): number {
  return rollRange(rng, -spread, spread)
}

const TITLE_WORDS_A = ['Perreo', 'Fuego', 'Candela', 'Dura', 'Sola', 'Bandida', 'Traicionera', 'Peligrosa']
const TITLE_WORDS_B = ['Intenso', 'de Madrugada', 'Sin Freno', 'Eterno', 'en la Disco', 'Pa Siempre', 'Callejero']

function generateTitle(rng: Rng): string {
  const a = TITLE_WORDS_A[rollRange(rng, 0, TITLE_WORDS_A.length - 1)]
  const b = TITLE_WORDS_B[rollRange(rng, 0, TITLE_WORDS_B.length - 1)]
  return `${a} ${b}`
}

export function classifyTier(hitScore: number): ReleaseTier {
  if (hitScore >= BAND_THRESHOLDS.top) return 'smash'
  if (hitScore >= BAND_THRESHOLDS.veryHigh) return 'hit'
  if (hitScore >= BAND_THRESHOLDS.high) return 'good'
  if (hitScore >= BAND_THRESHOLDS.mid) return 'normal'
  return 'flop'
}

export function computeHitScore(release: Omit<Release, 'hitScore' | 'tier'>): number {
  const score =
    release.quality * 0.24 +
    release.commerciality * 0.22 +
    release.originality * 0.1 +
    release.artistBuzz * 0.12 +
    release.featurePower * 0.08 +
    release.marketing * 0.14 +
    release.timing * 0.1 +
    3
  return Math.round(clampStat(score))
}

function generateOneRelease(career: Career, rng: Rng): Release {
  const { attributes, stats, finances } = career
  const producerSkill = career.team.producer?.skill ?? 0

  const quality = clampStat(
    attributes.talent * 0.35 +
      attributes.productionSense * 0.3 +
      attributes.writing * 0.25 +
      producerSkill * 0.12 +
      noise(rng),
  )
  const originality = clampStat(attributes.originality + noise(rng))
  const commerciality = clampStat(
    attributes.business * 0.35 + attributes.charisma * 0.3 + stats.hype * 0.2 + stats.fame * 0.15 + noise(rng),
  )
  const artistBuzz = clampStat(stats.hype * 0.55 + stats.fame * 0.35 + 8 + noise(rng))
  const featurePower = clampStat(attributes.charisma * 0.45 + stats.fame * 0.35 + 6 + noise(rng))
  const marketing = clampStat((finances.cash > 100 ? 20 : 5) + attributes.business * 0.3 + noise(rng, 20))
  const timing = clampStat(rollRange(rng, 30, 80))

  const base = {
    title: generateTitle(rng),
    year: career.year,
    quality,
    originality,
    commerciality,
    artistBuzz,
    featurePower,
    marketing,
    timing,
  }

  const hitScore = computeHitScore(base)
  return { ...base, hitScore, tier: classifyTier(hitScore) }
}

type ReleaseKind = 'single' | 'ep' | 'album'

function pickReleaseKind(rng: Rng): ReleaseKind {
  const kinds: ReleaseKind[] = ['single', 'ep', 'album']
  return (
    weightedPick(kinds, (k) => (k === 'single' ? 7 : k === 'ep' ? 2 : 1), rng) ?? 'single'
  )
}

/** Generates 0-2 releases for the current year, each with a fictional title. */
export function generateReleases(career: Career, rng: Rng): { release: Release; kind: ReleaseKind }[] {
  // Output thins out with age - the veteran who drops an album a year is rare.
  const skipChance = 18 + Math.max(0, career.age - 31) * 3
  const count = rollRange(rng, 0, 100) <= skipChance ? 0 : rollRange(rng, 0, 100) <= 80 ? 1 : 2
  const releases: { release: Release; kind: ReleaseKind }[] = []
  for (let i = 0; i < count; i++) {
    releases.push({ release: generateOneRelease(career, rng), kind: pickReleaseKind(rng) })
  }
  return releases
}

/** Mutates `career` in place, folding the given releases into record and stats. */
export function applyReleasesToCareer(career: Career, releases: { release: Release; kind: ReleaseKind }[]): void {
  for (const { release } of releases) {
    career.releases.push(release)
    career.record.releases += 1

    if (release.tier === 'hit' || release.tier === 'smash') career.record.hits += 1
    if (release.tier === 'smash') career.record.smashHits += 1
    // Platinum certifications are derived yearly in recordEngine from hits + fanbase.

    if (release.tier === 'flop') {
      // A flop isn't neutral: it burns hype. Putting out music nobody wants is
      // a real risk — but it shouldn't erase a career either.
      career.stats.hype = clampStat(career.stats.hype - flopHypePenalty(release))
      career.stats.credibility = clampStat(career.stats.credibility - 1)
      career.stats.catalogStrength = clampStat(career.stats.catalogStrength + release.hitScore / 40)
      continue
    }

    const impact = release.hitScore / 10
    // Each hit moves the needle less once you're already famous - the jump from
    // unknown to somebody is far bigger than from star to bigger star.
    const fameGain = impact * 1.55 * Math.max(0.28, 1 - career.stats.fame / 175)
    career.stats.hype = clampStat(career.stats.hype + impact * 2.2)
    career.stats.fame = clampStat(career.stats.fame + fameGain)
    career.stats.catalogStrength = clampStat(career.stats.catalogStrength + impact * 1.05)
  }
}

/** Hype a flop costs — worse the further it missed, capped so it stings without wiping you out. */
function flopHypePenalty(release: Release): number {
  return Math.min(6, Math.round(2 + (40 - release.hitScore) / 12))
}
