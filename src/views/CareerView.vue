<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AwardShelf from '@/components/AwardShelf.vue'
import AwardToast from '@/components/AwardToast.vue'
import CareerHeader from '@/components/CareerHeader.vue'
import CareerTable from '@/components/CareerTable.vue'
import DecisionCard from '@/components/DecisionCard.vue'
import MarketProgress from '@/components/MarketProgress.vue'
import RivalPanel from '@/components/RivalPanel.vue'
import StarShift from '@/components/StarShift.vue'
import TeamPanel from '@/components/TeamPanel.vue'
import { getEventById } from '@/data/events'
import { MAX_CAREER_YEAR, RETIREMENT_MIN_YEAR } from '@/engine/constants'
import { currentStars } from '@/engine/stars'
import { useCareerStore } from '@/stores/career'
import type { CareerAward, CareerChoice } from '@/types/career'

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

// One serial queue of celebrations — new awards and whole-star gains/losses.
// The first observation of each just sets a baseline so loading a save doesn't
// replay past trophies or re-animate the current rating.
type Celebration =
  | { id: string; kind: 'award'; award: CareerAward }
  | { id: string; kind: 'star'; dir: 'up' | 'down'; tier: number }

const queue = ref<Celebration[]>([])
const current = computed(() => queue.value[0])
function nextCelebration() {
  queue.value.shift()
}

const seenAwards = ref(-1)
watch(
  () => career.value?.awards.length ?? -1,
  (n) => {
    if (n < 0) return
    if (seenAwards.value < 0) {
      seenAwards.value = n
      return
    }
    if (n > seenAwards.value) {
      for (const award of career.value?.awards.slice(seenAwards.value) ?? []) {
        queue.value.push({ id: award.id, kind: 'award', award })
      }
      seenAwards.value = n
    }
  },
  { immediate: true },
)

const rawStars = computed(() => (career.value ? currentStars(career.value) : 0))
const seenTier = ref(-1)
watch(
  rawStars,
  (raw) => {
    const year = career.value?.year ?? 0
    if (seenTier.value < 0) {
      seenTier.value = Math.floor(raw)
      return
    }
    const floor = Math.floor(raw)
    if (floor > seenTier.value) {
      for (let t = seenTier.value + 1; t <= floor; t++) {
        queue.value.push({ id: `starup-${t}-${year}`, kind: 'star', dir: 'up', tier: t })
      }
      seenTier.value = floor
    } else if (raw <= seenTier.value - 0.5) {
      // Half-star hysteresis: a career hovering on a boundary shouldn't spam.
      queue.value.push({ id: `stardn-${seenTier.value - 1}-${year}`, kind: 'star', dir: 'down', tier: seenTier.value - 1 })
      seenTier.value -= 1
    }
  },
  { immediate: true },
)

// The event this year introduced. Kept even after a choice is applied so the
// resolved card stays on screen until the player advances.
const displayedEvent = computed(() => {
  const eventId = lastYear.value?.eventId
  return eventId ? getEventById(eventId) : undefined
})

const showPanels = computed(() => {
  const c = career.value
  if (!c) return false
  return (
    Object.keys(c.team).length > 0 ||
    c.markets.filter((m) => m.unlocked).length >= 2 ||
    c.rivals.some((r) => r.discovered)
  )
})

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
  <main v-if="career" class="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6">
    <template v-if="current">
      <AwardToast
        v-if="current.kind === 'award'"
        :key="current.id"
        :award="current.award"
        @done="nextCelebration"
      />
      <StarShift v-else :key="current.id" :dir="current.dir" :tier="current.tier" @done="nextCelebration" />
    </template>

    <CareerHeader :career="career" />
    <AwardShelf :awards="career.awards" />

    <div class="flex flex-col gap-6 md:grid md:grid-cols-[1fr_2fr] md:items-start">
      <!-- Decisions / actions -->
      <div class="flex flex-col gap-3">
        <DecisionCard
          v-if="displayedEvent"
          :event="displayedEvent"
          :resolved="!store.pendingChoice"
          :choice-taken="lastYear?.choiceTaken"
          @choose="chooseAction"
        />

        <template v-if="!store.pendingChoice">
          <p v-if="careerOver" class="text-sm text-neutral-400">
            Llegaste a los 35. Es hora de cerrar el ciclo.
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

        <template v-if="showPanels">
          <TeamPanel :team="career.team" />
          <MarketProgress :markets="career.markets" />
          <RivalPanel :rivals="career.rivals" :player-fame="career.stats.fame" />
        </template>
      </div>

      <!-- The career, year by year -->
      <CareerTable :career="career" />
    </div>
  </main>
</template>
