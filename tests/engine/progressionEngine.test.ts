import { describe, expect, it } from 'vitest'

import { computeEra } from '@/engine/progressionEngine'

describe('computeEra', () => {
  it('maps career years to eras (year N ⇒ age 21 + N; career runs 22 → 35)', () => {
    expect(computeEra(1)).toBe('debut') // age 22
    expect(computeEra(3)).toBe('debut') // 24
    expect(computeEra(4)).toBe('ascenso') // 25
    expect(computeEra(6)).toBe('ascenso') // 27
    expect(computeEra(7)).toBe('cima') // 28
    expect(computeEra(9)).toBe('cima') // 30
    expect(computeEra(10)).toBe('veterano') // 31
    expect(computeEra(12)).toBe('veterano') // 33
    expect(computeEra(13)).toBe('leyenda') // 34
    expect(computeEra(14)).toBe('leyenda') // 35
  })
})
