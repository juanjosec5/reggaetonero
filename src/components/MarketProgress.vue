<script setup lang="ts">
import { computed } from 'vue'

import { getMarket } from '@/data/markets'
import { MARKET_ESTABLISHED_THRESHOLD } from '@/engine/constants'
import type { MarketState } from '@/types/career'

const props = defineProps<{ markets: MarketState[] }>()

type Row = { id: string; label: string; status: string; tone: string; fill: number; locked: boolean }

// Descriptive only — the raw penetration number is never rendered.
function statusFor(state: MarketState): { status: string; tone: string } {
  if (!state.unlocked) return { status: 'Bloqueado', tone: 'text-neutral-600' }
  if (state.penetration < 25) return { status: 'Entrando', tone: 'text-sky-400' }
  if (state.penetration < MARKET_ESTABLISHED_THRESHOLD) return { status: 'Creciendo', tone: 'text-amber-400' }
  if (state.penetration < 82) return { status: 'Establecido', tone: 'text-emerald-400' }
  return { status: 'Dominado', tone: 'text-fuchsia-400' }
}

const rows = computed<Row[]>(() =>
  [...props.markets]
    .sort((a, b) => Number(b.unlocked) - Number(a.unlocked) || b.penetration - a.penetration)
    .map((state) => {
      const { status, tone } = statusFor(state)
      return {
        id: state.id,
        label: getMarket(state.id).label,
        status,
        tone,
        fill: Math.min(100, Math.max(0, state.penetration)),
        locked: !state.unlocked,
      }
    }),
)
</script>

<template>
  <section class="rounded-2xl bg-neutral-900/60 p-4 ring-1 ring-white/5">
    <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Mercados</h2>
    <ul class="flex flex-col gap-2.5">
      <li v-for="row in rows" :key="row.id" class="flex items-center gap-3" :class="{ 'opacity-45': row.locked }">
        <span class="w-32 shrink-0 truncate text-xs text-neutral-300">{{ row.label }}</span>
        <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-800">
          <div
            v-if="!row.locked"
            class="h-full rounded-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-400"
            :style="{ width: `${row.fill}%` }"
          />
        </div>
        <span class="w-24 shrink-0 text-right text-xs font-medium" :class="row.tone">{{ row.status }}</span>
      </li>
    </ul>
  </section>
</template>
