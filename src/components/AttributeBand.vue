<script setup lang="ts">
import { computed } from 'vue'

import { attributeBandLabel } from '@/engine/bands'
import { BAND_THRESHOLDS } from '@/engine/constants'

// `value` is the raw 1-100 attribute - it is used ONLY to compute the band
// and the filled-segment count. It must never be rendered as text.
const props = defineProps<{ label: string; value: number }>()

const BAND_LABELS_ES: Record<string, string> = {
  Natural: 'Natural',
  Promising: 'Prometedor',
  Strong: 'Sólido',
  Elite: 'Elite',
  Exceptional: 'Excepcional',
}

const bandLabelEs = computed(() => BAND_LABELS_ES[attributeBandLabel(props.value)]!)

const filledSegments = computed(() => {
  const thresholds = [BAND_THRESHOLDS.mid, BAND_THRESHOLDS.high, BAND_THRESHOLDS.veryHigh, BAND_THRESHOLDS.top]
  return 1 + thresholds.filter((t) => props.value >= t).length
})
</script>

<template>
  <div class="flex items-center justify-between gap-3 py-1.5">
    <span class="text-sm text-neutral-400">{{ label }}</span>
    <div class="flex items-center gap-2">
      <div class="flex gap-1">
        <span
          v-for="segment in 5"
          :key="segment"
          class="h-2 w-4 rounded-sm"
          :class="segment <= filledSegments ? 'bg-fuchsia-500' : 'bg-neutral-700'"
        />
      </div>
      <span class="w-24 text-right text-sm font-medium text-neutral-200">{{ bandLabelEs }}</span>
    </div>
  </div>
</template>
