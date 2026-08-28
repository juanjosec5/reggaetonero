export interface LabelDef {
  id: string
  name: string // fictional
  /** How much international push the label brings (0-100). */
  reach: number
  /** Prestige / industry standing (0-100). */
  prestige: number
  /** Up-front advance range, same units as finances.cash. */
  advanceMin: number
  advanceMax: number
  /** Ownership percentage the label takes of the artist's masters. */
  ownershipDemandMin: number
  ownershipDemandMax: number
}

export const LABELS: LabelDef[] = [
  { id: 'label_barrio', name: 'Barrio Records', reach: 30, prestige: 35, advanceMin: 20, advanceMax: 60, ownershipDemandMin: 8, ownershipDemandMax: 18 },
  { id: 'label_costa', name: 'Costa Norte', reach: 50, prestige: 55, advanceMin: 50, advanceMax: 120, ownershipDemandMin: 15, ownershipDemandMax: 30 },
  { id: 'label_capital', name: 'Capital Latina', reach: 78, prestige: 72, advanceMin: 90, advanceMax: 200, ownershipDemandMin: 25, ownershipDemandMax: 45 },
  { id: 'label_continental', name: 'Continental Music Group', reach: 95, prestige: 88, advanceMin: 150, advanceMax: 320, ownershipDemandMin: 35, ownershipDemandMax: 55 },
  { id: 'label_luz', name: 'Luz Independiente', reach: 40, prestige: 60, advanceMin: 15, advanceMax: 45, ownershipDemandMin: 5, ownershipDemandMax: 12 },
  { id: 'label_norte_sur', name: 'Norte/Sur', reach: 62, prestige: 50, advanceMin: 60, advanceMax: 140, ownershipDemandMin: 18, ownershipDemandMax: 35 },
]

const LABEL_BY_ID = new Map(LABELS.map((l) => [l.id, l]))

export function getLabel(id: string): LabelDef {
  const label = LABEL_BY_ID.get(id)
  if (!label) throw new Error(`Unknown label: ${id}`)
  return label
}
