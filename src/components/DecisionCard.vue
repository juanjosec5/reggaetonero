<script setup lang="ts">
import RiskBadge from '@/components/RiskBadge.vue'
import type { CareerChoice, CareerEvent } from '@/types/career'

defineProps<{ event: CareerEvent; resolved?: boolean; choiceTaken?: string }>()
const emit = defineEmits<{ choose: [choice: CareerChoice] }>()
</script>

<template>
  <div class="flex w-full flex-col gap-5 rounded-2xl bg-neutral-900/60 p-4 ring-1 ring-white/5">
    <div class="flex items-start justify-between gap-3">
      <h2 class="text-xl font-semibold text-neutral-50">{{ event.title }}</h2>
      <RiskBadge :risk="event.visibleRisk" />
    </div>

    <p class="text-sm leading-relaxed text-neutral-300">{{ event.description }}</p>

    <div v-if="resolved" class="rounded-xl bg-neutral-800/60 px-3 py-2">
      <p class="text-xs font-medium text-fuchsia-400">→ {{ choiceTaken }}</p>
    </div>

    <div v-else class="flex flex-col gap-3">
      <button
        v-for="choice in event.choices"
        :key="choice.text"
        type="button"
        class="w-full rounded-2xl bg-neutral-800 px-4 py-3.5 text-left text-sm font-medium text-neutral-100 transition active:scale-[0.98] active:bg-neutral-700"
        @click="emit('choose', choice)"
      >
        {{ choice.text }}
      </button>
    </div>
  </div>
</template>
