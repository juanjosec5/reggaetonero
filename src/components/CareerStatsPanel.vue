<script setup lang="ts">
import type { CareerStats } from '@/types/career'

defineProps<{ stats: CareerStats }>()

const STAT_LABELS: { key: keyof CareerStats; label: string }[] = [
  { key: 'fame', label: 'Fama' },
  { key: 'fanbase', label: 'Fanáticos' },
  { key: 'hype', label: 'Hype' },
  { key: 'credibility', label: 'Credibilidad' },
  { key: 'catalogStrength', label: 'Catálogo' },
  { key: 'livePower', label: 'Poder en vivo' },
  { key: 'industryRespect', label: 'Respeto de la industria' },
  { key: 'internationalReach', label: 'Alcance internacional' },
  { key: 'culturalImpact', label: 'Impacto cultural' },
]
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <div v-for="item in STAT_LABELS" :key="item.key" class="flex items-center gap-3">
      <span class="w-36 shrink-0 text-xs text-neutral-400">{{ item.label }}</span>
      <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-800">
        <div
          class="h-full rounded-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-400"
          :style="{ width: `${Math.min(100, Math.max(0, stats[item.key]))}%` }"
        />
      </div>
    </div>
  </div>
</template>
