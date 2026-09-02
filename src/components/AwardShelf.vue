<script setup lang="ts">
import { computed } from 'vue'

import StatusPill from '@/components/ui/StatusPill.vue'
import { AWARD_ICON, AWARD_IMAGE } from '@/data/awards'
import type { CareerAward } from '@/types/career'

const props = defineProps<{ awards: CareerAward[] }>()

// One pill per distinct award title, with a count.
const shelf = computed(() => {
  const map = new Map<
    string,
    { icon: string; image?: string; title: string; count: number; grand: boolean }
  >()
  for (const a of props.awards) {
    const g = map.get(a.title) ?? {
      icon: AWARD_ICON[a.kind],
      image: AWARD_IMAGE[a.kind],
      title: a.title,
      count: 0,
      grand: Boolean(a.grand),
    }
    g.count += 1
    map.set(a.title, g)
  }
  return [...map.values()]
})
</script>

<template>
  <section v-if="shelf.length" class="flex flex-wrap gap-2">
    <StatusPill v-for="item in shelf" :key="item.title" :tone="item.grand ? 'accent' : 'neutral'">
      <img
        v-if="item.image"
        :src="item.image"
        alt=""
        class="h-4 w-4 shrink-0 object-contain"
      />
      <span v-else class="text-sm leading-none">{{ item.icon }}</span>
      <span>{{ item.title }}</span>
      <span v-if="item.count > 1" class="opacity-70">×{{ item.count }}</span>
    </StatusPill>
  </section>
</template>
