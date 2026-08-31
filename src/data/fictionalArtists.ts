import type { Rng } from '@/engine/rng'
import { weightedPick } from '@/engine/rng'
import type { ArtistArchetype, Rival } from '@/types/career'

import { defineCatalog } from './catalog'

export interface RivalDef {
  id: string
  name: string // fictional
  archetype: ArtistArchetype
  baseFame: number // 0-100 at career start
  baseCredibility: number // 0-100
  style: string // Spanish descriptor
}

export const RIVAL_DEFS = defineCatalog<RivalDef>('rival', [
  { id: 'rival_bravo', name: 'Bravo', archetype: 'hitmaker', baseFame: 35, baseCredibility: 20, style: 'Hits de radio uno tras otro' },
  { id: 'rival_la_nena', name: 'La Nena', archetype: 'perreo_king', baseFame: 28, baseCredibility: 30, style: 'Reina de la pista desde el barrio' },
  { id: 'rival_pluma', name: 'Pluma', archetype: 'lyricist', baseFame: 15, baseCredibility: 55, style: 'La pluma más respetada del underground' },
  { id: 'rival_dvln', name: 'DVLN', archetype: 'experimental', baseFame: 18, baseCredibility: 48, style: 'Rompe reglas y divide opiniones' },
  { id: 'rival_toro', name: 'Toro', archetype: 'street', baseFame: 22, baseCredibility: 42, style: 'Calle pura, sin filtro' },
  { id: 'rival_neon', name: 'Neón', archetype: 'performer', baseFame: 30, baseCredibility: 25, style: 'Shows enormes, producción de estadio' },
  { id: 'rival_mvp', name: 'MVP', archetype: 'feature_artist', baseFame: 26, baseCredibility: 33, style: 'Está en el feature de todo el mundo' },
  { id: 'rival_don_e', name: 'Don E', archetype: 'executive', baseFame: 20, baseCredibility: 38, style: 'Mueve más negocio que música' },
  { id: 'rival_sombra', name: 'Sombra', archetype: 'lyricist', baseFame: 24, baseCredibility: 40, style: 'Trap oscuro con culto propio' },
])

function toRival(def: RivalDef): Rival {
  return {
    id: def.id,
    name: def.name,
    archetype: def.archetype,
    fame: def.baseFame,
    credibility: def.baseCredibility,
    style: def.style,
    relationship: 0,
  }
}

/** Picks `count` distinct rivals to seed a new career with. */
export function pickRivals(rng: Rng, count: number): Rival[] {
  const pool = [...RIVAL_DEFS.all]
  const picked: Rival[] = []
  for (let i = 0; i < count && pool.length > 0; i++) {
    const choice = weightedPick(pool, () => 1, rng)
    if (!choice) break
    pool.splice(pool.indexOf(choice), 1)
    picked.push(toRival(choice))
  }
  return picked
}
