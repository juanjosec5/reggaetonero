import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import CareerTable from '@/components/CareerTable.vue'
import { getEventById } from '@/data/events'
import { simulateYear } from '@/engine/careerEngine'
import { MAX_CAREER_YEAR } from '@/engine/constants'
import { createCareer } from '@/engine/createCareer'
import { applyChoice } from '@/engine/decisionEngine'
import { makeRng } from '@/engine/rng'

/** Plays `years` years, resolving each year's event so the rows count as done. */
function playedCareer(years: number) {
  const rng = makeRng(42)
  let c = createCareer({ profile: { stageName: 'MC Test', country: 'Colombia' }, seed: 42 })
  for (let i = 0; i < years; i++) {
    c = simulateYear(c, rng)
    const eventId = c.history.at(-1)?.eventId
    const event = eventId ? getEventById(eventId) : undefined
    if (event?.choices.length) c = applyChoice(c, event, event.choices[0]!, rng)
  }
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

  it('fills the age-22 first row once year 1 is decided (no off-by-one gap)', () => {
    const wrapper = mount(CareerTable, { props: { career: playedCareer(1) } })
    const row0 = wrapper.findAll('tbody tr')[0]!
    expect(row0.text()).toContain('22')
    expect(row0.text()).not.toContain('—') // played, not a placeholder
    expect(row0.text()).toContain('ahora')
  })

  it('leaves the first row blank until the year-1 decision is made', () => {
    const rng = makeRng(42)
    let c = createCareer({ profile: { stageName: 'MC Test', country: 'Colombia' }, seed: 42 })
    c = simulateYear(c, rng) // year 1 simulated, decision still pending
    expect(c.history.at(-1)?.eventId).toBeTruthy() // this seed rolls an event
    const row0 = mount(CareerTable, { props: { career: c } }).findAll('tbody tr')[0]!
    expect(row0.text()).toContain('22')
    expect(row0.text()).toContain('ahora') // it's the current year
    expect(row0.text()).toContain('—') // ...but nothing filled in yet
  })
})
