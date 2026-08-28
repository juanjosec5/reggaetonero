<script setup lang="ts">
import { computed } from 'vue'

import StarRating from '@/components/StarRating.vue'
import { homeCity } from '@/data/cities'
import { STARTING_AGE, MAX_CAREER_YEAR } from '@/engine/constants'
import { formatCount, recordDelta, recordStars, ZERO_DELTA } from '@/engine/stars'
import type { Career } from '@/types/career'

const props = defineProps<{ career: Career }>()

const rows = computed(() => {
  const byYear = new Map(props.career.history.map((h) => [h.year, h]))
  const startCity = homeCity(props.career.artist.country)

  return Array.from({ length: MAX_CAREER_YEAR }, (_, i) => {
    const year = i + 1
    const entry = byYear.get(year)
    if (!entry) {
      return { year, age: STARTING_AGE + i, played: false, current: false }
    }
    const prev = byYear.get(year - 1)?.recordSnapshot ?? ZERO_DELTA
    const d = recordDelta(entry.recordSnapshot, prev)
    return {
      year,
      age: entry.age,
      played: true,
      current: year === props.career.year && props.career.status === 'active',
      city: entry.residence || startCity,
      stars: recordStars(d),
      tickets: d.ticketsSold > 0 ? formatCount(d.ticketsSold) : '—',
      awards: d.grammys + d.billboards > 0 ? `${d.grammys}G · ${d.billboards}B` : '—',
    }
  })
})
</script>

<template>
  <section class="rounded-2xl bg-neutral-900/60 ring-1 ring-white/5">
    <h2 class="px-4 pt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">Tu carrera</h2>
    <div class="overflow-x-auto px-4 pb-4 pt-3">
      <table class="w-full min-w-[26rem] border-collapse text-sm">
        <thead>
          <tr class="text-left text-[11px] uppercase tracking-wide text-neutral-600">
            <th class="pb-2 pr-3 font-medium">Edad</th>
            <th class="pb-2 pr-3 font-medium">Dónde vives</th>
            <th class="pb-2 pr-3 font-medium">Puntuación</th>
            <th class="pb-2 pr-3 font-medium">Entradas</th>
            <th class="pb-2 font-medium">Premios</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.year"
            class="border-t border-white/5"
            :class="row.current ? 'text-neutral-100' : row.played ? 'text-neutral-300' : 'text-neutral-600'"
          >
            <td class="py-2 pr-3 whitespace-nowrap tabular-nums">
              {{ row.age }}
              <span
                v-if="row.current"
                class="ml-1.5 rounded-full bg-fuchsia-500/15 px-1.5 py-0.5 text-[10px] font-medium text-fuchsia-300"
              >
                ahora
              </span>
            </td>
            <td class="py-2 pr-3">{{ row.played ? row.city : '—' }}</td>
            <td class="py-2 pr-3">
              <StarRating v-if="row.played" :value="row.stars!" />
              <span v-else>—</span>
            </td>
            <td class="py-2 pr-3 tabular-nums">{{ row.played ? row.tickets : '—' }}</td>
            <td class="py-2 tabular-nums">{{ row.played ? row.awards : '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
