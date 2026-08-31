<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ value: number; size?: 'sm' | 'lg' }>(), { size: 'sm' })

// Fill % for each of the 5 stars.
const fills = computed(() =>
  Array.from({ length: 5 }, (_, i) => Math.max(0, Math.min(1, props.value - i)) * 100),
)

const sizeClass = computed(() => (props.size === 'lg' ? 'text-2xl' : 'text-[10px]'))
</script>

<template>
  <span class="inline-flex gap-px" :aria-label="`${value} de 5 estrellas`">
    <span
      v-for="(fill, i) in fills"
      :key="i"
      class="relative leading-none text-neutral-700"
      :class="sizeClass"
    >
      ★
      <span class="absolute inset-0 overflow-hidden text-amber-400" :style="{ width: `${fill}%` }">★</span>
    </span>
  </span>
</template>
