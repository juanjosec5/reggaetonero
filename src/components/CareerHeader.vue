<script setup lang="ts">
import { computed } from 'vue'

import { computeIdentity } from '@/engine/identityEngine'
import { formatMoney, globalStatusBand, recognitionBand } from '@/engine/status'
import type { Career } from '@/types/career'

const props = defineProps<{ career: Career }>()

const identity = computed(() => computeIdentity(props.career))

const readouts = computed(() => [
  { label: 'Dinero', value: formatMoney(props.career.finances.cash) },
  { label: 'Reconocimiento', value: recognitionBand(props.career) },
  { label: 'Estatus global', value: globalStatusBand(props.career) },
  { label: 'Título', value: identity.value.label },
])
</script>

<template>
  <header class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-semibold text-neutral-50">{{ career.artist.stageName }}</h1>
        <p class="text-xs text-neutral-500">Año {{ career.year }} · {{ career.age }} años</p>
      </div>
      <slot name="actions" />
    </div>

    <section
      class="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl bg-neutral-900/60 p-4 ring-1 ring-white/5 sm:grid-cols-4"
    >
      <div v-for="item in readouts" :key="item.label" class="flex flex-col gap-0.5">
        <span class="text-[10px] uppercase tracking-wide text-neutral-500">{{ item.label }}</span>
        <span
          class="text-sm font-semibold"
          :class="item.label === 'Título' && !identity.defined ? 'text-neutral-500' : 'text-neutral-100'"
        >
          {{ item.value }}
        </span>
      </div>
    </section>
  </header>
</template>
