import type { Rng } from '@/engine/rng'
import { weightedPick } from '@/engine/rng'
import type { Genre } from '@/types/career'

export interface ProducerDef {
  id: string
  name: string // fictional
  skill: number // 0-100
  cost: number // annual retainer, same units as finances.cash
  influence: number // 0-100, industry pull
  genreFit: Genre[]
  style: string // Spanish descriptor
}

export const PRODUCERS: ProducerDef[] = [
  { id: 'prod_dj_marea', name: 'DJ Marea', skill: 78, cost: 90, influence: 62, genreFit: ['reggaeton', 'perreo'], style: 'Perreo clásico con bajo sucio' },
  { id: 'prod_el_cocinero', name: 'El Cocinero', skill: 71, cost: 55, influence: 40, genreFit: ['reggaeton', 'urbano'], style: 'Beats de cocina, crudos y rápidos' },
  { id: 'prod_nova', name: 'Nova', skill: 85, cost: 140, influence: 75, genreFit: ['urbano', 'trap'], style: 'Producción limpia lista para radio' },
  { id: 'prod_bajo_mundo', name: 'Bajo Mundo', skill: 66, cost: 45, influence: 30, genreFit: ['trap', 'experimental'], style: '808 oscuros y ambientes densos' },
  { id: 'prod_la_maga', name: 'La Maga', skill: 82, cost: 120, influence: 68, genreFit: ['perreo', 'experimental'], style: 'Texturas raras sobre dembow' },
  { id: 'prod_sonora', name: 'Sonora', skill: 74, cost: 80, influence: 55, genreFit: ['reggaeton', 'urbano', 'perreo'], style: 'Puente entre lo viejo y lo nuevo' },
  { id: 'prod_kilo', name: 'Kilo', skill: 69, cost: 60, influence: 44, genreFit: ['trap', 'urbano'], style: 'Trap melódico pegajoso' },
  { id: 'prod_futuro', name: 'Futuro', skill: 88, cost: 170, influence: 82, genreFit: ['experimental', 'urbano'], style: 'Sonido de vanguardia, caro pero brillante' },
]

const PRODUCER_BY_ID = new Map(PRODUCERS.map((p) => [p.id, p]))

export function getProducer(id: string): ProducerDef {
  const producer = PRODUCER_BY_ID.get(id)
  if (!producer) throw new Error(`Unknown producer: ${id}`)
  return producer
}

/**
 * Weighted pick of a producer, favouring genre fit within the budget ceiling.
 * If nothing fits the budget, returns the cheapest producer rather than a
 * skill-weighted pick that would favour the priciest.
 */
export function pickProducer(rng: Rng, opts: { genre?: Genre; maxCost?: number } = {}): ProducerDef | undefined {
  const affordable = PRODUCERS.filter((p) => opts.maxCost === undefined || p.cost <= opts.maxCost)
  if (affordable.length === 0) return PRODUCERS.reduce((a, b) => (b.cost < a.cost ? b : a))
  return weightedPick(
    affordable,
    (p) => (opts.genre && p.genreFit.includes(opts.genre) ? 3 : 1) + p.skill / 50,
    rng,
  )
}
