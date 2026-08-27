import { describe, expect, it } from 'vitest'

import { attributeBandLabel } from '@/engine/bands'

describe('attributeBandLabel', () => {
  it('maps boundaries to the right band', () => {
    expect(attributeBandLabel(1)).toBe('Natural')
    expect(attributeBandLabel(39)).toBe('Natural')
    expect(attributeBandLabel(40)).toBe('Promising')
    expect(attributeBandLabel(59)).toBe('Promising')
    expect(attributeBandLabel(60)).toBe('Strong')
    expect(attributeBandLabel(74)).toBe('Strong')
    expect(attributeBandLabel(75)).toBe('Elite')
    expect(attributeBandLabel(89)).toBe('Elite')
    expect(attributeBandLabel(90)).toBe('Exceptional')
    expect(attributeBandLabel(100)).toBe('Exceptional')
  })
})
