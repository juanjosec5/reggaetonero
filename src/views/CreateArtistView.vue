<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

import AppButton from '@/components/ui/AppButton.vue'
import { ORIGINS } from '@/data/origins'
import { useCareerStore } from '@/stores/career'

const router = useRouter()
const store = useCareerStore()

const form = reactive({
  stageName: '',
  country: '',
})

const canStart = computed(() => form.stageName.trim().length > 0 && form.country !== '')

function startCareer() {
  if (!canStart.value) return
  const seed = Math.floor(Date.now() % 1_000_000)
  store.startCareer({ stageName: form.stageName.trim(), country: form.country }, seed)
  router.push('/career')
}
</script>

<template>
  <main class="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 p-6">
    <div class="flex items-center gap-3">
      <button type="button" class="text-sm text-ink-subtle hover:text-ink" @click="router.push('/')">
        ← Atrás
      </button>
    </div>

    <section class="flex flex-col gap-5">
      <div class="flex flex-col gap-1">
        <h1 class="display text-2xl text-ink">¿Quién eres?</h1>
        <p class="text-xs text-ink-faint">
          Lo demás lo defines soltando música y tomando decisiones.
        </p>
      </div>

      <label class="flex flex-col gap-1.5">
        <span class="eyebrow">Nombre artístico</span>
        <input
          v-model="form.stageName"
          type="text"
          placeholder="MC Ejemplo"
          class="rounded-tile bg-surface-2 px-4 py-3 text-sm text-ink outline-none ring-1 ring-hairline placeholder:text-ink-faint focus:ring-accent"
        />
      </label>

      <div class="flex flex-col gap-1.5">
        <span class="eyebrow">País</span>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="origin in ORIGINS"
            :key="origin.country"
            type="button"
            class="flex items-center gap-2 rounded-tile px-3 py-2.5 text-left text-sm ring-1 transition"
            :class="
              form.country === origin.country
                ? 'bg-accent/12 text-accent ring-accent/60'
                : 'bg-surface-2 text-ink-muted ring-hairline hover:ring-hairline-strong'
            "
            @click="form.country = origin.country"
          >
            <span class="text-lg leading-none">{{ origin.flag }}</span>
            <span class="leading-tight">{{ origin.country }}</span>
          </button>
        </div>
      </div>

      <p class="text-xs text-ink-faint">Empiezas a los 22. La carrera llega hasta los 35.</p>
    </section>

    <div class="mt-8">
      <AppButton variant="primary" block :disabled="!canStart" @click="startCareer">
        Empezar carrera
      </AppButton>
    </div>
  </main>
</template>
