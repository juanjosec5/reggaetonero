# plan.md — PERREO: Reggaetón Career Simulator

A browser-based narrative career simulator for a reggaetón artist, inspired by the
Copero football-career loop. This document is the build plan for Claude Code. Work
through it **phase by phase**. Do not build everything at once — Phase 1 is a
complete, playable MVP and must ship before Phase 2 starts.

Working title: **REGGAETONERO**. Use `reggaetonero` as the package name.

---

## 0. The one design rule that governs everything

> The game must **never feel like a spreadsheet**.

The player sees a situation and a choice ("Un sello grande te ofrece un contrato de
tres álbumes → Firmar / Negociar / Seguir independiente"). The player must **not** see
the numbers behind it (`+12 ambition, -8 control, +5 money`). All attribute and trait
math happens internally. Choices have a **visible direction and risk level** only.

Two consequences of this rule that must hold across the whole codebase:

1. **Hidden traits are never rendered.** `HiddenTraits` (ambition, ego, loyalty, etc.)
   drive the narrative but are not shown to the player, ever. Attributes are shown only
   as descriptive bands (Natural / Promising / Strong / Elite / Exceptional), never as
   raw 1–100 numbers.
2. **Not every choice resolves immediately.** Delayed consequences are a first-class
   mechanic. A decision in Year 2 can trigger an event in Year 5. Build the delayed-effect
   queue in Phase 1 even though most content that uses it arrives later.

If a task ever tempts you to expose internal numbers to make something "clearer,"
stop — that breaks the core loop. Surface a narrative label instead.

---

## 1. Tech stack (decided — do not substitute)

- **Vue 3** with `<script setup>` and the Composition API only. No Options API.
- **TypeScript**, strict mode on.
- **Vite** as the build tool.
- **Pinia** for state (career state + persistence). Use the setup-store syntax.
- **Vue Router** for the screen flow.
- **Tailwind CSS** for styling. Mobile-first.
- **Vitest** for unit tests. **@vue/test-utils** for component tests.
- **localStorage** for saves in Phase 1 (swap to IndexedDB only if a save outgrows it; not now).
- **ESLint + Prettier**, TypeScript-aware config.
- No UI component library. Build the handful of components we need directly.
- No backend. The entire game runs client-side. This keeps it deployable as a static
  site / PWA and, later, embeddable behind an API without rewriting the engine.

Node 20+. Use `npm` unless the repo already has a lockfile for another manager.

---

## 2. Architecture — three hard layers

Keep these three layers strictly separated. This is the most important architectural
constraint after the design rule above.

```
UI (Vue)  →  reads career state, renders it, sends player intent
State (Pinia)  →  holds the Career object, orchestrates, persists
Engine (pure TS)  →  creates and mutates careers; zero Vue imports
```

**The engine is pure TypeScript with no Vue, no Pinia, no DOM, no `Math.random`.**
Every engine function is deterministic given its inputs plus an injected RNG. This is
what makes daily/seeded/shareable careers and reliable tests possible. If any file under
`src/engine/` imports from `vue`, `pinia`, or calls `Math.random()` directly, that is a
bug.

- **Vue renders the career. The engine creates the career.**
- Randomness enters only through a seeded RNG passed into engine functions.
- Pinia is the only place that talks to both the engine and `localStorage`.

### Directory structure

```
src/
├── assets/
├── components/
│   ├── ArtistBuilder.vue
│   ├── ArchetypeSelector.vue
│   ├── AttributeBand.vue        # renders a descriptive label, never a number
│   ├── DecisionCard.vue         # bottom-sheet style, one decision, risk indicator
│   ├── RiskBadge.vue
│   ├── CareerTimeline.vue       # horizontal, era-based
│   ├── CareerStatsPanel.vue     # public stats only
│   ├── ReleaseCard.vue
│   ├── OfferCard.vue
│   └── LegacyCard.vue           # the shareable end card
│
├── views/
│   ├── HomeView.vue
│   ├── CreateArtistView.vue
│   ├── CareerView.vue           # the main year-by-year loop container
│   ├── DecisionView.vue
│   ├── HistoryView.vue
│   └── LegacyView.vue
│
├── stores/
│   └── career.ts                # useCareerStore (setup syntax)
│
├── engine/
│   ├── rng.ts                   # seeded PRNG + helpers (weightedPick, rollRange)
│   ├── createCareer.ts          # profile+archetype → initial Career
│   ├── careerEngine.ts          # simulateYear orchestration
│   ├── progressionEngine.ts     # popularity/fanbase/attribute drift
│   ├── releaseEngine.ts         # release generation + hit scoring
│   ├── decisionEngine.ts        # apply choice effects, queue delayed effects
│   ├── eventEngine.ts           # eligibility filter + weighted event pick
│   ├── financeEngine.ts         # cash/net worth/catalog value
│   ├── marketEngine.ts          # geographic market progression (Phase 2)
│   └── legacyEngine.ts          # final scores + narrative verdict
│
├── data/
│   ├── archetypes.ts
│   ├── markets.ts
│   ├── events/                  # events split by category, re-exported from index.ts
│   │   ├── index.ts
│   │   ├── music.ts
│   │   ├── label.ts
│   │   ├── collaboration.ts
│   │   └── ...
│   ├── verdicts.ts              # narrative ending identities
│   ├── fictionalArtists.ts      # rivals/collaborators (Phase 2)
│   ├── labels.ts                # (Phase 2)
│   └── producers.ts             # (Phase 2)
│
├── types/
│   └── career.ts                # all shared interfaces live here
│
├── router/
│   └── index.ts
├── App.vue
└── main.ts

tests/
├── engine/                      # the bulk of tests — engine is pure, test it hard
└── components/
```

Keep all shared interfaces in `src/types/career.ts` so the engine, store, and UI import
from one contract.

---

## 3. Type contracts (define these first, in `src/types/career.ts`)

Build these before any logic. They are the shared language of all three layers.

```ts
// ---- Identity ----
type Genre = 'reggaeton' | 'trap' | 'urbano' | 'perreo' | 'experimental'

type ArtistArchetype =
  | 'hitmaker' | 'perreo_king' | 'lyricist' | 'feature_artist'
  | 'experimental' | 'street' | 'performer' | 'executive'

interface ArtistProfile {
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
interface ArtistAttributes {
  talent: number          // 1–100
  writing: number
  voice: number
  productionSense: number
  charisma: number
  performance: number
  originality: number
  business: number
}

// ---- Never rendered. Drives narrative. ----
interface HiddenTraits {
  ambition: number        // 0–100
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
interface CareerStats {
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

interface Finances {
  cash: number
  netWorth: number
  catalogValue: number
  ownershipPercent: number   // % of masters owned; ownership is a core decision axis
  annualIncome: number
}

interface Release {
  title: string
  year: number
  quality: number
  originality: number
  commerciality: number
  artistBuzz: number
  featurePower: number
  marketing: number
  timing: number
  hitScore: number           // computed
  tier: 'flop' | 'normal' | 'good' | 'hit' | 'smash'
}

interface MusicCareerRecord {
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

// ---- Team & relationships (Phase 2, but type them now) ----
interface TeamMember { skill: number; loyalty: number; cost: number; influence: number }
interface Team {
  manager?: TeamMember
  producer?: TeamMember
  lawyer?: TeamMember
  publicist?: TeamMember
  bookingAgent?: TeamMember
  label?: { name: string; ownershipTaken: number }
}
interface Relationship {
  personId: string
  trust: number
  loyalty: number
  professionalValue: number
  tension: number
}
interface Rival { name: string; fame: number; credibility: number; style: string; relationship: number }

// ---- Events & decisions ----
type EventCategory =
  | 'music' | 'collaboration' | 'label' | 'management' | 'money' | 'tour'
  | 'media' | 'controversy' | 'relationship' | 'health' | 'technology'
  | 'fashion' | 'business' | 'competition' | 'legacy'

type ChoiceStyle = 'safe' | 'ambitious' | 'loyal' | 'creative' | 'commercial'
type VisibleRisk = 'low' | 'medium' | 'high'

// An effect is a RANGE, resolved by the RNG — never a fixed number.
interface StatEffect { target: string; min: number; max: number }

interface DelayedEffect {
  eventId: string
  triggerYear?: number       // fire on/after this career year
  triggerStat?: string       // or when a stat crosses a threshold
  minimumValue?: number
}

interface CareerChoice {
  text: string               // player-facing, in Spanish
  style: ChoiceStyle
  effects: StatEffect[]      // applied to attributes/traits/stats/finances
  delayedEffects?: DelayedEffect[]
}

interface CareerEvent {
  id: string
  category: EventCategory
  title: string              // Spanish
  description: string        // Spanish
  visibleRisk: VisibleRisk
  condition: (c: Career) => boolean   // eligibility
  weight: (c: Career) => number       // relative likelihood when eligible
  choices: CareerChoice[]
  oncePerCareer?: boolean
}

// ---- Timeline ----
type Era =
  | 'underground' | 'first_buzz' | 'breakout' | 'national'
  | 'international' | 'superstar' | 'reinvention' | 'legacy'

interface CareerYear {
  year: number
  age: number
  era: Era
  releases: Release[]
  eventId?: string
  choiceTaken?: string
  statsSnapshot: CareerStats
}

// ---- The root object ----
interface LegacyResult {
  commercialScore: number
  artisticScore: number
  liveScore: number
  industryScore: number
  legacyScore: number
  verdictId: string          // maps to a narrative identity in data/verdicts.ts
}

interface Career {
  id: string
  seed: number
  mode: 'quick' | 'story' | 'daily' | 'challenge'

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
  firedEventIds: string[]    // enforce oncePerCareer

  age: number
  year: number
  era: Era
  currentMarket: string

  status: 'active' | 'retired'
  legacy?: LegacyResult
}
```

Notes:
- Attributes are `1–100`; hidden traits and public stats use `0–100`. Clamp on every write.
- `ownershipPercent` and `catalogValue` exist so "take the money vs. keep your masters"
  is a real, recurring decision axis — wire them in from Phase 1 even if lightly used.

---

## 4. The core loop (what the engine must produce)

```
CREATE ARTIST → CHOOSE ARCHETYPE → INITIAL ATTRIBUTES → CHOOSE FIRST OPPORTUNITY
   → [ SIMULATE YEAR → RELEASES → FAME/MONEY → CAREER EVENT → PLAYER DECISION
       → HIDDEN TRAITS SHIFT → DELAYED EFFECTS QUEUED → NEXT YEAR ] × N
   → RETIREMENT → LEGACY CALCULATION → SHAREABLE CARD
```

`simulateYear(career, rng): Career` orchestrates one year and returns a **new** career
object (clone, don't mutate in place — use `structuredClone`). Order inside a year:

1. `career.age += 1`, advance `year`, recompute `era` from progress.
2. Progression: drift attributes/popularity/fanbase (`progressionEngine`).
3. Releases: generate 0–2 releases, score each (`releaseEngine`), update record + stats.
4. Finances: recompute cash/income/net worth/catalog value (`financeEngine`).
5. Fire any due delayed effects, then pick at most one eligible event (`eventEngine`).
6. Return the new career; the store persists it. The **player decision** on the event is
   applied in a separate `applyChoice` call when the UI submits it, then the loop resumes.

---

## 5. Formulas (implement in the engine, keep them hidden from the UI)

Derived scores — computed, never stored as a single "OVR". There is deliberately no
single overall rating.

```
commercial = fame*0.25 + hype*0.25 + catalogStrength*0.25 + fanbase*0.25
artistic   = talent*0.20 + writing*0.15 + originality*0.30 + authenticity*0.20 + catalogStrength*0.15
live       = performance*0.40 + charisma*0.25 + livePower*0.35
industry   = business*0.30 + industryRespect*0.30 + networking*0.20 + adaptability*0.20
```

(`authenticity`, `adaptability` come from hidden traits; `networking` — fold into
`business`/`industryRespect` for MVP or add a small derived term, but keep it internal.)

Release hit score, then classify:

```
hitScore = quality*0.20 + commerciality*0.20 + originality*0.10 + artistBuzz*0.15
         + featurePower*0.10 + marketing*0.15 + timing*0.10

0–39 Flop | 40–59 Normal | 60–74 Good | 75–89 Hit | 90–100 Smash
```

Legacy score (hidden formula, shown only as a final number + verdict):

```
legacy = commercialSuccess*0.20 + artisticImpact*0.20 + longevity*0.15
       + culturalImpact*0.15 + catalogValue*0.10 + liveSuccess*0.10 + industryInfluence*0.10
```

---

## 6. Seeded RNG (build first — everything depends on it)

`src/engine/rng.ts`. A deterministic PRNG so the same seed + same decisions reproduce the
same career (needed for Daily, sharing, and tests). The spec's LCG is fine as a starting
point but use a better one — implement **mulberry32** (or xorshift128) seeded from a
number. Provide:

```ts
export function makeRng(seed: number): () => number      // returns [0,1)
export function rollRange(rng, min: number, max: number): number
export function weightedPick<T>(items: T[], weight: (t: T) => number, rng): T | undefined
```

Every effect range (`{min, max}`) resolves through `rollRange`. Every event choice
resolves through `weightedPick`. No `Math.random()` anywhere in `src/engine/`.

---

## 7. Content — fictional only

**All artists, labels, producers, awards, and contracts are fictional.** Real-world
geography and genre history give flavor, but no real person's biography drives any
outcome. This is a hard rule: it keeps the game legally clean and lets it generate
thousands of careers without depending on real people. Game-facing copy (event titles,
descriptions, choices, verdicts) is written in **Spanish**; code, types, and comments in
English.

Starting geography materially shapes early opportunities but never predetermines success.
Origins (country + city) from the spec: Puerto Rico, Colombia, Dominican Republic, Panama,
Venezuela, Mexico, Spain, Argentina, Chile, USA/Miami, Other — with cities like San Juan,
Carolina, Bayamón, Ponce, Medellín, Bogotá, Cali, Barranquilla, Santo Domingo, Miami,
Mexico City, Madrid, Barcelona.

Archetypes (8), each with an attribute-weighting profile in `data/archetypes.ts`. Note the
spec lists "HITMAKER" twice (items 1 and 4) — collapse the duplicate: item 4 is the
**FEATURE ARTIST**. Final eight: `hitmaker, perreo_king, lyricist, feature_artist,
experimental, street, performer, executive`.

Verdicts (`data/verdicts.ts`) are narrative identities, not scores: EL HITMAKER, EL
INDEPENDIENTE, LA LEYENDA, EL REY DEL PERREO, EL ARTISTA DE CULTO, EL MAGNATE, EL WHAT IF.
Pick the verdict from the balance of the four derived scores + key hidden traits, not from
a single threshold.

---

## 8. Screen flow (Vue Router)

```
/                 HomeView         → mode select (Quick / Story / Daily), continue save
/create           CreateArtistView → identity → archetype → attribute emphasis → first opportunity
/career           CareerView       → year loop; shows timeline + public stats
/career/decision  DecisionView     → one event, bottom-sheet card, risk badge, 2–4 choices
/history          HistoryView      → scrollable career log
/legacy           LegacyView       → LegacyCard (shareable)
```

Mobile-first, per the spec: one decision per screen, large tap targets, minimal text
before the choice, one primary action, a visible risk indicator, a horizontal era
timeline, bottom-sheet event cards, and a shareable final card. Target ~3–7 min for Quick,
~10–15 min for Story.

---

## 9. Build phases

Ship each phase as a working, playable increment. Do not start a phase until the previous
one runs end-to-end and its tests pass.

### Phase 1 — MVP (build this first, in this order)

Goal: a full playable career start-to-legacy on mobile.

1. **Scaffold**: Vite + Vue 3 + TS (strict) + Pinia + Router + Tailwind + Vitest + ESLint/
   Prettier. Confirm `npm run dev`, `npm run build`, `npm run test` all work.
2. **Types**: `src/types/career.ts` — the full contract from §3.
3. **RNG**: `src/engine/rng.ts` + tests (same seed ⇒ same sequence; `weightedPick`
   distribution sanity check).
4. **Data (minimal)**: 8 archetypes with weightings; origins/cities list; 7 verdicts;
   **20 events** spread across categories (music/label/collaboration/money/media/
   controversy) each with 2–4 choices and effect ranges; a few using `delayedEffects`.
5. **Engine**: `createCareer` (profile+archetype → seeded initial Career with clamped
   attributes/traits), `progressionEngine`, `releaseEngine` (+ hit classify),
   `financeEngine`, `decisionEngine` (`applyChoice` resolves ranges via RNG, queues delayed
   effects, clamps), `eventEngine` (eligibility filter → weighted pick, respect
   `oncePerCareer` and `pendingEffects`), `careerEngine.simulateYear`, `legacyEngine`.
   Unit tests for each. This is where most test coverage lives.
6. **Store**: `stores/career.ts` — `startCareer`, `applyChoice`, `advanceYear`, `retire`,
   `save`/`load` (localStorage), `hasSave`. Orchestrates engine calls; holds no game math.
7. **UI**: the views in §8 + components in §2. `AttributeBand` shows Natural/Promising/
   Strong/Elite/Exceptional — never a raw number. `DecisionCard` shows title, short
   description, `RiskBadge`, and the choices. `LegacyCard` renders the shareable card.
8. **Legacy card export**: render the card to PNG (html-to-canvas approach) and wire the
   Web Share API where available, with a download fallback.

Phase 1 acceptance criteria:
- Create an artist, choose an archetype and first opportunity, play ~10 career years,
  make ~7–10 decisions, retire, and get a narrative verdict + shareable card.
- No hidden trait or raw attribute number ever appears in the UI.
- Re-running the same seed + same choices produces an identical career (add a test that
  asserts this end-to-end).
- Engine has zero imports from `vue`/`pinia` and zero `Math.random()`.

### Phase 2 — Depth
50+ events; relationships with memory; team building (manager/producer/lawyer/etc.);
producers & labels as data; richer release/money/market systems; geographic market
progression (`marketEngine`, `data/markets.ts`); rival system with fictional rivals.

### Phase 3 — Modes & social
Daily challenge (fixed seed + fixed starting profile/opportunities, divergent endings);
seed sharing; shareable challenge links; local leaderboards; achievements.

### Phase 4 — Full simulator
Full ~20-year career; dynamic markets; active rival storylines; catalog ownership as a
deep system; advanced business/negotiation; multiple distinct endings.

---

## 10. Conventions

- `<script setup lang="ts">` everywhere; setup-syntax Pinia stores.
- Engine functions are pure: `(input, rng) => output`, no side effects, no clock, no DOM.
- Never mutate `Career` in place inside the engine — clone (`structuredClone`) and return.
- Clamp every attribute/trait/stat write to its valid range.
- No magic numbers loose in components — game math lives in the engine, tuning constants in
  a `src/engine/constants.ts`.
- Player-facing strings in Spanish; identifiers/comments in English.
- Prefer many small declarative event objects in `data/events/` over branching logic in
  the engine. Adding content should mean adding data, not code.
- Tests: engine first and thoroughly (it's pure and high-value); a few component tests for
  the create flow and decision flow. Include the deterministic-replay test.

---

## 11. First actions for Claude Code

1. Scaffold the project (§9 Phase 1, step 1) and get dev/build/test green.
2. Write `src/types/career.ts` (§3).
3. Write and test `src/engine/rng.ts` (§6).
4. Then proceed through Phase 1 steps 4–8 in order.

Confirm the scaffold runs before writing any game logic. Build Phase 1 to its acceptance
criteria and stop there for review before starting Phase 2.
