import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import CareerTable from '@/components/CareerTable.vue'
import { simulateYear } from '@/engine/careerEngine'
import { MAX_CAREER_YEAR } from '@/engine/constants'
import { createCareer } from '@/engine/createCareer'
import { makeRng } from '@/engine/rng'

function playedCareer(years: number) {
  const rng = makeRng(42)
  let c = createCareer({ profile: { stageName: 'MC Test', country: 'Colombia' }, seed: 42 })
  for (let i = 0; i < years; i++) c = simulateYear(c, rng)
  return c
}

describe('CareerTable', () => {
  it('renders one row per career year (age 22 → 35), with the current year flagged', () => {
    const career = playedCareer(5) // age 27
    const wrapper = mount(CareerTable, { props: { career } })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(MAX_CAREER_YEAR) // 14 rows, ages 22-35

    expect(rows[0]!.text()).toContain('22')
    expect(rows[13]!.text()).toContain('35')
    expect(wrapper.text()).toContain('ahora')

    // Year 6 onward is unplayed -> placeholders.
    expect(rows[6]!.text()).toContain('—')
  })

  it('shows the home city for played years before the artist moves', () => {
    const wrapper = mount(CareerTable, { props: { career: playedCareer(3) } })
    expect(wrapper.text()).toContain('Medellín')
  })
})
