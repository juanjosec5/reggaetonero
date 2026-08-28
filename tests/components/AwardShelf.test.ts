import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AwardShelf from '@/components/AwardShelf.vue'
import type { CareerAward } from '@/types/career'

describe('AwardShelf', () => {
  it('renders nothing when there are no awards', () => {
    const wrapper = mount(AwardShelf, { props: { awards: [] } })
    expect(wrapper.find('section').exists()).toBe(false)
  })

  it('groups repeats into one pill with a count', () => {
    const awards: CareerAward[] = [
      { id: 'plat_3_0', kind: 'platinum', title: 'Disco de platino', year: 3 },
      { id: 'plat_5_1', kind: 'platinum', title: 'Disco de platino', year: 5 },
      { id: 'gr_6_2', kind: 'grammy', title: 'Grammy Latino', year: 6 },
    ]
    const wrapper = mount(AwardShelf, { props: { awards } })
    const pills = wrapper.findAll('span.rounded-full')
    expect(pills).toHaveLength(2)
    expect(wrapper.text()).toContain('Disco de platino')
    expect(wrapper.text()).toContain('×2')
    expect(wrapper.text()).toContain('Grammy Latino')
  })
})
