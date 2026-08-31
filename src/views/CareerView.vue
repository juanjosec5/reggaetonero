<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
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
import AppButton from '@/components/ui/AppButton.vue'
import { getEventById } from '@/data/events'
import { MAX_CAREER_YEAR, RETIREMENT_MIN_YEAR } from '@/engine/constants'
import { currentStars } from '@/engine/stars'
import { useCareerStore } from '@/stores/career'
import type { CareerAward, CareerChoice } from '@/types/career'

const router = useRouter()
const store = useCareerStore()

// --- First-decision intro ---------------------------------------------------
// A brand-new career lands here with year 1's decision pending. We show that
// card alone in the centre of the screen; once the player chooses, the card
// FLIPs to its normal slot and the rest of the UI fades in.
type IntroPhase = 'intro' | 'settling' | 'done'
const introPhase = ref<IntroPhase>('done')
const restRevealed = ref(true)
const cardRef = ref<InstanceType<typeof DecisionCard> | null>(null)
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  if (!store.career) {
    const loaded = store.load()
    if (!loaded) {
      router.replace('/')
      return
    }
  }
  if (store.career?.year === 1 && store.pendingChoice && !prefersReducedMotion) {
    introPhase.value = 'intro'
    restRevealed.value = false
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

async function chooseAction(choice: CareerChoice) {
  if (introPhase.value !== 'intro') {
    store.applyChoice(choice)
    return
  }

  // FLIP: measure the centred card, resolve the choice + reveal the layout,
  // then animate the (now in-flow) card back from where it was.
  const fromEl = (cardRef.value?.$el as HTMLElement | undefined) ?? null
  const from = fromEl?.getBoundingClientRect()

  store.applyChoice(choice)
  introPhase.value = 'settling'
  await nextTick()

  const toEl = cardRef.value?.$el as HTMLElement | undefined
  if (from && toEl && toEl.getBoundingClientRect().width > 0) {
    const to = toEl.getBoundingClientRect()
    const dx = from.left - to.left
    const dy = from.top - to.top
    const scale = Math.min(2.5, from.width / to.width)
    toEl.style.transformOrigin = 'top left'
    toEl.style.transition = 'none'
    toEl.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
    // next frame: release to the natural position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toEl.style.transition = 'transform 1.3s cubic-bezier(0.16, 1, 0.3, 1)'
        toEl.style.transform = ''
        restRevealed.value = true
      })
    })
    window.setTimeout(() => {
      toEl.style.transition = ''
      toEl.style.transform = ''
      toEl.style.transformOrigin = ''
      introPhase.value = 'done'
    }, 1550)
  } else {
    restRevealed.value = true
    introPhase.value = 'done'
  }
}

function goRetire() {
  store.retire()
  router.push('/legacy')
}
</script>

<template>
  <!-- First-decision intro: the card alone, centred. -->
  <main
    v-if="career && introPhase === 'intro' && displayedEvent"
    class="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-5 p-6"
  >
    <p class="intro-eyebrow text-xs font-semibold uppercase tracking-[0.25em] text-accent">
      Tu primera decisión
    </p>
    <DecisionCard
      ref="cardRef"
      class="intro-card"
      :event="displayedEvent"
      :resolved="false"
      @choose="chooseAction"
    />
  </main>

  <!-- Normal layout (also the target of the intro FLIP). -->
  <main
    v-else-if="career"
    class="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6"
  >
    <template v-if="current">
      <AwardToast
        v-if="current.kind === 'award'"
        :key="current.id"
        :award="current.award"
        @done="nextCelebration"
      />
      <StarShift v-else :key="current.id" :dir="current.dir" :tier="current.tier" @done="nextCelebration" />
    </template>

    <div class="rest-fade rest-d1" :class="restRevealed ? 'rest-in' : 'rest-out'">
      <CareerHeader :career="career" />
      <AwardShelf :awards="career.awards" />
    </div>

    <div class="flex flex-col gap-6 md:grid md:grid-cols-[1fr_2fr] md:items-start">
      <!-- Decisions / actions -->
      <div class="flex flex-col gap-3">
        <DecisionCard
          v-if="displayedEvent"
          ref="cardRef"
          :event="displayedEvent"
          :resolved="!store.pendingChoice"
          :choice-taken="lastYear?.choiceTaken"
          @choose="chooseAction"
        />

        <template v-if="!store.pendingChoice">
          <div class="rest-fade rest-d2" :class="restRevealed ? 'rest-in' : 'rest-out'">
            <p v-if="careerOver" class="text-sm text-ink-subtle">
              Llegaste a los 35. Es hora de cerrar el ciclo.
            </p>
            <AppButton v-if="!careerOver" variant="primary" block @click="advance">
              Avanzar al próximo año
            </AppButton>
            <AppButton
              v-if="canRetire"
              :variant="careerOver ? 'primary' : 'secondary'"
              block
              class="mt-3"
              @click="goRetire"
            >
              Retirarte
            </AppButton>
          </div>
        </template>

        <template v-if="showPanels">
          <div class="rest-fade rest-d3 flex flex-col gap-3" :class="restRevealed ? 'rest-in' : 'rest-out'">
            <TeamPanel :team="career.team" />
            <MarketProgress :markets="career.markets" />
            <RivalPanel :rivals="career.rivals" :player-fame="career.stats.fame" />
          </div>
        </template>
      </div>

      <!-- The career, year by year -->
      <div class="rest-fade rest-d3" :class="restRevealed ? 'rest-in' : 'rest-out'">
        <CareerTable :career="career" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.intro-eyebrow {
  animation: intro-eyebrow 1.1s ease-out both;
}
.intro-card {
  animation: intro-card 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes intro-eyebrow {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}
@keyframes intro-card {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(16px);
  }
}

/* The rest of the UI fades + rises into place once the first choice is made,
   lightly staggered so the header settles before the table. */
.rest-fade {
  transition:
    opacity 1.4s ease,
    transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.rest-d1 {
  transition-delay: 0.15s;
}
.rest-d2 {
  transition-delay: 0.35s;
}
.rest-d3 {
  transition-delay: 0.5s;
}
.rest-out {
  opacity: 0;
  transform: translateY(12px);
}
.rest-in {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .intro-eyebrow,
  .intro-card,
  .rest-fade {
    animation: none;
    transition: none;
  }
}
</style>
