import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import CareerEraTable from '@/components/CareerEraTable.vue'
import { simulateYear } from '@/engine/careerEngine'
import { createCareer } from '@/engine/createCareer'
import { makeRng } from '@/engine/rng'

function playedCareer(years: number) {
  const rng = makeRng(42)
  let c = createCareer({ profile: { stageName: 'MC Test', country: 'Colombia' }, seed: 42 })
  for (let i = 0; i < years; i++) c = simulateYear(c, rng)
  return c
}

describe('CareerEraTable', () => {
  it('renders one row per era with the current era flagged and future eras blank', () => {
    const career = playedCareer(6) // age 26 -> era "ascenso"
    const wrapper = mount(CareerEraTable, { props: { career } })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(5)

    expect(wrapper.text()).toContain('20–23')
    expect(wrapper.text()).toContain('36–40')
    expect(wrapper.text()).toContain('ahora') // the current era badge

    // The last (unreached) era shows placeholders.
    expect(rows[4]!.text()).toContain('—')
  })

  it('shows the home city in the first era before the artist moves', () => {
    const wrapper = mount(CareerEraTable, { props: { career: playedCareer(3) } })
    expect(wrapper.text()).toContain('Medellín')
  })
})
