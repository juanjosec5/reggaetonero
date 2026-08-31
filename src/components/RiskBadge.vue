<script setup lang="ts">
import StatusPill from '@/components/ui/StatusPill.vue'
import type { Tone } from '@/components/ui/tones'
import type { VisibleRisk } from '@/types/career'

defineProps<{ risk: VisibleRisk }>()

const LABELS: Record<VisibleRisk, string> = {
  low: 'Riesgo bajo',
  medium: 'Riesgo medio',
  high: 'Riesgo alto',
}
const TONES: Record<VisibleRisk, Tone> = { low: 'good', medium: 'warn', high: 'bad' }
</script>

<template>
  <StatusPill :tone="TONES[risk]" dot>{{ LABELS[risk] }}</StatusPill>
</template>
