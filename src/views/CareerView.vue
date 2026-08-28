<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import CareerHeader from '@/components/CareerHeader.vue'
import CareerTable from '@/components/CareerTable.vue'
import DecisionCard from '@/components/DecisionCard.vue'
import MarketProgress from '@/components/MarketProgress.vue'
import RivalPanel from '@/components/RivalPanel.vue'
import TeamPanel from '@/components/TeamPanel.vue'
import { getEventById } from '@/data/events'
import { MAX_CAREER_YEAR, RETIREMENT_MIN_YEAR } from '@/engine/constants'
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
const careerOver = computed(() => (career.value?.year ?? 0) >= MAX_CAREER_YEAR)
const canRetire = computed(() => (career.value?.year ?? 0) >= RETIREMENT_MIN_YEAR)

// The side column only appears once the player has something in it: a hire, a
// second market broken into, or a rival a decision has actually surfaced.
const showSidebar = computed(() => {
  const c = career.value
  if (!c) return false
  return (
    Object.keys(c.team).length > 0 ||
    c.markets.filter((m) => m.unlocked).length >= 2 ||
    c.rivals.some((r) => r.discovered)
  )
})

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
    <CareerHeader :career="career" />

    <div
      class="flex flex-col gap-6"
      :class="showSidebar && 'md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start'"
    >
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
          <p v-if="careerOver" class="text-sm text-neutral-400">
            Llegaste a los 40. Es hora de cerrar el ciclo.
          </p>
          <button
            v-if="!careerOver"
            type="button"
            class="w-full rounded-2xl bg-fuchsia-500 px-4 py-3.5 text-sm font-semibold text-white active:scale-[0.98]"
            @click="advance"
          >
            Avanzar al próximo año
          </button>
          <button
            v-if="canRetire"
            type="button"
            class="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold active:scale-[0.98]"
            :class="careerOver ? 'bg-fuchsia-500 text-white' : 'bg-neutral-800 text-neutral-100'"
            @click="goRetire"
          >
            Retirarte
          </button>
        </template>

        <CareerTable :career="career" />
      </div>

      <!-- Team / markets / rivals column - only once there's something to show -->
      <div v-if="showSidebar" class="flex flex-col gap-6">
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
