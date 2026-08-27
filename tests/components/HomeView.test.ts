import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/create', component: { template: '<div />' } },
    { path: '/career', component: { template: '<div />' } },
  ],
})

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

describe('HomeView', () => {
  it('renders the title', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('REGGAETONERO')
  })
})
