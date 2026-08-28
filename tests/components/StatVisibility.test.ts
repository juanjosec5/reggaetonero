import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import CareerView from '@/views/CareerView.vue'
import LegacyView from '@/views/LegacyView.vue'
import { retire } from '@/engine/legacyEngine'
import { simulateYear } from '@/engine/careerEngine'
import { createCareer } from '@/engine/createCareer'
import { makeRng } from '@/engine/rng'
import { useCareerStore } from '@/stores/career'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/career', component: CareerView },
    { path: '/legacy', component: LegacyView },
    { path: '/history', component: { template: '<div />' } },
  ],
})

// The full nine-stat panel; "Poder en vivo" and "Impacto cultural" are unique to it.
const STAT_PANEL_MARKERS = ['Poder en vivo', 'Respeto de la industria', 'Impacto cultural']

function seededCareer(years: number) {
  const rng = makeRng(99)
  let career = createCareer({ profile: { stageName: 'MC Test', country: 'Colombia' }, seed: 99 })
  for (let i = 0; i < years; i++) career = simulateYear(career, rng)
  return career
}

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

describe('stat visibility', () => {
  it('CareerView never shows the nine-stat panel during play', async () => {
    const store = useCareerStore()
    store.career = seededCareer(6)

    await router.push('/career')
    await router.isReady()
    const wrapper = mount(CareerView, { global: { plugins: [router] } })

    for (const marker of STAT_PANEL_MARKERS) {
      expect(wrapper.text()).not.toContain(marker)
    }
    // ...but the header readouts are there.
    expect(wrapper.text()).toContain('Reconocimiento')
    expect(wrapper.text()).toContain('Estatus global')
  })

  it('LegacyView reveals the nine-stat panel and the trajectory chart', async () => {
    const store = useCareerStore()
    store.career = retire(seededCareer(10))

    await router.push('/legacy')
    await router.isReady()
    const wrapper = mount(LegacyView, { global: { plugins: [router] } })

    for (const marker of STAT_PANEL_MARKERS) {
      expect(wrapper.text()).toContain(marker)
    }
    expect(wrapper.text()).toContain('Tu trayectoria')
    expect(wrapper.text()).toContain('Cómo llegaste aquí')
  })
})
