// ---- Identity ----
export type Genre = 'reggaeton' | 'trap' | 'urbano' | 'perreo' | 'experimental'

export type ArtistArchetype =
  | 'hitmaker'
  | 'perreo_king'
  | 'lyricist'
  | 'feature_artist'
  | 'experimental'
  | 'street'
  | 'performer'
  | 'executive'

export interface ArtistProfile {
  stageName: string
  realName?: string
  country: string
  age: number
  pronouns?: string
  genre: Genre // rolled internally at creation, not chosen by the player
  archetype: ArtistArchetype // rolled internally at creation, never shown as a label
}

/** What the player actually fills in on the creation screen. */
export interface CreationInput {
  stageName: string
  realName?: string
  country: string
  age: number
  pronouns?: string
}

// ---- Numbers the player build gives you (shown only as bands) ----
export interface ArtistAttributes {
  talent: number // 1-100
  writing: number
  voice: number
  productionSense: number
  charisma: number
  performance: number
  originality: number
  business: number
}

// ---- Never rendered. Drives narrative. ----
export interface HiddenTraits {
  ambition: number // 0-100
  discipline: number
  loyalty: number
  resilience: number
  ego: number
  patience: number
  riskTolerance: number
  authenticity: number
  adaptability: number
}

// ---- Public career numbers (these the player can see) ----
export interface CareerStats {
  fame: number
  fanbase: number
  hype: number
  credibility: number
  catalogStrength: number
  livePower: number
  industryRespect: number
  internationalReach: number
  culturalImpact: number
}

export interface Finances {
  cash: number
  netWorth: number
  catalogValue: number
  ownershipPercent: number // % of masters owned; ownership is a core decision axis
  annualIncome: number
}

export type ReleaseTier = 'flop' | 'normal' | 'good' | 'hit' | 'smash'

export interface Release {
  title: string
  year: number
  quality: number
  originality: number
  commerciality: number
  artistBuzz: number
  featurePower: number
  marketing: number
  timing: number
  hitScore: number // computed
  tier: ReleaseTier
}

export interface MusicCareerRecord {
  releases: number
  singles: number
  albums: number
  eps: number
  hits: number
  smashHits: number
  awards: number
}

// ---- Team ----
export type TeamRole = 'manager' | 'producer' | 'lawyer' | 'publicist' | 'bookingAgent'

export interface TeamMember {
  id: string // matches a ProducerDef / staff id in data
  name: string
  skill: number // 0-100
  loyalty: number // 0-100
  cost: number // annual, same units as finances.cash
  influence: number // 0-100
  sinceYear: number
}

export interface Team {
  manager?: TeamMember
  producer?: TeamMember
  lawyer?: TeamMember
  publicist?: TeamMember
  bookingAgent?: TeamMember
  label?: { id: string; name: string; ownershipTaken: number; signedYear: number }
}

// ---- Relationships (with memory) ----
export type RelationshipRole = 'producer' | 'manager' | 'rival' | 'collaborator' | 'label_exec' | 'mentor'

export interface RelationshipMemory {
  eventId: string
  year: number
  summary: string // Spanish, short — surfaced in the relationship/history UI
  delta: number // net trust shift, for tone
}

export interface Relationship {
  personId: string
  name: string // display name (fictional)
  role: RelationshipRole
  trust: number // 0-100
  loyalty: number // 0-100
  professionalValue: number // 0-100
  tension: number // 0-100
  memory: RelationshipMemory[]
}

// ---- Rivals ----
export interface Rival {
  id: string
  name: string
  archetype: ArtistArchetype
  fame: number // 0-100
  credibility: number // 0-100
  style: string // Spanish descriptor
  relationship: number // -100..100
  /** Only surfaced to the player once a decision has actually involved them. */
  discovered?: boolean
}

// ---- Geographic markets ----
export interface MarketState {
  id: string // matches a MarketDef id in data/markets.ts
  penetration: number // 0-100, how established the artist is here
  saturation: number // 0-100, how tapped-out the market is
  unlocked: boolean
}

// ---- Events & decisions ----
export type EventCategory =
  | 'music'
  | 'collaboration'
  | 'label'
  | 'management'
  | 'money'
  | 'tour'
  | 'media'
  | 'controversy'
  | 'relationship'
  | 'health'
  | 'technology'
  | 'fashion'
  | 'business'
  | 'competition'
  | 'legacy'

export type ChoiceStyle = 'safe' | 'ambitious' | 'loyal' | 'creative' | 'commercial'
export type VisibleRisk = 'low' | 'medium' | 'high'

// An effect is a RANGE, resolved by the RNG - never a fixed number.
// `kind` discriminates which subsystem the effect mutates; a missing `kind`
// is treated as 'stat' so Phase 1 event data keeps working unchanged.
export interface StatEffect {
  kind?: 'stat'
  target: string // dotted path: attributes.* | hiddenTraits.* | stats.* | finances.*
  min: number
  max: number
}

export interface RelationshipEffect {
  kind: 'relationship'
  personId: string
  field: 'trust' | 'loyalty' | 'professionalValue' | 'tension'
  min: number
  max: number
}

export interface RivalEffect {
  kind: 'rival'
  rivalId?: string // omit → nearest rival by fame
  field: 'fame' | 'credibility' | 'relationship'
  min: number
  max: number
}

export interface MarketEffect {
  kind: 'market'
  marketId?: string // omit → current market
  op: 'penetrate' | 'saturate' | 'unlock'
  min?: number // ignored for op: 'unlock'
  max?: number
}

export interface TeamEffect {
  kind: 'team'
  role?: TeamRole // for op: 'leave', omit to drop the least valuable current member
  op: 'hire' | 'leave' | 'adjustLoyalty'
  personId?: string // for op: 'hire' — omit to let the engine pick by budget/fit
  min?: number // for op: 'adjustLoyalty'
  max?: number
}

export interface LabelEffect {
  kind: 'label'
  op: 'sign' | 'leave'
  labelId?: string // for op: 'sign' — omit to let the engine pick by prestige/fame fit
}

export type CareerEffect =
  | StatEffect
  | RelationshipEffect
  | RivalEffect
  | MarketEffect
  | TeamEffect
  | LabelEffect

export interface DelayedEffect {
  eventId: string
  triggerYear?: number // fire on/after this career year
  triggerStat?: string // or when a stat crosses a threshold
  minimumValue?: number
}

export interface CareerChoice {
  text: string // player-facing, in Spanish
  style: ChoiceStyle
  effects: CareerEffect[] // applied to attributes/traits/stats/finances/team/relationships/rivals/markets
  delayedEffects?: DelayedEffect[]
}

export interface CareerEvent {
  id: string
  category: EventCategory
  title: string // Spanish
  description: string // Spanish
  visibleRisk: VisibleRisk
  condition: (c: Career) => boolean // eligibility
  weight: (c: Career) => number // relative likelihood when eligible
  choices: CareerChoice[]
  oncePerCareer?: boolean
}

// ---- Timeline ----
export type Era =
  | 'underground'
  | 'first_buzz'
  | 'breakout'
  | 'national'
  | 'international'
  | 'superstar'
  | 'reinvention'
  | 'legacy'

export interface CareerYear {
  year: number
  age: number
  era: Era
  releases: Release[]
  eventId?: string
  choiceTaken?: string
  choiceStyle?: ChoiceStyle // the style of the choice made this year - feeds the derived identity
  statsSnapshot: CareerStats
}

// ---- The root object ----
export interface LegacyResult {
  commercialScore: number
  artisticScore: number
  liveScore: number
  industryScore: number
  legacyScore: number
  verdictId: string // maps to a narrative identity in data/verdicts.ts
}

export type CareerMode = 'quick' | 'story' | 'daily' | 'challenge'
export type CareerStatus = 'active' | 'retired'

export const CURRENT_SAVE_VERSION = 4

export interface Career {
  id: string
  seed: number
  mode: CareerMode
  saveVersion: number // bump + migrate in the store when the shape changes

  artist: ArtistProfile
  attributes: ArtistAttributes
  hiddenTraits: HiddenTraits
  stats: CareerStats
  finances: Finances
  record: MusicCareerRecord
  team: Team
  relationships: Relationship[]
  rivals: Rival[]

  releases: Release[]
  history: CareerYear[]
  pendingEffects: DelayedEffect[]
  firedEventIds: string[] // enforce oncePerCareer

  age: number
  year: number
  era: Era
  currentMarket: string // MarketDef id the artist is currently focused on
  markets: MarketState[]

  status: CareerStatus
  legacy?: LegacyResult
}
