<script setup lang="ts">
import { computed } from 'vue'

import { MARKETS } from '@/data/markets'
import { MARKET_ESTABLISHED_THRESHOLD } from '@/engine/constants'
import type { MarketState } from '@/types/career'

const props = defineProps<{ markets: MarketState[] }>()

type Row = { id: string; label: string; status: string; tone: string; fill: number }

// Descriptive only — the raw penetration number is never rendered.
function statusFor(penetration: number): { status: string; tone: string } {
  if (penetration < 25) return { status: 'Entrando', tone: 'text-sky-400' }
  if (penetration < MARKET_ESTABLISHED_THRESHOLD) return { status: 'Creciendo', tone: 'text-amber-400' }
  if (penetration < 82) return { status: 'Establecido', tone: 'text-emerald-400' }
  return { status: 'Dominado', tone: 'text-fuchsia-400' }
}

// Only markets the artist has actually broken into show up.
const rows = computed<Row[]>(() =>
  props.markets
    .filter((state) => state.unlocked)
    .sort((a, b) => b.penetration - a.penetration)
    .map((state) => {
      const { status, tone } = statusFor(state.penetration)
      return {
        id: state.id,
        label: MARKETS.get(state.id).label,
        status,
        tone,
        fill: Math.min(100, Math.max(0, state.penetration)),
      }
    }),
)
</script>

<template>
  <!-- Stays hidden until the artist has broken into a second market. -->
  <section v-if="rows.length >= 2" class="rounded-2xl bg-neutral-900/60 p-4 ring-1 ring-white/5">
    <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Mercados</h2>
    <ul class="flex flex-col gap-2.5">
      <li v-for="row in rows" :key="row.id" class="flex items-center gap-3">
        <span class="w-32 shrink-0 truncate text-xs text-neutral-300">{{ row.label }}</span>
        <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-800">
          <div
            class="h-full rounded-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-400"
            :style="{ width: `${row.fill}%` }"
          />
        </div>
        <span class="w-24 shrink-0 text-right text-xs font-medium" :class="row.tone">{{ row.status }}</span>
      </li>
    </ul>
  </section>
</template>
