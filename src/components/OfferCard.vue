<script setup lang="ts">
import RiskBadge from '@/components/RiskBadge.vue'
import type { VisibleRisk } from '@/types/career'

defineProps<{
  title: string
  description: string
  risk: VisibleRisk
  selected?: boolean
}>()

const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <button
    type="button"
    class="flex w-full flex-col gap-2 rounded-2xl px-4 py-4 text-left ring-1 transition active:scale-[0.98]"
    :class="
      selected
        ? 'bg-fuchsia-500/10 ring-fuchsia-500'
        : 'bg-neutral-900 ring-white/10 hover:ring-white/20'
    "
    @click="emit('select')"
  >
    <div class="flex items-start justify-between gap-3">
      <h3 class="text-base font-semibold text-neutral-50">{{ title }}</h3>
      <RiskBadge :risk="risk" />
    </div>
    <p class="text-sm leading-relaxed text-neutral-400">{{ description }}</p>
  </button>
</template>
