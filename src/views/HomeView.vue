<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

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
  <main class="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-8 p-6 text-center">
    <div>
      <h1 class="text-4xl font-black tracking-tight text-neutral-50">REGGAETONERO</h1>
      <p class="mt-2 text-sm text-neutral-400">Simulador de carrera musical</p>
    </div>

    <div class="flex w-full max-w-xs flex-col gap-3">
      <button
        type="button"
        class="w-full rounded-2xl bg-fuchsia-500 px-4 py-3.5 text-sm font-semibold text-white active:scale-[0.98]"
        @click="newCareer"
      >
        Empezar carrera nueva
      </button>
      <button
        v-if="hasSave"
        type="button"
        class="w-full rounded-2xl bg-neutral-800 px-4 py-3.5 text-sm font-semibold text-neutral-100 active:scale-[0.98]"
        @click="continueCareer"
      >
        Continuar carrera
      </button>
    </div>
  </main>
</template>
