<script setup lang="ts">
import StatBar from '@/components/ui/StatBar.vue'
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
  <div
    class="flex w-full max-w-md flex-col gap-6 rounded-[1.6rem] p-8 ring-1 ring-hairline-strong bg-[radial-gradient(95%_120%_at_50%_-10%,rgb(var(--palette-accent)/0.28),transparent_62%),var(--color-bg-deep)]"
  >
    <div class="text-center">
      <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan">
        {{ identity.label }}
      </p>
      <h1 class="mt-1 display text-2xl text-ink">{{ career.artist.stageName }}</h1>
      <p class="text-xs text-ink-faint">{{ career.artist.country }}</p>
    </div>

    <div class="rounded-panel bg-surface p-5 text-center ring-1 ring-hairline">
      <p class="chrome display text-xl">{{ verdict?.title }}</p>
      <p class="mt-1.5 text-sm text-ink-muted">{{ verdict?.description }}</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div
        v-for="item in tiles"
        :key="item.key"
        class="rounded-tile bg-surface-2 p-3 ring-1 ring-hairline"
      >
        <p class="text-center">
          <span class="text-xl font-bold text-ink">{{ val(item.key) }}</span>
          <span class="text-xs text-ink-faint">/100</span>
        </p>
        <StatBar :value="val(item.key)" size="xs" class="mt-1.5" />
        <p class="mt-1.5 text-center text-[11px] text-ink-subtle">
          {{ item.label }} · <span class="text-ink-muted">{{ scoreBand(val(item.key)) }}</span>
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <span class="w-24 shrink-0 text-xs text-ink-subtle">{{ permanencia.label }}</span>
      <StatBar :value="val('longevityScore')" class="flex-1" />
      <span class="text-xs tabular-nums text-ink-subtle">{{ val('longevityScore') }}</span>
    </div>

    <div
      class="flex items-center justify-between rounded-tile bg-accent/10 px-4 py-3 ring-1 ring-accent/35"
    >
      <span class="text-sm font-medium text-ink-muted">Legado</span>
      <span class="text-sm text-ink-subtle">{{ scoreBand(val('legacyScore')) }}</span>
      <span class="text-xl font-bold text-accent"
        >{{ val('legacyScore') }}<span class="text-xs text-accent/60">/100</span></span
      >
    </div>

    <div class="grid grid-cols-4 gap-2 text-center text-xs text-ink-subtle">
      <div><p class="text-base font-semibold text-ink">{{ career.record.hits }}</p>Hits</div>
      <div>
        <p class="text-base font-semibold text-ink">{{ career.record.platinumRecords }}</p>
        Platinos
      </div>
      <div :title="'Grammy + Billboard'">
        <p class="text-base font-semibold text-ink">
          {{ career.record.grammys + career.record.billboards }}
        </p>
        Premios
      </div>
      <div><p class="text-base font-semibold text-ink">{{ best }}</p>Mejor año</div>
    </div>

    <p class="text-center text-[10px] tracking-[0.32em] text-ink-faint">REGGAETONERO</p>
  </div>
</template>
