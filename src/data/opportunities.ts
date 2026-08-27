import type { CareerStats, HiddenTraits, VisibleRisk } from '@/types/career'

export type OpportunityId = 'free_studio' | 'first_stage' | 'diy_release'

export interface OpportunityDefinition {
  id: OpportunityId
  title: string // Spanish
  description: string // Spanish
  visibleRisk: VisibleRisk
  statBias: Partial<CareerStats>
  traitBias?: Partial<HiddenTraits>
}

export const OPPORTUNITIES: OpportunityDefinition[] = [
  {
    id: 'free_studio',
    title: 'Un productor del barrio te da estudio gratis',
    description: 'A cambio, tienes que grabar rápido y sin muchas segundas oportunidades.',
    visibleRisk: 'low',
    statBias: { catalogStrength: 8 },
    traitBias: { loyalty: 5 },
  },
  {
    id: 'first_stage',
    title: 'Un promotor te consigue tu primera tarima',
    description: 'Es un show pequeño, pero es tu oportunidad de mostrarte en vivo.',
    visibleRisk: 'medium',
    statBias: { livePower: 8, fame: 4 },
    traitBias: { riskTolerance: 5 },
  },
  {
    id: 'diy_release',
    title: 'Subes tu primera canción por tu cuenta',
    description: 'Nadie te ayuda, pero nadie te dice qué hacer tampoco.',
    visibleRisk: 'low',
    statBias: { hype: 5 },
    traitBias: { authenticity: 8, resilience: 5 },
  },
]

export function getOpportunity(id: OpportunityId): OpportunityDefinition {
  const opportunity = OPPORTUNITIES.find((o) => o.id === id)
  if (!opportunity) throw new Error(`Unknown opportunity: ${id}`)
  return opportunity
}
