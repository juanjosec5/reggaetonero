<script setup lang="ts">
import { computed } from 'vue'

import ReleaseCard from '@/components/ReleaseCard.vue'
import { getEventById } from '@/data/events'
import type { CareerYear, Era } from '@/types/career'

const props = defineProps<{ history: CareerYear[] }>()

const ERA_LABELS: Record<Era, string> = {
  underground: 'Underground',
  first_buzz: 'Primer Buzz',
  breakout: 'Despegue',
  national: 'Nacional',
  international: 'Internacional',
  superstar: 'Superestrella',
  reinvention: 'Reinvención',
  legacy: 'Legado',
}

const years = computed(() => [...props.history].reverse())

function eventTitle(eventId?: string): string | undefined {
  return eventId ? getEventById(eventId)?.title : undefined
}
</script>

<template>
  <TransitionGroup name="year" tag="div" class="flex flex-col gap-3">
    <article
      v-for="entry in years"
      :key="entry.year"
      class="flex flex-col gap-2 rounded-2xl bg-neutral-900/60 p-3 ring-1 ring-white/5"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Año {{ entry.year }} · {{ entry.age }} años · {{ ERA_LABELS[entry.era] }}
      </p>

      <div v-if="entry.releases.length > 0" class="flex flex-col gap-2">
        <ReleaseCard v-for="(release, i) in entry.releases" :key="i" :release="release" />
      </div>

      <div v-if="entry.eventId" class="rounded-xl bg-neutral-800/60 px-3 py-2">
        <p class="text-xs text-neutral-300">{{ eventTitle(entry.eventId) }}</p>
        <p v-if="entry.choiceTaken" class="mt-1 text-xs font-medium text-fuchsia-400">
          → {{ entry.choiceTaken }}
        </p>
      </div>
    </article>
  </TransitionGroup>
</template>

<style scoped>
/* New year fades/slides in at the top; the rest glide down to make room. */
.year-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.year-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.year-move {
  transition: transform 0.35s ease;
}
</style>
