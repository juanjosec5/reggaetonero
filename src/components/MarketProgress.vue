<script setup lang="ts">
import { computed } from 'vue'

import Panel from '@/components/ui/Panel.vue'
import StatBar from '@/components/ui/StatBar.vue'
import { TONE_TEXT, type Tone } from '@/components/ui/tones'
import { MARKETS } from '@/data/markets'
import { MARKET_ESTABLISHED_THRESHOLD } from '@/engine/constants'
import type { MarketState } from '@/types/career'

const props = defineProps<{ markets: MarketState[] }>()

type Row = { id: string; label: string; status: string; tone: Tone; fill: number }

// Descriptive only — the raw penetration number is never rendered.
function statusFor(penetration: number): { status: string; tone: Tone } {
  if (penetration < 25) return { status: 'Entrando', tone: 'info' }
  if (penetration < MARKET_ESTABLISHED_THRESHOLD) return { status: 'Creciendo', tone: 'warn' }
  if (penetration < 82) return { status: 'Establecido', tone: 'good' }
  return { status: 'Dominado', tone: 'accent' }
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
  <Panel v-if="rows.length >= 2" as="section" heading="Mercados">
    <ul class="flex flex-col gap-2.5">
      <li v-for="row in rows" :key="row.id" class="flex items-center gap-3">
        <span class="w-32 shrink-0 truncate text-xs text-ink-muted">{{ row.label }}</span>
        <StatBar :value="row.fill" class="flex-1" />
        <span class="w-24 shrink-0 text-right text-xs font-medium" :class="TONE_TEXT[row.tone]">
          {{ row.status }}
        </span>
      </li>
    </ul>
  </Panel>
</template>
