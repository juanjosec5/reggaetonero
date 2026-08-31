<script setup lang="ts">
/**
 * Every button in the app. Single `<button>` root so `@click` / `:disabled`
 * fall through. Keeps `active:scale-[0.98]` — the only tactile affordance on
 * touch.
 */
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'choice'
    block?: boolean
  }>(),
  { variant: 'primary', block: false },
)

const VARIANT: Record<string, string> = {
  primary: 'bg-accent text-accent-ink font-semibold glow-accent hover:brightness-110',
  secondary: 'bg-surface-2 text-ink font-semibold ring-1 ring-hairline hover:ring-hairline-strong',
  ghost: 'text-ink-subtle font-medium hover:text-ink',
  choice:
    'bg-surface text-ink font-medium text-left ring-1 ring-hairline hover:ring-accent/70 hover:bg-accent/[0.06]',
}
</script>

<template>
  <button
    type="button"
    class="rounded-panel px-4 py-3.5 text-sm transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
    :class="[VARIANT[variant], block && 'w-full']"
  >
    <slot />
  </button>
</template>
