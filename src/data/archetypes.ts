import type { ArtistArchetype, ArtistAttributes, HiddenTraits } from '@/types/career'

export interface ArchetypeDefinition {
  id: ArtistArchetype
  label: string // Spanish
  description: string // Spanish
  attributeBias: Partial<ArtistAttributes>
  traitBias: Partial<HiddenTraits>
}

export const ARCHETYPES: ArchetypeDefinition[] = [
  {
    id: 'hitmaker',
    label: 'El Hitmaker',
    description: 'Nace para el estribillo que no se te quita de la cabeza.',
    attributeBias: { productionSense: 15, charisma: 10, business: 8, originality: -5 },
    traitBias: { ambition: 15, riskTolerance: 5 },
  },
  {
    id: 'perreo_king',
    label: 'El Rey del Perreo',
    description: 'Vive para el ritmo y para que la pista no pare.',
    attributeBias: { performance: 15, charisma: 12, originality: 5, writing: -5 },
    traitBias: { authenticity: 10, ego: 10 },
  },
  {
    id: 'lyricist',
    label: 'El Lírico',
    description: 'Cada barra cuenta una historia que nadie más está contando.',
    attributeBias: { writing: 18, originality: 10, charisma: -5 },
    traitBias: { patience: 10, authenticity: 15 },
  },
  {
    id: 'feature_artist',
    label: 'El Artista de Features',
    description: 'Sabe entrar en cualquier canción y hacerla suya.',
    attributeBias: { voice: 10, charisma: 12, business: 8, originality: -5 },
    traitBias: { adaptability: 15, loyalty: 5 },
  },
  {
    id: 'experimental',
    label: 'El Experimental',
    description: 'Rompe fórmulas incluso cuando el mercado no se lo pide.',
    attributeBias: { originality: 18, productionSense: 10, business: -8 },
    traitBias: { riskTolerance: 15, authenticity: 10, ego: 5 },
  },
  {
    id: 'street',
    label: 'El Callejero',
    description: 'Se ganó cada oyente en el barrio antes que en la radio.',
    attributeBias: { talent: 10, performance: 10, business: -5 },
    traitBias: { resilience: 15, loyalty: 10 },
  },
  {
    id: 'performer',
    label: 'El Performer',
    description: 'El escenario es su casa; ahí nunca falla.',
    attributeBias: { performance: 18, charisma: 10, writing: -5 },
    traitBias: { discipline: 10, ambition: 10 },
  },
  {
    id: 'executive',
    label: 'El Ejecutivo',
    description: 'Piensa en catálogo, contratos y negocio desde el día uno.',
    attributeBias: { business: 18, productionSense: 8, originality: -5 },
    traitBias: { ambition: 10, patience: 10, discipline: 5 },
  },
]

export function getArchetype(id: ArtistArchetype): ArchetypeDefinition {
  const archetype = ARCHETYPES.find((a) => a.id === id)
  if (!archetype) throw new Error(`Unknown archetype: ${id}`)
  return archetype
}
