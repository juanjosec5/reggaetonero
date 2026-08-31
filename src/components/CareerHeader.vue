<script setup lang="ts">
import { computed } from 'vue'

import StarRating from '@/components/StarRating.vue'
import Panel from '@/components/ui/Panel.vue'
import { computeIdentity } from '@/engine/identityEngine'
import { currentStars, starTierLabel } from '@/engine/stars'
import { globalStatusBand, moneyBand, recognitionBand } from '@/engine/status'
import type { Career } from '@/types/career'

const props = defineProps<{ career: Career }>()

const identity = computed(() => computeIdentity(props.career))
const stars = computed(() => currentStars(props.career))

const readouts = computed(() => [
  { label: 'Dinero', value: moneyBand(props.career.finances.netWorth) },
  { label: 'Reconocimiento', value: recognitionBand(props.career) },
  { label: 'Estatus global', value: globalStatusBand(props.career) },
  { label: 'Ubicación', value: props.career.residence },
  { label: 'Título', value: identity.value.label },
])
</script>

<template>
  <header class="flex flex-col gap-4">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="display text-xl text-ink">{{ career.artist.stageName }}</h1>
        <p class="text-xs text-ink-faint">Año {{ career.year }} · {{ career.age }} años</p>
      </div>
      <slot name="actions" />
    </div>

    <div class="flex items-center gap-3 transition-all duration-300">
      <StarRating :value="stars" size="lg" />
      <span class="text-sm font-medium text-ink-subtle">· {{ starTierLabel(stars) }}</span>
    </div>

    <Panel as="section" class="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-5">
      <div v-for="item in readouts" :key="item.label" class="flex flex-col gap-0.5">
        <span class="eyebrow">{{ item.label }}</span>
        <span
          class="text-base font-bold"
          :class="item.label === 'Título' && !identity.defined ? 'text-ink-faint' : 'text-ink'"
        >
          {{ item.value }}
        </span>
      </div>
    </Panel>
  </header>
</template>
