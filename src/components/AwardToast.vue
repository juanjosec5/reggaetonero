<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { AWARD_ICON } from '@/data/awards'
import type { CareerAward } from '@/types/career'

const props = defineProps<{ award: CareerAward }>()
const emit = defineEmits<{ done: [] }>()

const show = ref(false)

onMounted(() => {
  show.value = true
  const hold = props.award.grand ? 2800 : 2000
  setTimeout(() => (show.value = false), hold)
})

function afterLeave() {
  emit('done')
}
</script>

<template>
  <Transition name="award" appear @after-leave="afterLeave">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-[2px]"
      @click="show = false"
    >
      <div
        class="award-card flex flex-col items-center gap-2.5 rounded-3xl px-10 py-8 text-center ring-1"
        :class="award.grand ? 'grand bg-neutral-950/95 ring-amber-300/40' : 'bg-neutral-950/95 ring-fuchsia-400/30'"
      >
        <span class="award-icon text-6xl">{{ AWARD_ICON[award.kind] }}</span>
        <p
          class="text-[11px] font-semibold uppercase tracking-[0.2em]"
          :class="award.grand ? 'text-amber-300' : 'text-fuchsia-400'"
        >
          {{ award.grand ? 'Hito de carrera' : 'Nuevo logro' }}
        </p>
        <p class="max-w-[16rem] text-lg font-bold leading-snug text-neutral-50">{{ award.title }}</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Backdrop fade */
.award-enter-active {
  transition: opacity 0.25s ease;
}
.award-leave-active {
  transition: opacity 0.4s ease;
}
.award-enter-from,
.award-leave-to {
  opacity: 0;
}

/* The card: scale-in, plus a shadow that flares on entry then relaxes. */
.award-card {
  animation:
    award-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both,
    award-glow 0.9s ease-out both;
}
.award-leave-active .award-card {
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
  transform: scale(0.94);
  opacity: 0;
}

@keyframes award-in {
  from {
    transform: scale(0.6);
  }
  to {
    transform: scale(1);
  }
}

/* Temporal drop shadow — bursts wide, then settles to a resting glow. */
@keyframes award-glow {
  0% {
    box-shadow: 0 0 0 0 rgb(217 70 239 / 0);
  }
  35% {
    box-shadow: 0 30px 90px -10px rgb(217 70 239 / 0.75);
  }
  100% {
    box-shadow: 0 18px 50px -12px rgb(217 70 239 / 0.35);
  }
}
.award-card.grand {
  animation:
    award-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both,
    award-glow-grand 1.1s ease-out both;
}
@keyframes award-glow-grand {
  0% {
    box-shadow: 0 0 0 0 rgb(251 191 36 / 0);
  }
  35% {
    box-shadow: 0 36px 110px 0 rgb(251 191 36 / 0.85);
  }
  100% {
    box-shadow: 0 22px 64px -10px rgb(251 191 36 / 0.45);
  }
}

.award-icon {
  display: inline-block;
  animation: award-pop 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
}
@keyframes award-pop {
  0% {
    transform: scale(0.2) rotate(-14deg);
  }
  60% {
    transform: scale(1.25) rotate(8deg);
  }
  100% {
    transform: scale(1) rotate(0);
  }
}
</style>
