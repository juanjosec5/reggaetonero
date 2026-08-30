<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AwardShelf from '@/components/AwardShelf.vue'
import CareerStatsPanel from '@/components/CareerStatsPanel.vue'
import CareerTable from '@/components/CareerTable.vue'
import LegacyCard from '@/components/LegacyCard.vue'
import TrajectoryChart from '@/components/TrajectoryChart.vue'
import { buildRecap, buildShareText, LEGACY_METRICS, scoreBand } from '@/engine/legacySummary'
import { formatMoney } from '@/engine/status'
import { useCareerStore } from '@/stores/career'

const router = useRouter()
const store = useCareerStore()

const copied = ref(false)
const fallbackText = ref('')

onMounted(() => {
  if (!store.career) {
    const loaded = store.load()
    if (!loaded) {
      router.replace('/')
      return
    }
  }
  if (!store.isRetired) router.replace('/career')
})

async function copySummary() {
  if (!store.career) return
  const text = buildShareText(store.career)
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    fallbackText.value = text
  }
}

function newCareer() {
  store.clearSave()
  router.push('/create')
}

function legacyVal(key: (typeof LEGACY_METRICS)[number]['key']): number {
  return store.career?.legacy?.[key] ?? 0
}
</script>

<template>
  <main v-if="store.career" class="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-6 p-6">
    <LegacyCard :career="store.career" />

    <section class="w-full rounded-2xl bg-neutral-900/60 p-5 ring-1 ring-white/5">
      <h2 class="text-sm font-semibold text-neutral-200">Cómo se te va a recordar</h2>
      <p class="mt-2 text-sm leading-relaxed text-neutral-300">{{ buildRecap(store.career) }}</p>
    </section>

    <AwardShelf v-if="store.career.awards.length" :awards="store.career.awards" />

    <CareerTable :career="store.career" />

    <section class="flex w-full flex-col gap-6 rounded-2xl bg-neutral-900/60 p-5 ring-1 ring-white/5">
      <h2 class="text-sm font-semibold text-neutral-200">Cómo llegaste aquí</h2>

      <TrajectoryChart :history="store.career.history" />

      <div class="flex flex-col gap-3">
        <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Estado final</p>
        <CareerStatsPanel :stats="store.career.stats" />
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="rounded-xl bg-neutral-900 p-3 ring-1 ring-white/5" title="Lo que te queda después de todo">
          <p class="text-sm font-bold text-neutral-50">{{ formatMoney(store.career.finances.netWorth) }}</p>
          <p class="text-[11px] text-neutral-500">Patrimonio</p>
        </div>
        <div class="rounded-xl bg-neutral-900 p-3 ring-1 ring-white/5" title="Lo que vale tu música como activo">
          <p class="text-sm font-bold text-neutral-50">{{ formatMoney(store.career.finances.catalogValue) }}</p>
          <p class="text-[11px] text-neutral-500">Catálogo</p>
        </div>
        <div class="rounded-xl bg-neutral-900 p-3 ring-1 ring-white/5" title="Porcentaje de tu música que es tuyo">
          <p class="text-sm font-bold text-neutral-50">{{ Math.round(store.career.finances.ownershipPercent) }}%</p>
          <p class="text-[11px] text-neutral-500">Masters propios</p>
        </div>
      </div>

      <details class="text-sm text-neutral-400">
        <summary class="cursor-pointer text-xs font-semibold uppercase tracking-wide text-neutral-500">
          ¿Qué significa cada número?
        </summary>
        <dl class="mt-3 flex flex-col gap-2.5">
          <div v-for="m in LEGACY_METRICS" :key="m.key">
            <dt class="text-neutral-200">
              {{ m.label }} — <span class="font-semibold text-neutral-100">{{ legacyVal(m.key) }}/100</span>
              · {{ scoreBand(legacyVal(m.key)) }}
            </dt>
            <dd class="text-xs text-neutral-500">{{ m.blurb }}</dd>
          </div>
          <div>
            <dt class="text-neutral-200">Legado</dt>
            <dd class="text-xs text-neutral-500">
              La mezcla ponderada de las cinco anteriores, más tu impacto cultural y el valor de tu catálogo.
            </dd>
          </div>
          <div>
            <dt class="text-neutral-200">Hits · Platinos · Premios · Mejor año</dt>
            <dd class="text-xs text-neutral-500">
              Temas que pegaron fuerte · certificaciones de platino · Grammy + Billboard · tu mejor año en estrellas.
            </dd>
          </div>
        </dl>
      </details>
    </section>

    <div class="flex w-full flex-col gap-3">
      <button
        type="button"
        class="w-full rounded-2xl bg-fuchsia-500 px-4 py-3.5 text-sm font-semibold text-white active:scale-[0.98]"
        @click="copySummary"
      >
        {{ copied ? 'Copiado ✓' : 'Copiar resumen' }}
      </button>
      <textarea
        v-if="fallbackText"
        readonly
        rows="10"
        class="w-full rounded-2xl bg-neutral-900 p-3 text-xs text-neutral-300 ring-1 ring-white/10"
        :value="fallbackText"
        @focus="($event.target as HTMLTextAreaElement).select()"
      />
      <button
        type="button"
        class="w-full rounded-2xl bg-neutral-800 px-4 py-3.5 text-sm font-semibold text-neutral-100"
        @click="newCareer"
      >
        Empezar otra carrera
      </button>
    </div>
  </main>
</template>
