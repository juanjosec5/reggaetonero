<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { AWARD_ICON } from '@/data/awards'
import type { CareerAward } from '@/types/career'

const props = defineProps<{ award: CareerAward }>()
const emit = defineEmits<{ done: [] }>()

const show = ref(false)

onMounted(() => {
  show.value = true
  const hold = props.award.grand ? 2600 : 1800
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
      class="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4"
      @click="show = false"
    >
      <div
        class="pointer-events-auto flex flex-col items-center gap-2 rounded-3xl px-8 py-6 text-center ring-1 backdrop-blur"
        :class="
          award.grand
            ? 'bg-amber-400/15 ring-amber-300/40 shadow-[0_0_40px_-8px_rgba(251,191,36,0.6)]'
            : 'bg-neutral-900/90 ring-white/10'
        "
      >
        <span class="award-icon text-5xl">{{ AWARD_ICON[award.kind] }}</span>
        <p class="text-[10px] uppercase tracking-widest" :class="award.grand ? 'text-amber-300' : 'text-fuchsia-400'">
          {{ award.grand ? 'Hito de carrera' : 'Nuevo logro' }}
        </p>
        <p class="text-base font-bold text-neutral-50">{{ award.title }}</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.award-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.award-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
.award-enter-from {
  opacity: 0;
  transform: translateY(-16px) scale(0.85);
}
.award-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.96);
}

.award-icon {
  display: inline-block;
  animation: award-pop 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes award-pop {
  0% {
    transform: scale(0.3) rotate(-12deg);
  }
  60% {
    transform: scale(1.2) rotate(6deg);
  }
  100% {
    transform: scale(1) rotate(0);
  }
}
</style>
