import { getArchetype } from '@/data/archetypes'
import type { EmphasisId } from '@/data/emphasis'
import { getEmphasis } from '@/data/emphasis'
import type { OpportunityId } from '@/data/opportunities'
import { getOpportunity } from '@/data/opportunities'
import { clampAttribute, clampStat, clampTrait, STARTING_CASH, STARTING_YEAR } from '@/engine/constants'
import { makeRng, rollRange } from '@/engine/rng'
import type {
  ArtistAttributes,
  ArtistProfile,
  Career,
  CareerMode,
  CareerStats,
  Finances,
  HiddenTraits,
  MusicCareerRecord,
} from '@/types/career'

export interface CreateCareerInput {
  profile: ArtistProfile
  seed: number
  mode?: CareerMode
  /** Player's chosen creative/business focus at creation time - nudges initial attributes. */
  emphasis?: EmphasisId
  /** Player's chosen starting scenario - nudges initial stats/traits. */
  opportunity?: OpportunityId
}

const ATTRIBUTE_KEYS: (keyof ArtistAttributes)[] = [
  'talent',
  'writing',
  'voice',
  'productionSense',
  'charisma',
  'performance',
  'originality',
  'business',
]

const TRAIT_KEYS: (keyof HiddenTraits)[] = [
  'ambition',
  'discipline',
  'loyalty',
  'resilience',
  'ego',
  'patience',
  'riskTolerance',
  'authenticity',
  'adaptability',
]

function rollAttributes(
  archetypeId: ArtistProfile['archetype'],
  emphasisId: EmphasisId | undefined,
  rng: ReturnType<typeof makeRng>,
) {
  const archetype = getArchetype(archetypeId)
  const emphasis = emphasisId ? getEmphasis(emphasisId) : undefined
  const attributes = {} as ArtistAttributes
  for (const key of ATTRIBUTE_KEYS) {
    const base = rollRange(rng, 25, 55)
    const archetypeBias = archetype.attributeBias[key] ?? 0
    const emphasisBias = emphasis?.attributeBias[key] ?? 0
    attributes[key] = clampAttribute(base + archetypeBias + emphasisBias)
  }
  return attributes
}

function rollTraits(archetypeId: ArtistProfile['archetype'], rng: ReturnType<typeof makeRng>) {
  const archetype = getArchetype(archetypeId)
  const traits = {} as HiddenTraits
  for (const key of TRAIT_KEYS) {
    const base = rollRange(rng, 20, 50)
    const bias = archetype.traitBias[key] ?? 0
    traits[key] = clampTrait(base + bias)
  }
  return traits
}

function initialStats(opportunityId: OpportunityId | undefined): CareerStats {
  const stats: CareerStats = {
    fame: 0,
    fanbase: 0,
    hype: 0,
    credibility: 10,
    catalogStrength: 0,
    livePower: 0,
    industryRespect: 0,
    internationalReach: 0,
    culturalImpact: 0,
  }
  if (!opportunityId) return stats

  const opportunity = getOpportunity(opportunityId)
  for (const [key, bias] of Object.entries(opportunity.statBias) as [keyof CareerStats, number][]) {
    stats[key] = clampStat(stats[key] + bias)
  }
  return stats
}

function applyOpportunityTraits(traits: HiddenTraits, opportunityId: OpportunityId | undefined): HiddenTraits {
  if (!opportunityId) return traits
  const opportunity = getOpportunity(opportunityId)
  if (!opportunity.traitBias) return traits
  for (const [key, bias] of Object.entries(opportunity.traitBias) as [keyof HiddenTraits, number][]) {
    traits[key] = clampTrait(traits[key] + bias)
  }
  return traits
}

function initialFinances(): Finances {
  return {
    cash: STARTING_CASH,
    netWorth: STARTING_CASH,
    catalogValue: 0,
    ownershipPercent: 100,
    annualIncome: 0,
  }
}

function initialRecord(): MusicCareerRecord {
  return {
    releases: 0,
    singles: 0,
    albums: 0,
    eps: 0,
    hits: 0,
    smashHits: 0,
    features: 0,
    streams: 0,
    certifications: 0,
    shows: 0,
    countriesPerformed: 0,
    awards: 0,
    numberOneRecords: 0,
  }
}

export function createCareer(input: CreateCareerInput): Career {
  const { profile, seed, mode = 'quick', emphasis, opportunity } = input
  const rng = makeRng(seed)

  const attributes = rollAttributes(profile.archetype, emphasis, rng)
  const hiddenTraits = applyOpportunityTraits(rollTraits(profile.archetype, rng), opportunity)
  const id = `career_${seed}_${rollRange(rng, 0, 999_999)}`

  return {
    id,
    seed,
    mode,

    artist: profile,
    attributes,
    hiddenTraits,
    stats: initialStats(opportunity),
    finances: initialFinances(),
    record: initialRecord(),
    team: {},
    relationships: [],
    rivals: [],

    releases: [],
    history: [],
    pendingEffects: [],
    firedEventIds: [],

    age: profile.age,
    year: STARTING_YEAR,
    era: 'underground',
    currentMarket: profile.country,

    status: 'active',
  }
}
