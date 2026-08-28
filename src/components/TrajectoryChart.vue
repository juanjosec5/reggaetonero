<script setup lang="ts">
import { computed } from 'vue'

import type { CareerYear } from '@/types/career'

const props = defineProps<{ history: CareerYear[] }>()

const SERIES = [
  { key: 'fame', label: 'Fama', color: '#e879f9' },
  { key: 'catalogStrength', label: 'Catálogo', color: '#38bdf8' },
  { key: 'culturalImpact', label: 'Impacto', color: '#fbbf24' },
] as const

const W = 300
const H = 140
const PAD_X = 8
const PAD_TOP = 8
const PAD_BOTTOM = 18

const points = computed(() => props.history.map((y) => y.statsSnapshot))

const hasData = computed(() => points.value.length >= 2)

function pathFor(key: (typeof SERIES)[number]['key']): string {
  const pts = points.value
  const n = pts.length
  const innerW = W - PAD_X * 2
  const innerH = H - PAD_TOP - PAD_BOTTOM
  return pts
    .map((snap, i) => {
      const x = PAD_X + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)
      const value = Math.max(0, Math.min(100, snap[key]))
      const yPos = PAD_TOP + innerH - (value / 100) * innerH
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${yPos.toFixed(1)}`
    })
    .join(' ')
}

const yearLabels = computed(() => {
  const first = props.history[0]?.year
  const last = props.history.at(-1)?.year
  return { first, last }
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Tu trayectoria</p>

    <p v-if="!hasData" class="text-sm text-neutral-500">Carrera demasiado corta para una gráfica.</p>

    <template v-else>
      <svg :viewBox="`0 0 ${W} ${H}`" class="w-full" role="img" aria-label="Evolución de la carrera por año">
        <line
          v-for="frac in [0, 0.5, 1]"
          :key="frac"
          :x1="PAD_X"
          :x2="W - PAD_X"
          :y1="PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * frac"
          :y2="PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * frac"
          stroke="currentColor"
          class="text-neutral-800"
          stroke-width="1"
        />
        <path
          v-for="s in SERIES"
          :key="s.key"
          :d="pathFor(s.key)"
          fill="none"
          :stroke="s.color"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        <text :x="PAD_X" :y="H - 4" class="fill-neutral-500 text-[9px]">Año {{ yearLabels.first }}</text>
        <text :x="W - PAD_X" :y="H - 4" text-anchor="end" class="fill-neutral-500 text-[9px]">
          Año {{ yearLabels.last }}
        </text>
      </svg>

      <div class="flex flex-wrap gap-x-4 gap-y-1">
        <span v-for="s in SERIES" :key="s.key" class="flex items-center gap-1.5 text-xs text-neutral-400">
          <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: s.color }" />
          {{ s.label }}
        </span>
      </div>
    </template>
  </div>
</template>
