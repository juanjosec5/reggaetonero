<script setup lang="ts">
import StatBar from '@/components/ui/StatBar.vue'
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
      <span class="w-36 shrink-0 text-xs text-ink-subtle">{{ item.label }}</span>
      <StatBar :value="stats[item.key]" class="flex-1" />
    </div>
  </div>
</template>
