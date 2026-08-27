import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import CreateArtistView from '@/views/CreateArtistView.vue'
import { useCareerStore } from '@/stores/career'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/create', component: CreateArtistView },
    { path: '/career', component: { template: '<div />' } },
  ],
})

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

async function mountView() {
  await router.push('/create')
  await router.isReady()
  return mount(CreateArtistView, { global: { plugins: [router] } })
}

describe('CreateArtistView', () => {
  it('starts on the identity step with the continue button disabled', async () => {
    const wrapper = await mountView()
    expect(wrapper.text()).toContain('¿Quién eres?')
    const continueButton = wrapper.find('button[disabled]')
    expect(continueButton.exists()).toBe(true)
  })

  it('walks through every step and starts a career in the store', async () => {
    const wrapper = await mountView()
    const store = useCareerStore()

    // Step 1: identity
    await wrapper.find('input[type="text"]').setValue('MC Prueba')
    await wrapper.findAll('button').find((b) => b.text().includes('Continuar'))!.trigger('click')
    expect(wrapper.text()).toContain('¿Qué tipo de artista eres?')

    // Step 2: archetype - pick the first card
    await wrapper.findAll('button').find((b) => !b.attributes('disabled') && !b.text().includes('Continuar') && !b.text().includes('Atrás'))!.trigger('click')
    await wrapper.findAll('button').find((b) => b.text().includes('Continuar'))!.trigger('click')
    expect(wrapper.text()).toContain('¿En qué te quieres enfocar?')

    // Step 3: emphasis - pick the first card
    await wrapper.findAll('button').find((b) => !b.attributes('disabled') && !b.text().includes('Continuar') && !b.text().includes('Atrás'))!.trigger('click')
    await wrapper.findAll('button').find((b) => b.text().includes('Continuar'))!.trigger('click')
    expect(wrapper.text()).toContain('Tu primera oportunidad')

    // Step 4: opportunity - pick the first offer card
    await wrapper.findAll('button').find((b) => !b.attributes('disabled') && !b.text().includes('Continuar') && !b.text().includes('Atrás'))!.trigger('click')
    await wrapper.findAll('button').find((b) => b.text().includes('Empezar carrera'))!.trigger('click')

    expect(store.hasActiveCareer).toBe(true)
    expect(store.career?.artist.stageName).toBe('MC Prueba')
  })
})
