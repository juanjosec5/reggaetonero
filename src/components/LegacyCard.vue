<script setup lang="ts">
import { getArchetype } from '@/data/archetypes'
import { VERDICTS } from '@/data/verdicts'
import type { Career } from '@/types/career'

const props = defineProps<{ career: Career }>()

const verdict = VERDICTS.find((v) => v.id === props.career.legacy?.verdictId)
const archetype = getArchetype(props.career.artist.archetype)

const SCORES = [
  { key: 'commercialScore', label: 'Comercial' },
  { key: 'artisticScore', label: 'Artístico' },
  { key: 'liveScore', label: 'En vivo' },
  { key: 'industryScore', label: 'Industria' },
] as const
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-6 rounded-3xl bg-gradient-to-b from-neutral-900 to-black p-8 ring-1 ring-white/10">
    <div class="text-center">
      <p class="text-xs uppercase tracking-widest text-fuchsia-400">{{ archetype.label }}</p>
      <h1 class="mt-1 text-2xl font-bold text-neutral-50">{{ career.artist.stageName }}</h1>
      <p class="text-xs text-neutral-500">{{ career.artist.city }}, {{ career.artist.country }}</p>
    </div>

    <div class="rounded-2xl bg-white/5 p-5 text-center">
      <p class="text-lg font-bold tracking-wide text-fuchsia-400">{{ verdict?.title }}</p>
      <p class="mt-1 text-sm text-neutral-300">{{ verdict?.description }}</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div v-for="item in SCORES" :key="item.key" class="rounded-xl bg-neutral-900 p-3 text-center ring-1 ring-white/5">
        <p class="text-xl font-bold text-neutral-50">{{ career.legacy?.[item.key] }}</p>
        <p class="text-[11px] text-neutral-500">{{ item.label }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between rounded-xl bg-fuchsia-500/10 px-4 py-3 ring-1 ring-fuchsia-500/30">
      <span class="text-sm font-medium text-neutral-200">Legado</span>
      <span class="text-xl font-bold text-fuchsia-400">{{ career.legacy?.legacyScore }}</span>
    </div>

    <div class="grid grid-cols-3 gap-2 text-center text-xs text-neutral-400">
      <div><p class="text-base font-semibold text-neutral-100">{{ career.record.numberOneRecords }}</p>Números 1</div>
      <div><p class="text-base font-semibold text-neutral-100">{{ career.record.hits }}</p>Hits</div>
      <div><p class="text-base font-semibold text-neutral-100">{{ career.record.shows }}</p>Shows</div>
    </div>

    <p class="text-center text-[10px] tracking-widest text-neutral-600">REGGAETONERO</p>
  </div>
</template>
