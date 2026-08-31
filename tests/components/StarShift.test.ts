import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import StarShift from '@/components/StarShift.vue'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

/** Mount and let `onMounted` flip `show` on so the overlay renders. */
async function open(props: { dir: 'up' | 'down'; tier: number }) {
  const wrapper = mount(StarShift, { props, attachTo: document.body })
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()
  return wrapper
}

describe('StarShift', () => {
  it('renders five star glyphs under the level label', async () => {
    const wrapper = await open({ dir: 'up', tier: 3 })
    expect(wrapper.findAll('span.star')).toHaveLength(5)
    expect(wrapper.findAll('span.star.text-star')).toHaveLength(3) // tier 3 filled
    expect(wrapper.text().replace(/★/g, '').trim()).toBe('Nivel de reggaetonero')
    wrapper.unmount()
  })

  it('marks the earned star on a gain and the lost star on a loss', async () => {
    const up = await open({ dir: 'up', tier: 4 })
    expect(up.findAll('span.star')[3]!.classes()).toContain('star-gain')
    up.unmount()

    const down = await open({ dir: 'down', tier: 2 })
    expect(down.findAll('span.star')[2]!.classes()).toContain('star-lose')
    down.unmount()
  })

  it('hides itself after the hold, which drives the done emit on leave', async () => {
    const wrapper = await open({ dir: 'up', tier: 2 })
    expect(wrapper.find('.shift-card').exists()).toBe(true)

    vi.advanceTimersByTime(2200) // the onMounted hold
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    // `show` has flipped off; the overlay is leaving. `@after-leave` → emit('done')
    // fires once the (CSS) leave transition ends — exercised end-to-end in CareerView.
    expect(wrapper.find('.shift-card').exists()).toBe(false)
    wrapper.unmount()
  })
})
