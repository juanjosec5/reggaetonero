<script setup lang="ts">
import { TONE_PILL, type Tone } from '@/components/ui/tones'

withDefaults(defineProps<{ tone?: Tone; dot?: boolean }>(), { tone: 'neutral', dot: false })
</script>

<template>
  <span
    data-pill
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1"
    :class="TONE_PILL[tone]"
  >
    <span v-if="dot" class="h-1.5 w-1.5 rounded-full bg-current" />
    <slot />
  </span>
</template>
