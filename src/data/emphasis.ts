import type { ArtistAttributes } from '@/types/career'

export type EmphasisId = 'studio' | 'stage' | 'business'

export interface EmphasisDefinition {
  id: EmphasisId
  title: string // Spanish
  description: string // Spanish
  attributeBias: Partial<ArtistAttributes>
}

export const EMPHASES: EmphasisDefinition[] = [
  {
    id: 'studio',
    title: 'El estudio es tu segunda casa',
    description: 'Pasas horas perfeccionando cada detalle de una canción antes de mostrarla.',
    attributeBias: { productionSense: 10, writing: 5 },
  },
  {
    id: 'stage',
    title: 'Naciste para la tarima',
    description: 'Nada se compara con la energía de tocar en vivo frente a la gente.',
    attributeBias: { performance: 10, charisma: 5 },
  },
  {
    id: 'business',
    title: 'Piensas en el negocio desde ya',
    description: 'Sabes que una carrera se construye también con contratos inteligentes.',
    attributeBias: { business: 10, originality: -3 },
  },
]

export function getEmphasis(id: EmphasisId): EmphasisDefinition {
  const emphasis = EMPHASES.find((e) => e.id === id)
  if (!emphasis) throw new Error(`Unknown emphasis: ${id}`)
  return emphasis
}
