<script setup lang="ts">
import { computed } from 'vue'

import type { VisibleRisk } from '@/types/career'

const props = defineProps<{ risk: VisibleRisk }>()

const LABELS: Record<VisibleRisk, string> = {
  low: 'Riesgo bajo',
  medium: 'Riesgo medio',
  high: 'Riesgo alto',
}

const STYLES: Record<VisibleRisk, string> = {
  low: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  medium: 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
  high: 'bg-rose-500/15 text-rose-400 ring-rose-500/30',
}

const label = computed(() => LABELS[props.risk])
const style = computed(() => STYLES[props.risk])
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1"
    :class="style"
  >
    <span class="h-1.5 w-1.5 rounded-full bg-current" />
    {{ label }}
  </span>
</template>
