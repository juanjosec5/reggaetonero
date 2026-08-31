<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ value: number; tone?: 'accent' | 'win' | 'loss'; size?: 'sm' | 'xs' }>(),
  { tone: 'accent', size: 'sm' },
)

const pct = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<template>
  <div
    class="overflow-hidden rounded-full bg-surface-2"
    :class="size === 'xs' ? 'h-1' : 'h-1.5'"
  >
    <div
      class="h-full rounded-full transition-[width] duration-500 ease-out"
      :class="{
        'bg-gradient-to-r from-accent-strong to-accent glow-accent': tone === 'accent',
        'bg-lime glow-lime': tone === 'win',
        'bg-loss': tone === 'loss',
      }"
      :style="{ width: pct + '%' }"
    />
  </div>
</template>
