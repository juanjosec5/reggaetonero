import { describe, expect, it } from 'vitest'

import { createCareer } from '@/engine/createCareer'
import { formatMoney, globalStatusBand, moneyBand, recognitionBand } from '@/engine/status'

function baseCareer() {
  return createCareer({ profile: { stageName: 'X', country: 'Colombia' }, seed: 1 })
}

describe('formatMoney', () => {
  it('renders an exact figure with thousands separators', () => {
    expect(formatMoney(0)).toBe('$0')
    expect(formatMoney(540)).toBe('$540')
    expect(formatMoney(2400)).toBe('$2,400')
    expect(formatMoney(1_240_000)).toBe('$1,240,000')
  })

  it('clamps negatives to zero and rounds', () => {
    expect(formatMoney(-50)).toBe('$0')
    expect(formatMoney(12.7)).toBe('$13')
  })
})

describe('moneyBand', () => {
  it('maps net worth to a $ tier', () => {
    expect(moneyBand(500)).toBe('$')
    expect(moneyBand(1200)).toBe('$$')
    expect(moneyBand(2500)).toBe('$$$')
    expect(moneyBand(9000)).toBe('$$$$')
  })
})

describe('recognitionBand', () => {
  it('moves up as fame grows', () => {
    const career = baseCareer()
    career.stats.fame = 0
    expect(recognitionBand(career)).toBe('Desconocido')
    career.stats.fame = 50
    career.stats.fanbase = 50
    expect(recognitionBand(career)).toBe('Cara conocida')
    career.stats.fame = 95
    career.stats.fanbase = 95
    expect(recognitionBand(career)).toBe('Superestrella')
  })
})

describe('globalStatusBand', () => {
  it('starts local and climbs with international reach', () => {
    const career = baseCareer()
    career.stats.internationalReach = 0
    expect(globalStatusBand(career)).toBe('Artista local')
    career.stats.internationalReach = 30
    expect(globalStatusBand(career)).toBe('Alcance continental')
    career.stats.internationalReach = 70
    expect(globalStatusBand(career)).toBe('Fenómeno global')
  })
})
