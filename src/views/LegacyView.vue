<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AwardShelf from '@/components/AwardShelf.vue'
import CareerStatsPanel from '@/components/CareerStatsPanel.vue'
import CareerTable from '@/components/CareerTable.vue'
import LegacyCard from '@/components/LegacyCard.vue'
import TrajectoryChart from '@/components/TrajectoryChart.vue'
import AppButton from '@/components/ui/AppButton.vue'
import Panel from '@/components/ui/Panel.vue'
import Tile from '@/components/ui/Tile.vue'
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

    <Panel as="section" pad="lg" class="w-full">
      <h2 class="text-sm font-semibold text-ink">Cómo se te va a recordar</h2>
      <p class="mt-2 text-sm leading-relaxed text-ink-muted">{{ buildRecap(store.career) }}</p>
    </Panel>

    <AwardShelf v-if="store.career.awards.length" :awards="store.career.awards" />

    <CareerTable :career="store.career" />

    <Panel as="section" pad="lg" class="flex w-full flex-col gap-6">
      <h2 class="text-sm font-semibold text-ink">Cómo llegaste aquí</h2>

      <TrajectoryChart :history="store.career.history" />

      <div class="flex flex-col gap-3">
        <p class="eyebrow">Estado final</p>
        <CareerStatsPanel :stats="store.career.stats" />
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <Tile title="Lo que te queda después de todo">
          <p class="text-sm font-bold text-ink">{{ formatMoney(store.career.finances.netWorth) }}</p>
          <p class="text-[11px] text-ink-subtle">Patrimonio</p>
        </Tile>
        <Tile title="Lo que vale tu música como activo">
          <p class="text-sm font-bold text-ink">
            {{ formatMoney(store.career.finances.catalogValue) }}
          </p>
          <p class="text-[11px] text-ink-subtle">Catálogo</p>
        </Tile>
        <Tile title="Porcentaje de tu música que es tuyo">
          <p class="text-sm font-bold text-ink">
            {{ Math.round(store.career.finances.ownershipPercent) }}%
          </p>
          <p class="text-[11px] text-ink-subtle">Masters propios</p>
        </Tile>
      </div>

      <details class="text-sm text-ink-subtle">
        <summary class="eyebrow cursor-pointer">¿Qué significa cada número?</summary>
        <dl class="mt-3 flex flex-col gap-2.5">
          <div v-for="m in LEGACY_METRICS" :key="m.key">
            <dt class="text-ink-muted">
              {{ m.label }} —
              <span class="font-semibold text-ink">{{ legacyVal(m.key) }}/100</span>
              · {{ scoreBand(legacyVal(m.key)) }}
            </dt>
            <dd class="text-xs text-ink-subtle">{{ m.blurb }}</dd>
          </div>
          <div>
            <dt class="text-ink-muted">Legado</dt>
            <dd class="text-xs text-ink-subtle">
              La mezcla ponderada de las cinco anteriores, más tu impacto cultural y el valor de tu
              catálogo.
            </dd>
          </div>
          <div>
            <dt class="text-ink-muted">Hits · Platinos · Premios · Mejor año</dt>
            <dd class="text-xs text-ink-subtle">
              Temas que pegaron fuerte · certificaciones de platino · Grammy + Billboard · tu mejor
              año en estrellas.
            </dd>
          </div>
        </dl>
      </details>
    </Panel>

    <div class="flex w-full flex-col gap-3">
      <AppButton variant="primary" block @click="copySummary">
        {{ copied ? 'Copiado ✓' : 'Copiar resumen' }}
      </AppButton>
      <textarea
        v-if="fallbackText"
        readonly
        rows="10"
        class="w-full rounded-panel bg-surface-2 p-3 text-xs text-ink-muted ring-1 ring-hairline"
        :value="fallbackText"
        @focus="($event.target as HTMLTextAreaElement).select()"
      />
      <AppButton variant="secondary" block @click="newCareer">Empezar otra carrera</AppButton>
    </div>
  </main>
</template>
