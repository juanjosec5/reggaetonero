<script setup lang="ts">
import { computed } from 'vue'

import StarRating from '@/components/StarRating.vue'
import { ERAS } from '@/data/eras'
import { eraStars, formatCount, ZERO_ERA_DELTA, type EraRecordDelta } from '@/engine/stars'
import type { Career, CareerYear } from '@/types/career'

const props = defineProps<{ career: Career }>()

const DELTA_KEYS = Object.keys(ZERO_ERA_DELTA) as (keyof EraRecordDelta)[]

function delta(end: CareerYear['recordSnapshot'], start: EraRecordDelta): EraRecordDelta {
  const out = { ...ZERO_ERA_DELTA }
  for (const k of DELTA_KEYS) out[k] = Math.max(0, end[k] - start[k])
  return out
}

const rows = computed(() => {
  const hist = props.career.history

  return ERAS.map((era, i) => {
    const yearsInEra = hist.filter((h) => h.era === era.id)
    const endSnap = yearsInEra.at(-1)?.recordSnapshot

    // Baseline = the cumulative record at the end of the last era actually reached.
    let startSnap: EraRecordDelta = ZERO_ERA_DELTA
    for (let j = i - 1; j >= 0; j--) {
      const prev = hist.filter((h) => h.era === ERAS[j]!.id).at(-1)?.recordSnapshot
      if (prev) {
        startSnap = prev
        break
      }
    }

    const d = endSnap ? delta(endSnap, startSnap) : null
    const cities = [...new Set(yearsInEra.map((h) => h.residence))]

    return {
      id: era.id,
      label: era.label,
      ageRange: `${era.ageRange[0]}–${era.ageRange[1]}`,
      current: props.career.era === era.id && props.career.status === 'active',
      reached: yearsInEra.length > 0,
      cities: cities.length ? cities.join(' · ') : '—',
      stars: d ? eraStars(d) : 0,
      tickets: d ? formatCount(d.ticketsSold) : '—',
      awards: d ? `${d.grammys}G · ${d.billboards}B` : '—',
    }
  })
})
</script>

<template>
  <section class="rounded-2xl bg-neutral-900/60 ring-1 ring-white/5">
    <h2 class="px-4 pt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">Tu carrera</h2>
    <div class="overflow-x-auto px-4 pb-4 pt-3">
      <table class="w-full min-w-[30rem] border-collapse text-sm">
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
            :key="row.id"
            class="border-t border-white/5"
            :class="row.current ? 'text-neutral-100' : row.reached ? 'text-neutral-300' : 'text-neutral-600'"
          >
            <td class="py-2.5 pr-3 whitespace-nowrap">
              <span class="font-medium">{{ row.ageRange }}</span>
              <span
                v-if="row.current"
                class="ml-2 rounded-full bg-fuchsia-500/15 px-1.5 py-0.5 text-[10px] font-medium text-fuchsia-300"
              >
                ahora
              </span>
            </td>
            <td class="py-2.5 pr-3">{{ row.cities }}</td>
            <td class="py-2.5 pr-3"><StarRating v-if="row.reached" :value="row.stars" /><span v-else>—</span></td>
            <td class="py-2.5 pr-3 tabular-nums">{{ row.tickets }}</td>
            <td class="py-2.5 tabular-nums">{{ row.awards }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
