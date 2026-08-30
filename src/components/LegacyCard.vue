<script setup lang="ts">
import { VERDICTS } from '@/data/verdicts'
import { computeIdentity } from '@/engine/identityEngine'
import { formatStars, LEGACY_METRICS, peakStars, scoreBand } from '@/engine/legacySummary'
import type { Career } from '@/types/career'

const props = defineProps<{ career: Career }>()

const verdict = VERDICTS.find((v) => v.id === props.career.legacy?.verdictId)
const identity = computeIdentity(props.career)
const best = formatStars(peakStars(props.career))

const tiles = LEGACY_METRICS.filter((m) => m.key !== 'longevityScore')
const permanencia = LEGACY_METRICS.find((m) => m.key === 'longevityScore')!

function val(key: (typeof LEGACY_METRICS)[number]['key']): number {
  return props.career.legacy?.[key] ?? 0
}
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-6 rounded-3xl bg-gradient-to-b from-neutral-900 to-black p-8 ring-1 ring-white/10">
    <div class="text-center">
      <p class="text-xs uppercase tracking-widest text-fuchsia-400">{{ identity.label }}</p>
      <h1 class="mt-1 text-2xl font-bold text-neutral-50">{{ career.artist.stageName }}</h1>
      <p class="text-xs text-neutral-500">{{ career.artist.country }}</p>
    </div>

    <div class="rounded-2xl bg-white/5 p-5 text-center">
      <p class="text-lg font-bold tracking-wide text-fuchsia-400">{{ verdict?.title }}</p>
      <p class="mt-1 text-sm text-neutral-300">{{ verdict?.description }}</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div v-for="item in tiles" :key="item.key" class="rounded-xl bg-neutral-900 p-3 ring-1 ring-white/5">
        <p class="text-center">
          <span class="text-xl font-bold text-neutral-50">{{ val(item.key) }}</span>
          <span class="text-xs text-neutral-500">/100</span>
        </p>
        <div class="mx-auto mt-1.5 h-1 w-full overflow-hidden rounded-full bg-neutral-800">
          <div
            class="h-full rounded-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-400"
            :style="{ width: `${Math.min(100, Math.max(0, val(item.key)))}%` }"
          />
        </div>
        <p class="mt-1.5 text-center text-[11px] text-neutral-500">
          {{ item.label }} · <span class="text-neutral-400">{{ scoreBand(val(item.key)) }}</span>
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <span class="w-24 shrink-0 text-xs text-neutral-400">{{ permanencia.label }}</span>
      <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-800">
        <div
          class="h-full rounded-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-400"
          :style="{ width: `${Math.min(100, Math.max(0, val('longevityScore')))}%` }"
        />
      </div>
      <span class="text-xs tabular-nums text-neutral-400">{{ val('longevityScore') }}</span>
    </div>

    <div class="flex items-center justify-between rounded-xl bg-fuchsia-500/10 px-4 py-3 ring-1 ring-fuchsia-500/30">
      <span class="text-sm font-medium text-neutral-200">Legado</span>
      <span class="text-sm text-neutral-400">{{ scoreBand(val('legacyScore')) }}</span>
      <span class="text-xl font-bold text-fuchsia-400">{{ val('legacyScore') }}<span class="text-xs text-fuchsia-400/60">/100</span></span>
    </div>

    <div class="grid grid-cols-4 gap-2 text-center text-xs text-neutral-400">
      <div><p class="text-base font-semibold text-neutral-100">{{ career.record.hits }}</p>Hits</div>
      <div><p class="text-base font-semibold text-neutral-100">{{ career.record.platinumRecords }}</p>Platinos</div>
      <div :title="'Grammy + Billboard'">
        <p class="text-base font-semibold text-neutral-100">
          {{ career.record.grammys + career.record.billboards }}
        </p>
        Premios
      </div>
      <div><p class="text-base font-semibold text-neutral-100">{{ best }}</p>Mejor año</div>
    </div>

    <p class="text-center text-[10px] tracking-widest text-neutral-600">REGGAETONERO</p>
  </div>
</template>
