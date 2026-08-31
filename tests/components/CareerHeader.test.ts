import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import CareerHeader from '@/components/CareerHeader.vue'
import { simulateYear } from '@/engine/careerEngine'
import { createCareer } from '@/engine/createCareer'
import { makeRng } from '@/engine/rng'

function playedCareer(years: number) {
  const rng = makeRng(42)
  let c = createCareer({ profile: { stageName: 'MC Test', country: 'Colombia' }, seed: 42 })
  for (let i = 0; i < years; i++) c = simulateYear(c, rng)
  return c
}

describe('CareerHeader', () => {
  it('features the star rating, a tier word, location and all band readouts', () => {
    const career = playedCareer(6)
    const wrapper = mount(CareerHeader, { props: { career } })

    // the hero star rating
    expect(wrapper.findComponent({ name: 'StarRating' }).exists()).toBe(true)
    expect(wrapper.find('[aria-label$="de 5 estrellas"]').exists()).toBe(true)

    const text = wrapper.text()
    // a tier word from starTierLabel
    expect(text).toMatch(/Empezando|Sonando|En subida|En la cima|Cabeza de cartel|Leyenda/)
    // location readout
    expect(text).toContain('Ubicación')
    expect(text).toContain(career.residence)
    // original readouts still present
    for (const label of ['Dinero', 'Reconocimiento', 'Estatus global', 'Título']) {
      expect(text).toContain(label)
    }
    expect(text).toContain(career.artist.stageName)
  })

  it('renders the large star size in the header', () => {
    const wrapper = mount(CareerHeader, { props: { career: playedCareer(3) } })
    expect(wrapper.find('.text-2xl').exists()).toBe(true) // StarRating size="lg"
  })
})
