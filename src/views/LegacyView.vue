<script setup lang="ts">
import html2canvas from 'html2canvas'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import LegacyCard from '@/components/LegacyCard.vue'
import { useCareerStore } from '@/stores/career'

const router = useRouter()
const store = useCareerStore()
const cardRef = ref<InstanceType<typeof LegacyCard> | null>(null)
const sharing = ref(false)

onMounted(() => {
  if (!store.career) {
    const loaded = store.load()
    if (!loaded) {
      router.replace('/')
      return
    }
  }
  if (!store.isRetired) router.replace('/career')
})

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'reggaetonero.png'
  a.click()
  URL.revokeObjectURL(url)
}

async function shareCard() {
  const el = cardRef.value?.$el as HTMLElement | undefined
  if (!el) return

  sharing.value = true
  try {
    const canvas = await html2canvas(el, { backgroundColor: null, scale: 2 })
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!blob) return

    const file = new File([blob], 'reggaetonero.png', { type: 'image/png' })
    const nav = navigator as Navigator & { canShare?: (data: { files: File[] }) => boolean }

    if (nav.share && nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], title: 'Mi carrera en Reggaetonero' })
    } else {
      downloadBlob(blob)
    }
  } finally {
    sharing.value = false
  }
}

function newCareer() {
  store.clearSave()
  router.push('/create')
}
</script>

<template>
  <main v-if="store.career" class="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-6 p-6">
    <LegacyCard ref="cardRef" :career="store.career" />

    <div class="flex w-full flex-col gap-3">
      <button
        type="button"
        class="w-full rounded-2xl bg-fuchsia-500 px-4 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        :disabled="sharing"
        @click="shareCard"
      >
        {{ sharing ? 'Preparando...' : 'Compartir carta de legado' }}
      </button>
      <button
        type="button"
        class="w-full rounded-2xl bg-neutral-800 px-4 py-3.5 text-sm font-semibold text-neutral-100"
        @click="newCareer"
      >
        Empezar otra carrera
      </button>
    </div>
  </main>
</template>
