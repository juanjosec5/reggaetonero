import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DecisionCard from '@/components/DecisionCard.vue'
import type { CareerEvent } from '@/types/career'

const event: CareerEvent = {
  id: 'test_event',
  category: 'music',
  title: 'Un sello grande te ofrece contrato',
  description: 'Descripción de prueba.',
  visibleRisk: 'high',
  condition: () => true,
  weight: () => 1,
  choices: [
    { text: 'Firmar', style: 'commercial', effects: [] },
    { text: 'Negociar', style: 'ambitious', effects: [] },
    { text: 'Seguir independiente', style: 'safe', effects: [] },
  ],
}

describe('DecisionCard', () => {
  it('renders the title, description, risk badge, and every choice', () => {
    const wrapper = mount(DecisionCard, { props: { event } })
    expect(wrapper.text()).toContain('Un sello grande te ofrece contrato')
    expect(wrapper.text()).toContain('Descripción de prueba.')
    expect(wrapper.text()).toContain('Riesgo alto')
    expect(wrapper.text()).toContain('Firmar')
    expect(wrapper.text()).toContain('Negociar')
    expect(wrapper.text()).toContain('Seguir independiente')
  })

  it('never renders raw numbers from choice effects', () => {
    const wrapper = mount(DecisionCard, { props: { event } })
    expect(wrapper.text()).not.toMatch(/-?\d+/)
  })

  it('emits "choose" with the selected choice when a button is clicked', async () => {
    const wrapper = mount(DecisionCard, { props: { event } })
    const buttons = wrapper.findAll('button')
    await buttons[1]!.trigger('click')

    expect(wrapper.emitted('choose')).toHaveLength(1)
    expect(wrapper.emitted('choose')?.[0]?.[0]).toEqual(event.choices[1])
  })
})
