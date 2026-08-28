import { ARCHETYPES, getArchetype } from '@/data/archetypes'
import { EMPHASES, getEmphasis } from '@/data/emphasis'
import type { EmphasisId } from '@/data/emphasis'
import { pickRivals } from '@/data/fictionalArtists'
import { homeCity } from '@/data/cities'
import { GENRES } from '@/data/genres'
import { homeMarketId, initialMarkets } from '@/data/markets'
import { OPPORTUNITIES } from '@/data/opportunities'
import type { OpportunityId } from '@/data/opportunities'
import { getOpportunity } from '@/data/opportunities'
import {
  clampAttribute,
  clampStat,
  clampTrait,
  STARTING_AGE,
  STARTING_CASH,
  STARTING_YEAR,
} from '@/engine/constants'
import { makeRng, rollRange } from '@/engine/rng'
import { CURRENT_SAVE_VERSION } from '@/types/career'
import type {
  ArtistAttributes,
  ArtistArchetype,
  ArtistProfile,
  Career,
  CareerMode,
  CareerStats,
  CreationInput,
  Finances,
  Genre,
  HiddenTraits,
  MusicCareerRecord,
} from '@/types/career'

export interface CreateCareerInput {
  profile: CreationInput
  seed: number
  mode?: CareerMode
}

/** Rolls the hidden build inputs (genre + archetype + emphasis + scenario) the player no longer picks. */
function rollBuild(rng: ReturnType<typeof makeRng>): {
  genre: Genre
  archetypeId: ArtistArchetype
  emphasisId: EmphasisId
  opportunityId: OpportunityId
} {
  return {
    genre: GENRES[rollRange(rng, 0, GENRES.length - 1)]!.id,
    archetypeId: ARCHETYPES[rollRange(rng, 0, ARCHETYPES.length - 1)]!.id,
    emphasisId: EMPHASES[rollRange(rng, 0, EMPHASES.length - 1)]!.id,
    opportunityId: OPPORTUNITIES[rollRange(rng, 0, OPPORTUNITIES.length - 1)]!.id,
  }
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
    hits: 0,
    smashHits: 0,
    platinumRecords: 0,
    grammys: 0,
    billboards: 0,
    clubShows: 0,
    stadiumShows: 0,
    ticketsSold: 0,
  }
}

export function createCareer(input: CreateCareerInput): Career {
  const { profile, seed, mode = 'quick' } = input
  const rng = makeRng(seed)

  // The player only gives us name + country; everything else that shapes the
  // starting build is rolled here from the seed and never surfaced. Age is fixed.
  const { genre, archetypeId, emphasisId, opportunityId } = rollBuild(rng)
  const artist: ArtistProfile = { ...profile, age: STARTING_AGE, genre, archetype: archetypeId }

  const attributes = rollAttributes(archetypeId, emphasisId, rng)
  const hiddenTraits = applyOpportunityTraits(rollTraits(archetypeId, rng), opportunityId)
  const id = `career_${seed}_${rollRange(rng, 0, 999_999)}`
  const rivals = pickRivals(rng, 3)

  return {
    id,
    seed,
    mode,
    saveVersion: CURRENT_SAVE_VERSION,

    artist,
    attributes,
    hiddenTraits,
    stats: initialStats(opportunityId),
    finances: initialFinances(),
    record: initialRecord(),
    team: {},
    relationships: [],
    rivals,

    releases: [],
    history: [],
    pendingEffects: [],
    firedEventIds: [],

    age: STARTING_AGE,
    year: STARTING_YEAR,
    era: 'debut',
    awards: [],
    peakFame: 0,
    residence: homeCity(profile.country),
    currentMarket: homeMarketId(profile.country),
    markets: initialMarkets(profile.country),

    status: 'active',
  }
}
