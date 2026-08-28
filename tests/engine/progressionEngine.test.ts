import { describe, expect, it } from 'vitest'

import { computeEra } from '@/engine/progressionEngine'

describe('computeEra', () => {
  it('maps each 4-year age bucket to one era', () => {
    // year N ⇒ age 19 + N
    expect(computeEra(1)).toBe('debut') // age 20
    expect(computeEra(4)).toBe('debut') // 23
    expect(computeEra(5)).toBe('ascenso') // 24
    expect(computeEra(8)).toBe('ascenso') // 27
    expect(computeEra(9)).toBe('cima') // 28
    expect(computeEra(12)).toBe('cima') // 31
    expect(computeEra(13)).toBe('veterano') // 32
    expect(computeEra(16)).toBe('veterano') // 35
    expect(computeEra(17)).toBe('leyenda') // 36
    expect(computeEra(21)).toBe('leyenda') // 40
  })
})
