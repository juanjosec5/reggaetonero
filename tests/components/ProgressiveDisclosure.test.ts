import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import CareerView from '@/views/CareerView.vue'
import { createCareer } from '@/engine/createCareer'
import { hireTeamMember } from '@/engine/teamEngine'
import { makeRng } from '@/engine/rng'
import { useCareerStore } from '@/stores/career'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/career', component: CareerView },
    { path: '/history', component: { template: '<div />' } },
  ],
})

function freshCareer() {
  return createCareer({ profile: { stageName: 'MC Test', country: 'México' }, seed: 7 })
}

async function mountCareer() {
  await router.push('/career')
  await router.isReady()
  return mount(CareerView, { global: { plugins: [router] } })
}

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

describe('progressive disclosure of the side panels', () => {
  it('a brand-new career shows none of the team / markets / rivals panels', async () => {
    useCareerStore().career = freshCareer()
    const wrapper = await mountCareer()
    expect(wrapper.text()).not.toContain('Equipo')
    expect(wrapper.text()).not.toContain('Mercados')
    expect(wrapper.text()).not.toContain('Rivales')
    expect(wrapper.text()).not.toContain('Vacante')
  })

  it('the team panel appears only after a hire, and lists only filled roles', async () => {
    const career = freshCareer()
    career.finances.cash = 500
    hireTeamMember(career, 'manager', makeRng(1), 'mgr_la_jefa')
    useCareerStore().career = career

    const wrapper = await mountCareer()
    expect(wrapper.text()).toContain('Equipo')
    expect(wrapper.text()).toContain('Mánager')
    expect(wrapper.text()).not.toContain('Productor') // unfilled role stays hidden
    expect(wrapper.text()).not.toContain('Vacante')
  })

  it('the rivals panel appears only for discovered rivals', async () => {
    const career = freshCareer()
    career.rivals[0]!.discovered = true
    useCareerStore().career = career

    const wrapper = await mountCareer()
    expect(wrapper.text()).toContain('Rivales')
    expect(wrapper.text()).toContain(career.rivals[0]!.name)
    expect(wrapper.text()).not.toContain(career.rivals[1]!.name)
  })

  it('the markets panel appears only after a second market is unlocked', async () => {
    const career = freshCareer()
    career.markets.find((m) => m.id === 'us_latin')!.unlocked = true
    career.markets.find((m) => m.id === 'us_latin')!.penetration = 10
    useCareerStore().career = career

    const wrapper = await mountCareer()
    expect(wrapper.text()).toContain('Mercados')
  })
})
