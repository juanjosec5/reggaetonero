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
  it('is a single screen with the start button disabled until name + country are set', async () => {
    const wrapper = await mountView()
    expect(wrapper.text()).toContain('¿Quién eres?')
    const startButton = wrapper.findAll('button').find((b) => b.text().includes('Empezar carrera'))!
    expect(startButton.attributes('disabled')).toBeDefined()
  })

  it('starts a career once name and country are chosen', async () => {
    const wrapper = await mountView()
    const store = useCareerStore()

    await wrapper.find('input[type="text"]').setValue('MC Prueba')
    await wrapper.findAll('button').find((b) => b.text().includes('Colombia'))!.trigger('click')
    await wrapper.findAll('button').find((b) => b.text().includes('Empezar carrera'))!.trigger('click')

    expect(store.hasActiveCareer).toBe(true)
    expect(store.career?.artist.stageName).toBe('MC Prueba')
    expect(store.career?.artist.country).toBe('Colombia')
  })

  it('never asks the player for a city, archetype, emphasis or scenario', async () => {
    const wrapper = await mountView()
    const text = wrapper.text()
    expect(text).not.toContain('Ciudad')
    expect(text).not.toContain('tipo de artista')
    expect(text).not.toContain('te quieres enfocar')
    expect(text).not.toContain('primera oportunidad')
  })
})
