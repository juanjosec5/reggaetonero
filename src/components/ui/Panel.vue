<script setup lang="ts">
/**
 * Glass card — the app's canonical surface. Single root element (the FLIP
 * transition in CareerView measures `DecisionCard`'s `$el`, which resolves
 * through this). Never sets `overflow-hidden` — CareerTable scrolls inside one.
 */
withDefaults(
  defineProps<{
    as?: string
    pad?: 'md' | 'lg' | 'none'
    /** eyebrow heading rendered above the slot (or use the `heading` slot) */
    heading?: string
    /** magenta edge + bloom — for the one card that should pull focus */
    glow?: boolean
  }>(),
  { as: 'section', pad: 'md', glow: false, heading: undefined },
)
</script>

<template>
  <component
    :is="as"
    class="rounded-panel bg-surface ring-1 backdrop-blur-sm"
    :class="[
      glow ? 'ring-accent/40 glow-accent' : 'ring-hairline',
      { 'p-4': pad === 'md', 'p-5': pad === 'lg' },
    ]"
  >
    <p v-if="heading || $slots.heading" class="eyebrow mb-3">
      <slot name="heading">{{ heading }}</slot>
    </p>
    <slot />
  </component>
</template>
