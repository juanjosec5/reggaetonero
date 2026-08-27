<script setup lang="ts">
import { computed } from 'vue'

import type { Release } from '@/types/career'

const props = defineProps<{ release: Release }>()

const TIER_LABELS: Record<Release['tier'], string> = {
  flop: 'Flop',
  normal: 'Sencillo',
  good: 'Buena racha',
  hit: 'Hit',
  smash: 'Smash',
}

const TIER_STYLES: Record<Release['tier'], string> = {
  flop: 'bg-neutral-700/50 text-neutral-400',
  normal: 'bg-sky-500/15 text-sky-400',
  good: 'bg-emerald-500/15 text-emerald-400',
  hit: 'bg-amber-500/15 text-amber-400',
  smash: 'bg-fuchsia-500/20 text-fuchsia-400',
}

const label = computed(() => TIER_LABELS[props.release.tier])
const style = computed(() => TIER_STYLES[props.release.tier])
</script>

<template>
  <div class="flex items-center justify-between gap-3 rounded-xl bg-neutral-900 px-4 py-3 ring-1 ring-white/5">
    <span class="text-sm font-medium text-neutral-100">{{ release.title }}</span>
    <span class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="style">{{ label }}</span>
  </div>
</template>
