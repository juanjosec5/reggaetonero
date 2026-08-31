/**
 * Where an artist lives. You start in a city in your home country and, as you
 * break bigger markets, relocate to the scene that's carrying you — a regional
 * hub, then Miami, then a global base. Moves are automatic and upward-only: each
 * step up a tier books bigger rooms (`venueBoost`, consumed by recordEngine).
 */

import { MARKETS } from '@/data/markets'
import type { MarketState } from '@/types/career'

export const INTERNATIONAL_HUB = 'Miami'

/** internationalReach at which a broken-out artist relocates. */
const RELOCATE_REACH = 13

/** Penetration a market needs before it can pull the artist to its hub. */
const MARKET_PULL_THRESHOLD = 40

const HOME_CITY_BY_COUNTRY: Record<string, string> = {
  'Puerto Rico': 'San Juan',
  Colombia: 'Medellín',
  'República Dominicana': 'Santo Domingo',
  Panamá: 'Ciudad de Panamá',
  Venezuela: 'Caracas',
  México: 'Ciudad de México',
  España: 'Madrid',
  Argentina: 'Buenos Aires',
  Chile: 'Santiago',
  'Estados Unidos': 'Nueva York',
}

export function homeCity(country: string): string {
  return HOME_CITY_BY_COUNTRY[country] ?? 'tu ciudad'
}

interface SceneCity {
  /** 0 = home / local, 1 = regional hub, 2 = crossover hub, 3 = global base. */
  tier: number
  /** How much bigger the rooms get living here — added to recordEngine's venue ramp. */
  venueBoost: number
}

const SCENE_CITIES: Record<string, SceneCity> = {
  'San Juan': { tier: 1, venueBoost: 0.12 },
  Medellín: { tier: 1, venueBoost: 0.12 },
  'Ciudad de México': { tier: 1, venueBoost: 0.12 },
  'Buenos Aires': { tier: 1, venueBoost: 0.1 },
  Miami: { tier: 2, venueBoost: 0.25 },
  Madrid: { tier: 2, venueBoost: 0.22 },
  'Nueva York': { tier: 2, venueBoost: 0.24 },
  'Los Ángeles': { tier: 3, venueBoost: 0.38 },
}

/** Every city an artist can live in — home cities plus the scene ladder. */
export const KNOWN_CITIES = new Set<string>([
  ...Object.values(HOME_CITY_BY_COUNTRY),
  ...Object.keys(SCENE_CITIES),
])

/** The scene city each market pulls a rising artist toward. */
const HUB_BY_MARKET: Record<string, string> = {
  pr: 'San Juan',
  do: 'San Juan',
  pa: 'San Juan',
  co: 'Medellín',
  ve: 'Medellín',
  mx: 'Ciudad de México',
  cono_sur: 'Buenos Aires',
  es: 'Madrid',
  us_latin: 'Miami',
  global: 'Los Ángeles',
}

export function sceneTier(city: string): number {
  return SCENE_CITIES[city]?.tier ?? 0
}

export function sceneVenueBoost(city: string): number {
  return SCENE_CITIES[city]?.venueBoost ?? 0
}

/**
 * Where a broken-out artist should be living now, or `null` to stay put. Picks
 * the hub of the biggest established market; falls back to Miami once reach is
 * high but no single market dominates. Upward-only — never returns a city whose
 * tier isn't above the current one, so the artist doesn't thrash or move "back".
 */
export function relocationTarget(
  currentCity: string,
  reach: number,
  markets: Pick<MarketState, 'id' | 'penetration' | 'unlocked'>[],
): string | null {
  if (reach < RELOCATE_REACH) return null

  const here = sceneTier(currentCity)
  const upward = markets
    .filter((m) => m.unlocked && m.penetration >= MARKET_PULL_THRESHOLD && HUB_BY_MARKET[m.id])
    .map((m) => ({ city: HUB_BY_MARKET[m.id]!, pull: m.penetration * MARKETS.get(m.id).size }))
    .filter((x) => sceneTier(x.city) > here)
    .sort((a, b) => b.pull - a.pull)

  if (upward[0]) return upward[0].city

  // No market pulls you higher, but you've broken out — the crossover hub.
  if (sceneTier(INTERNATIONAL_HUB) > here) return INTERNATIONAL_HUB

  // Artists who *start* at a tier-2 home base (Madrid, Nueva York) still get the
  // one crossover move to Miami — otherwise España/EE.UU. can never relocate.
  if (currentCity !== INTERNATIONAL_HUB && here === sceneTier(INTERNATIONAL_HUB)) {
    return INTERNATIONAL_HUB
  }
  return null
}
