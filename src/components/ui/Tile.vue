<script setup lang="ts">
/** Small raised cell — stat tiles, money readouts. */
withDefaults(defineProps<{ as?: string; pad?: 'sm' | 'md' }>(), { as: 'div', pad: 'sm' })
</script>

<template>
  <component
    :is="as"
    class="rounded-tile bg-surface-2 ring-1 ring-hairline"
    :class="pad === 'md' ? 'p-4' : 'p-3'"
  >
    <slot />
  </component>
</template>
