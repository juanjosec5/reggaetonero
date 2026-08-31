import { MARKET_ESTABLISHED_THRESHOLD } from '@/engine/constants'
import type { Career } from '@/types/career'

/**
 * Descriptive header readouts for the play screen - narrative bands, never raw
 * stats (see plan.md section 0). The exact figures are kept on the career object
 * and shown only on the end-of-career summary via `formatMoney`.
 */

/** Exact currency figure - end screen only. */
export function formatMoney(amount: number): string {
  return `$${Math.max(0, Math.round(amount)).toLocaleString('en-US')}`
}

const MONEY_BANDS: [max: number, label: string][] = [
  [2300, '$'],
  [4800, '$$'],
  [7500, '$$$'],
  [Infinity, '$$$$'],
]

/** Wealth tier from net worth - what the play-screen header shows. */
export function moneyBand(netWorth: number): string {
  return MONEY_BANDS.find(([max]) => netWorth < max)![1]
}

const RECOGNITION_BANDS: [max: number, label: string][] = [
  [8, 'Desconocido'],
  [22, 'Suena en el barrio'],
  [40, 'Nombre conocido'],
  [60, 'Cara conocida'],
  [80, 'Estrella'],
  [Infinity, 'Superestrella'],
]

export function recognitionBand(career: Career): string {
  const score = career.stats.fame * 0.8 + career.stats.fanbase * 0.2
  return RECOGNITION_BANDS.find(([max]) => score < max)![1]
}

export function establishedMarketCount(career: Career): number {
  return career.markets.filter((m) => m.unlocked && m.penetration >= MARKET_ESTABLISHED_THRESHOLD).length
}

export function globalStatusBand(career: Career): string {
  const reach = career.stats.internationalReach
  const established = establishedMarketCount(career)
  if (reach < 8 && established <= 1) return 'Artista local'
  if (reach < 25) return 'Presencia regional'
  if (reach < 50) return 'Alcance continental'
  return 'Fenómeno global'
}
