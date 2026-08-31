<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{ dir: 'up' | 'down'; tier: number }>()
const emit = defineEmits<{ done: [] }>()

const show = ref(false)

// The star that changes: the one just earned (up) or just lost (down).
const shiftingIndex = computed(() => (props.dir === 'up' ? props.tier - 1 : props.tier))

// Which of the five stars render filled once the dust settles.
const filled = computed(() => Array.from({ length: 5 }, (_, i) => i < props.tier))

// Particles — a ring bursting outward for a gain, a scatter drifting down for a loss.
const particles = computed(() => {
  if (props.dir === 'up') {
    const jitter = [0, 7, -5, 3, -8, 6, -3, 9]
    const spread = [110, 140, 165]
    return Array.from({ length: 22 }, (_, i) => ({
      i,
      angle: (360 / 22) * i + (jitter[i % jitter.length] ?? 0),
      distance: spread[i % spread.length]!,
      drift: 0,
      delay: i * 14,
    }))
  }
  const drifts = [-90, -55, -25, 0, 25, 55, 90]
  return Array.from({ length: 16 }, (_, i) => ({
    i,
    angle: 0,
    distance: 0,
    drift: (drifts[i % drifts.length] ?? 0) + (i % 2 ? 8 : -8),
    delay: i * 22,
  }))
})

onMounted(() => {
  show.value = true
  const hold = props.dir === 'up' ? 2200 : 2800
  setTimeout(() => (show.value = false), hold)
})

function afterLeave() {
  emit('done')
}
</script>

<template>
  <Transition name="shift" appear @after-leave="afterLeave">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-scrim px-6 backdrop-blur-[2px]"
      @click="show = false"
    >
      <div
        class="shift-card relative rounded-3xl px-10 py-9 backdrop-blur-md"
        :class="dir === 'up' ? 'up' : 'down'"
      >
        <div class="particles" aria-hidden="true">
          <span
            v-for="p in particles"
            :key="p.i"
            class="particle"
            :style="{
              '--angle': p.angle + 'deg',
              '--distance': p.distance + 'px',
              '--drift': p.drift + 'px',
              '--delay': p.delay + 'ms',
            }"
          />
        </div>

        <div class="flex gap-1.5">
          <span
            v-for="(isFilled, i) in filled"
            :key="i"
            class="star text-5xl leading-none"
            :class="[
              isFilled ? 'text-star' : 'text-star-empty',
              i === shiftingIndex ? (dir === 'up' ? 'star-gain' : 'star-lose') : '',
            ]"
            >★</span
          >
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Backdrop fade */
.shift-enter-active {
  transition: opacity 0.25s ease;
}
.shift-leave-active {
  transition: opacity 0.45s ease;
}
.shift-enter-from,
.shift-leave-to {
  opacity: 0;
}

.shift-card {
  background: rgb(var(--palette-bg-deep) / 0.95);
  border: 1px solid rgb(var(--shift-accent) / 0.35);
}
.shift-card.up {
  --shift-accent: var(--palette-win);
  animation:
    card-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both,
    card-glow-up 1s ease-out both;
}
.shift-card.down {
  --shift-accent: var(--palette-loss);
  animation:
    card-slump 1s cubic-bezier(0.33, 0, 0.4, 1) both,
    card-glow-down 1.3s ease-out both;
}
.shift-leave-active .shift-card {
  transition:
    transform 0.45s ease,
    opacity 0.45s ease;
  opacity: 0;
}
.shift-leave-active .shift-card.up {
  transform: scale(0.94);
}
.shift-leave-active .shift-card.down {
  transform: translateY(14px);
}

@keyframes card-in {
  from {
    transform: scale(0.6);
  }
  to {
    transform: scale(1);
  }
}
@keyframes card-slump {
  0% {
    transform: translateY(-8px);
    opacity: 0.4;
  }
  60% {
    transform: translateY(6px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes card-glow-up {
  0% {
    box-shadow: 0 0 0 0 rgb(var(--palette-win) / 0);
  }
  35% {
    box-shadow: 0 32px 100px 0 rgb(var(--palette-win) / 0.8);
  }
  100% {
    box-shadow: 0 20px 60px -12px rgb(var(--palette-win) / 0.4);
  }
}
@keyframes card-glow-down {
  0% {
    box-shadow: 0 0 0 0 rgb(var(--palette-loss) / 0);
  }
  40% {
    box-shadow: 0 30px 90px 0 rgb(var(--palette-loss) / 0.55);
  }
  100% {
    box-shadow: 0 18px 54px -14px rgb(var(--palette-loss) / 0.3);
  }
}

/* The star that just changed */
.star {
  display: inline-block;
  transform-origin: center;
}
.star-gain {
  color: rgb(var(--palette-win));
  animation: star-pop 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}
@keyframes star-pop {
  0% {
    transform: scale(0) rotate(-25deg);
    opacity: 0;
  }
  55% {
    transform: scale(1.35) rotate(10deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0);
  }
}
.star-lose {
  animation: star-drop 1.1s cubic-bezier(0.4, 0, 0.7, 1) 0.2s both;
}
@keyframes star-drop {
  0% {
    color: rgb(var(--palette-star));
    transform: translateY(0) rotate(0) scale(1);
    opacity: 1;
    filter: saturate(1);
  }
  30% {
    color: rgb(var(--palette-loss));
    filter: saturate(0.4);
    transform: translateY(2px) rotate(-6deg) scale(0.96);
  }
  100% {
    color: rgb(var(--palette-star-empty));
    transform: translateY(46px) rotate(-32deg) scale(0.6);
    opacity: 0;
    filter: saturate(0);
  }
}

/* Particles */
.particles {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  overflow: visible;
}
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  background: rgb(var(--shift-accent));
  transform-origin: center;
}
.shift-card.up .particle {
  box-shadow: 0 0 6px 1px rgb(var(--shift-accent) / 0.7);
  animation: particle-burst 0.95s cubic-bezier(0.12, 0.8, 0.3, 1) var(--delay) both;
}
.shift-card.down .particle {
  opacity: 0.8;
  animation: particle-fall 1.5s ease-in var(--delay) both;
}
@keyframes particle-burst {
  0% {
    transform: rotate(var(--angle)) translateY(0) scale(1);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: rotate(var(--angle)) translateY(calc(var(--distance) * -1)) scale(0.3);
    opacity: 0;
  }
}
@keyframes particle-fall {
  0% {
    transform: translate(var(--drift), -24px) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: translate(var(--drift), 130px) scale(0.4);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .particles {
    display: none;
  }
  .shift-card,
  .shift-card.up,
  .shift-card.down,
  .star,
  .star-gain,
  .star-lose {
    animation: none;
  }
  .shift-enter-active,
  .shift-leave-active,
  .shift-leave-active .shift-card {
    transition: none;
  }
  /* keep the lost star from sitting in its filled state */
  .star-lose {
    color: rgb(var(--palette-star-empty));
    opacity: 0.4;
  }
}
</style>
