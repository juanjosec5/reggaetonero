<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import ReleaseCard from '@/components/ReleaseCard.vue'
import { getEventById } from '@/data/events'
import { useCareerStore } from '@/stores/career'

const router = useRouter()
const store = useCareerStore()

onMounted(() => {
  if (!store.career) {
    const loaded = store.load()
    if (!loaded) router.replace('/')
  }
})

const years = computed(() => [...(store.career?.history ?? [])].reverse())

function eventTitle(eventId?: string): string | undefined {
  return eventId ? getEventById(eventId)?.title : undefined
}
</script>

<template>
  <main v-if="store.career" class="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 p-6">
    <header class="flex items-center gap-3">
      <button type="button" class="text-sm text-neutral-400" @click="router.back()">← Atrás</button>
      <h1 class="text-lg font-semibold text-neutral-50">Historial</h1>
    </header>

    <div class="flex flex-col gap-4">
      <article
        v-for="entry in years"
        :key="entry.year"
        class="flex flex-col gap-2 rounded-2xl bg-neutral-900/60 p-4 ring-1 ring-white/5"
      >
        <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Año {{ entry.year }} · {{ entry.age }} años
        </p>

        <div v-if="entry.releases.length > 0" class="flex flex-col gap-2">
          <ReleaseCard v-for="(release, i) in entry.releases" :key="i" :release="release" />
        </div>

        <div v-if="entry.eventId" class="rounded-xl bg-neutral-800/60 px-3 py-2">
          <p class="text-xs text-neutral-300">{{ eventTitle(entry.eventId) }}</p>
          <p v-if="entry.choiceTaken" class="mt-1 text-xs font-medium text-fuchsia-400">
            → {{ entry.choiceTaken }}
          </p>
        </div>
      </article>
    </div>
  </main>
</template>
