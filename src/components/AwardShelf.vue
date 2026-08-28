<script setup lang="ts">
import { computed } from 'vue'

import { AWARD_ICON } from '@/data/awards'
import type { CareerAward } from '@/types/career'

const props = defineProps<{ awards: CareerAward[] }>()

// One pill per distinct award title, with a count.
const shelf = computed(() => {
  const map = new Map<string, { icon: string; title: string; count: number; grand: boolean }>()
  for (const a of props.awards) {
    const g = map.get(a.title) ?? { icon: AWARD_ICON[a.kind], title: a.title, count: 0, grand: Boolean(a.grand) }
    g.count += 1
    map.set(a.title, g)
  }
  return [...map.values()]
})
</script>

<template>
  <section v-if="shelf.length" class="flex flex-wrap gap-2">
    <span
      v-for="item in shelf"
      :key="item.title"
      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ring-1"
      :class="
        item.grand
          ? 'bg-amber-400/10 text-amber-200 ring-amber-400/30'
          : 'bg-neutral-800/70 text-neutral-300 ring-white/10'
      "
    >
      <span class="text-sm leading-none">{{ item.icon }}</span>
      <span>{{ item.title }}</span>
      <span v-if="item.count > 1" class="font-semibold text-neutral-400">×{{ item.count }}</span>
    </span>
  </section>
</template>
