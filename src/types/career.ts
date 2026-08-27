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
  city: string
  age: number
  pronouns?: string
  genre: Genre
  archetype: ArtistArchetype
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
  features: number
  streams: number
  certifications: number
  shows: number
  countriesPerformed: number
  awards: number
  numberOneRecords: number
}

// ---- Team & relationships (Phase 2, but typed now) ----
export interface TeamMember {
  skill: number
  loyalty: number
  cost: number
  influence: number
}

export interface Team {
  manager?: TeamMember
  producer?: TeamMember
  lawyer?: TeamMember
  publicist?: TeamMember
  bookingAgent?: TeamMember
  label?: { name: string; ownershipTaken: number }
}

export interface Relationship {
  personId: string
  trust: number
  loyalty: number
  professionalValue: number
  tension: number
}

export interface Rival {
  name: string
  fame: number
  credibility: number
  style: string
  relationship: number
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
export interface StatEffect {
  target: string
  min: number
  max: number
}

export interface DelayedEffect {
  eventId: string
  triggerYear?: number // fire on/after this career year
  triggerStat?: string // or when a stat crosses a threshold
  minimumValue?: number
}

export interface CareerChoice {
  text: string // player-facing, in Spanish
  style: ChoiceStyle
  effects: StatEffect[] // applied to attributes/traits/stats/finances
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

export interface Career {
  id: string
  seed: number
  mode: CareerMode

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
  currentMarket: string

  status: CareerStatus
  legacy?: LegacyResult
}
