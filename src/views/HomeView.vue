<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppButton from '@/components/ui/AppButton.vue'
import { useCareerStore } from '@/stores/career'

const router = useRouter()
const store = useCareerStore()
const hasSave = ref(false)

onMounted(() => {
  hasSave.value = store.hasSave()
})

function continueCareer() {
  store.load()
  router.push('/career')
}

function newCareer() {
  router.push('/create')
}
</script>

<template>
  <main
    class="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-10 p-6 text-center"
  >
    <div class="flex flex-col items-center gap-3">
      <h1
        class="chrome display -tracking-[0.03em] text-[clamp(2.1rem,11vw,3.6rem)] [filter:drop-shadow(0_4px_18px_rgb(var(--palette-accent)/0.5))]"
      >
        REGGAETONERO
      </h1>
      <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan">
        Simulador de carrera musical
      </p>
    </div>

    <div class="flex w-full max-w-xs flex-col gap-3">
      <AppButton variant="primary" block @click="newCareer">Empezar carrera nueva</AppButton>
      <AppButton v-if="hasSave" variant="secondary" block @click="continueCareer">
        Continuar carrera
      </AppButton>
    </div>
  </main>
</template>
