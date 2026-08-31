import type { MarketState } from '@/types/career'

import { defineCatalog } from './catalog'

export interface MarketDef {
  id: string
  label: string // Spanish
  /** How hard it is to break in (0-100). Higher = slower penetration growth. */
  difficulty: number
  /** Commercial ceiling / audience size (0-100). Scales the reach this market grants. */
  size: number
  /** Markets that open up once this one is established. */
  adjacency: string[]
}

export const MARKETS = defineCatalog<MarketDef>('market', [
  { id: 'pr', label: 'Puerto Rico', difficulty: 20, size: 45, adjacency: ['do', 'us_latin'] },
  { id: 'co', label: 'Colombia', difficulty: 30, size: 60, adjacency: ['ve', 'mx'] },
  { id: 'do', label: 'República Dominicana', difficulty: 30, size: 40, adjacency: ['pr', 'us_latin'] },
  { id: 'pa', label: 'Panamá', difficulty: 35, size: 30, adjacency: ['co', 'do'] },
  { id: 've', label: 'Venezuela', difficulty: 45, size: 35, adjacency: ['co'] },
  { id: 'mx', label: 'México', difficulty: 50, size: 85, adjacency: ['us_latin', 'es'] },
  { id: 'es', label: 'España', difficulty: 55, size: 70, adjacency: ['global'] },
  { id: 'cono_sur', label: 'Cono Sur', difficulty: 55, size: 55, adjacency: ['es', 'mx'] },
  { id: 'us_latin', label: 'EE.UU. Latino', difficulty: 60, size: 90, adjacency: ['global', 'mx'] },
  { id: 'global', label: 'Mercado global', difficulty: 80, size: 100, adjacency: [] },
])

const HOME_MARKET_BY_COUNTRY: Record<string, string> = {
  'Puerto Rico': 'pr',
  Colombia: 'co',
  'República Dominicana': 'do',
  Panamá: 'pa',
  Venezuela: 've',
  México: 'mx',
  España: 'es',
  Argentina: 'cono_sur',
  Chile: 'cono_sur',
  'Estados Unidos': 'us_latin',
}

/** Maps a starting country to its home market id; falls back to the US Latin market. */
export function homeMarketId(country: string): string {
  return HOME_MARKET_BY_COUNTRY[country] ?? 'us_latin'
}

/** Every market, with the artist's home market unlocked and lightly penetrated. */
export function initialMarkets(country: string): MarketState[] {
  const home = homeMarketId(country)
  return MARKETS.all.map((m) => ({
    id: m.id,
    penetration: m.id === home ? 15 : 0,
    saturation: 0,
    unlocked: m.id === home,
  }))
}
