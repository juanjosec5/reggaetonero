<script setup lang="ts">
import { computed } from 'vue'

import type { Rival } from '@/types/career'

const props = defineProps<{ rivals: Rival[]; playerFame: number }>()

// Descriptive only — no raw fame/relationship numbers are rendered.
function standingLabel(gap: number): { text: string; tone: string } {
  if (gap > 18) return { text: 'Por encima de ti', tone: 'text-rose-400' }
  if (gap < -18) return { text: 'Por debajo de ti', tone: 'text-emerald-400' }
  return { text: 'A tu nivel', tone: 'text-amber-400' }
}

function relationshipLabel(value: number): { text: string; tone: string } {
  if (value <= -40) return { text: 'Beef', tone: 'text-rose-400' }
  if (value <= -12) return { text: 'Tensión', tone: 'text-amber-400' }
  if (value >= 40) return { text: 'Buena onda', tone: 'text-emerald-400' }
  return { text: 'Neutral', tone: 'text-neutral-400' }
}

// Only rivals a decision has actually put in front of the player.
const rows = computed(() =>
  props.rivals
    .filter((rival) => rival.discovered)
    .sort((a, b) => b.fame - a.fame)
    .map((rival) => ({
      id: rival.id,
      name: rival.name,
      style: rival.style,
      standing: standingLabel(rival.fame - props.playerFame),
      relationship: relationshipLabel(rival.relationship),
    })),
)
</script>

<template>
  <section v-if="rows.length" class="rounded-2xl bg-neutral-900/60 p-4 ring-1 ring-white/5">
    <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Rivales</h2>
    <ul class="flex flex-col gap-3">
      <li v-for="row in rows" :key="row.id" class="flex flex-col gap-0.5">
        <div class="flex items-center justify-between gap-3">
          <span class="text-sm font-medium text-neutral-100">{{ row.name }}</span>
          <span class="text-xs font-medium" :class="row.standing.tone">{{ row.standing.text }}</span>
        </div>
        <div class="flex items-center justify-between gap-3">
          <span class="truncate text-xs text-neutral-500">{{ row.style }}</span>
          <span class="shrink-0 text-xs font-medium" :class="row.relationship.tone">{{ row.relationship.text }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>
