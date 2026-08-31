<script setup lang="ts">
import { computed } from 'vue'

import StarRating from '@/components/StarRating.vue'
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
        <h1 class="text-xl font-bold text-neutral-50">{{ career.artist.stageName }}</h1>
        <p class="text-xs text-neutral-500">Año {{ career.year }} · {{ career.age }} años</p>
      </div>
      <slot name="actions" />
    </div>

    <div class="flex items-center gap-3 transition-all duration-300">
      <StarRating :value="stars" size="lg" />
      <span class="text-sm font-medium text-neutral-400">· {{ starTierLabel(stars) }}</span>
    </div>

    <section
      class="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl bg-neutral-900/60 p-4 ring-1 ring-white/5 sm:grid-cols-5"
    >
      <div v-for="item in readouts" :key="item.label" class="flex flex-col gap-0.5">
        <span class="text-[11px] uppercase tracking-wide text-neutral-500">{{ item.label }}</span>
        <span
          class="text-base font-bold"
          :class="item.label === 'Título' && !identity.defined ? 'text-neutral-500' : 'text-neutral-100'"
        >
          {{ item.value }}
        </span>
      </div>
    </section>
  </header>
</template>
