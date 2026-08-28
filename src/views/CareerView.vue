<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import CareerStatsPanel from '@/components/CareerStatsPanel.vue'
import CareerTimeline from '@/components/CareerTimeline.vue'
import DecisionCard from '@/components/DecisionCard.vue'
import MarketProgress from '@/components/MarketProgress.vue'
import RivalPanel from '@/components/RivalPanel.vue'
import TeamPanel from '@/components/TeamPanel.vue'
import { getEventById } from '@/data/events'
import { useCareerStore } from '@/stores/career'
import type { CareerChoice, CareerEvent } from '@/types/career'

const router = useRouter()
const store = useCareerStore()

onMounted(() => {
  if (!store.career) {
    const loaded = store.load()
    if (!loaded) router.replace('/')
  }
})

const career = computed(() => store.career)
const lastYear = computed(() => career.value?.history.at(-1))

// Tracks whichever event the *current* year introduced, independent of the
// store's `currentEvent` (which closes as soon as a choice is applied). This
// only updates when a new year is actually simulated (history grows), so the
// card's own leave/enter transition fires on "Avanzar", not on choosing.
const displayedEvent = ref<CareerEvent | undefined>()

watch(
  () => career.value?.history.length ?? 0,
  () => {
    const eventId = lastYear.value?.eventId
    displayedEvent.value = eventId ? getEventById(eventId) : undefined
  },
  { immediate: true },
)

function advance() {
  store.advanceYear()
}

function chooseAction(choice: CareerChoice) {
  store.applyChoice(choice)
}

function goRetire() {
  store.retire()
  router.push('/legacy')
}
</script>

<template>
  <main v-if="career" class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
    <header class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-neutral-50">{{ career.artist.stageName }}</h1>
          <p class="text-xs text-neutral-500">Año {{ career.year }} · {{ career.age }} años</p>
        </div>
        <button type="button" class="text-xs text-neutral-400" @click="router.push('/history')">
          Historial
        </button>
      </div>

      <section class="rounded-2xl bg-neutral-900/60 p-4 ring-1 ring-white/5">
        <CareerStatsPanel :stats="career.stats" />
      </section>
    </header>

    <div class="flex flex-col gap-6 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start">
      <!-- Decision / action column -->
      <div class="flex flex-col gap-3">
        <Transition name="decision" mode="out-in">
          <DecisionCard
            v-if="displayedEvent"
            :key="career.history.length"
            :event="displayedEvent"
            :resolved="!store.pendingChoice"
            :choice-taken="lastYear?.choiceTaken"
            @choose="chooseAction"
          />
        </Transition>

        <template v-if="!store.pendingChoice">
          <button
            type="button"
            class="w-full rounded-2xl bg-fuchsia-500 px-4 py-3.5 text-sm font-semibold text-white active:scale-[0.98]"
            @click="advance"
          >
            Avanzar al próximo año
          </button>
          <button
            v-if="career.year >= 8"
            type="button"
            class="w-full rounded-2xl bg-neutral-800 px-4 py-3.5 text-sm font-semibold text-neutral-100 active:scale-[0.98]"
            @click="goRetire"
          >
            Retirarte
          </button>
        </template>

        <CareerTimeline :history="career.history" />
      </div>

      <!-- Team / markets / rivals column -->
      <div class="flex flex-col gap-6">
        <TeamPanel :team="career.team" />
        <MarketProgress :markets="career.markets" />
        <RivalPanel :rivals="career.rivals" :player-fame="career.stats.fame" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.decision-enter-active,
.decision-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.decision-enter-from,
.decision-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
