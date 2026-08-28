<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

import { ORIGINS } from '@/data/origins'
import { useCareerStore } from '@/stores/career'

const router = useRouter()
const store = useCareerStore()

const form = reactive({
  stageName: '',
  country: '',
  age: 19,
})

const canStart = computed(
  () => form.stageName.trim().length > 0 && form.country !== '' && form.age >= 13 && form.age <= 60,
)

function startCareer() {
  if (!canStart.value) return
  const seed = Math.floor(Date.now() % 1_000_000)
  store.startCareer({ stageName: form.stageName.trim(), country: form.country, age: form.age }, seed)
  router.push('/career')
}
</script>

<template>
  <main class="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 p-6">
    <div class="flex items-center gap-3">
      <button type="button" class="text-sm text-neutral-400" @click="router.push('/')">← Atrás</button>
    </div>

    <section class="flex flex-col gap-5">
      <div class="flex flex-col gap-1">
        <h1 class="text-xl font-semibold text-neutral-50">¿Quién eres?</h1>
        <p class="text-xs text-neutral-500">Lo demás lo defines soltando música y tomando decisiones.</p>
      </div>

      <label class="flex flex-col gap-1.5">
        <span class="text-xs text-neutral-400">Nombre artístico</span>
        <input
          v-model="form.stageName"
          type="text"
          placeholder="MC Ejemplo"
          class="rounded-xl bg-neutral-900 px-4 py-3 text-sm text-neutral-100 outline-none ring-1 ring-white/10 focus:ring-fuchsia-500"
        />
      </label>

      <div class="flex flex-col gap-1.5">
        <span class="text-xs text-neutral-400">País</span>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="origin in ORIGINS"
            :key="origin.country"
            type="button"
            class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm ring-1 transition"
            :class="
              form.country === origin.country
                ? 'bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-500'
                : 'bg-neutral-900 text-neutral-200 ring-white/10 hover:bg-neutral-800'
            "
            @click="form.country = origin.country"
          >
            <span class="text-lg leading-none">{{ origin.flag }}</span>
            <span class="leading-tight">{{ origin.country }}</span>
          </button>
        </div>
      </div>

      <label class="flex flex-col gap-1.5">
        <span class="text-xs text-neutral-400">Edad</span>
        <input
          v-model.number="form.age"
          type="number"
          min="13"
          max="60"
          class="rounded-xl bg-neutral-900 px-4 py-3 text-sm text-neutral-100 outline-none ring-1 ring-white/10"
        />
      </label>
    </section>

    <div class="mt-auto pt-4">
      <button
        type="button"
        class="w-full rounded-2xl bg-fuchsia-500 px-4 py-3.5 text-sm font-semibold text-white disabled:opacity-40"
        :disabled="!canStart"
        @click="startCareer"
      >
        Empezar carrera
      </button>
    </div>
  </main>
</template>
