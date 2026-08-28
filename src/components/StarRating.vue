<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ value: number }>() // 0-5, half steps

// Fill % for each of the 5 stars.
const fills = computed(() =>
  Array.from({ length: 5 }, (_, i) => Math.max(0, Math.min(1, props.value - i)) * 100),
)
</script>

<template>
  <span class="inline-flex" :aria-label="`${value} de 5 estrellas`">
    <span v-for="(fill, i) in fills" :key="i" class="relative text-[10px] leading-none text-neutral-700">
      ★
      <span class="absolute inset-0 overflow-hidden text-amber-400" :style="{ width: `${fill}%` }">★</span>
    </span>
  </span>
</template>
