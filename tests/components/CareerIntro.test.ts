import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import CareerView from '@/views/CareerView.vue'
import { useCareerStore } from '@/stores/career'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/career', component: CareerView },
    { path: '/legacy', component: { template: '<div />' } },
  ],
})

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
  // jsdom has no matchMedia; default to "motion allowed"
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }))
})

async function mountCareer() {
  await router.push('/career')
  await router.isReady()
  return mount(CareerView, { global: { plugins: [router] } })
}

describe('first-decision intro', () => {
  it('shows only the decision card, centred, on a fresh year-1 career', async () => {
    const store = useCareerStore()
    store.startCareer({ stageName: 'MC Test', country: 'Colombia' }, 42)
    expect(store.career?.year).toBe(1)
    expect(store.pendingChoice).toBe(true)

    const wrapper = await mountCareer()
    expect(wrapper.text()).toContain('Tu primera decisión')
    expect(wrapper.findComponent({ name: 'DecisionCard' }).exists()).toBe(true)
    // the rest of the screen is not rendered yet
    expect(wrapper.text()).not.toContain('Tu carrera') // CareerTable heading
    expect(wrapper.text()).not.toContain('Avanzar al próximo año')
  })

  it('does not intro a returning career past year 1', async () => {
    const store = useCareerStore()
    store.startCareer({ stageName: 'MC Test', country: 'Colombia' }, 7)
    if (store.currentEvent) store.applyChoice(store.currentEvent.choices[0]!)
    store.advanceYear()

    const wrapper = await mountCareer()
    expect(wrapper.text()).not.toContain('Tu primera decisión')
    expect(wrapper.text()).toContain('Tu carrera')
  })
})
