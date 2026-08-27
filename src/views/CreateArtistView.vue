<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import OfferCard from '@/components/OfferCard.vue'
import { ARCHETYPES } from '@/data/archetypes'
import { EMPHASES } from '@/data/emphasis'
import type { EmphasisId } from '@/data/emphasis'
import { ORIGINS } from '@/data/origins'
import type { OpportunityId } from '@/data/opportunities'
import { OPPORTUNITIES } from '@/data/opportunities'
import { useCareerStore } from '@/stores/career'
import type { ArtistArchetype, Genre } from '@/types/career'

const router = useRouter()
const store = useCareerStore()

const step = ref(1)
const TOTAL_STEPS = 4

const GENRES: { id: Genre; label: string }[] = [
  { id: 'reggaeton', label: 'Reguetón' },
  { id: 'perreo', label: 'Perreo' },
  { id: 'trap', label: 'Trap' },
  { id: 'urbano', label: 'Urbano' },
  { id: 'experimental', label: 'Experimental' },
]

const form = reactive({
  stageName: '',
  country: ORIGINS[0]!.country,
  city: ORIGINS[0]!.cities[0]!,
  age: 19,
  genre: 'reggaeton' as Genre,
  archetype: undefined as ArtistArchetype | undefined,
  emphasis: undefined as EmphasisId | undefined,
  opportunity: undefined as OpportunityId | undefined,
})

const countryChosen = ref(false)

const citiesForCountry = computed(() => ORIGINS.find((o) => o.country === form.country)?.cities ?? [])

function selectCountry(country: string) {
  form.country = country
  form.city = ORIGINS.find((o) => o.country === country)?.cities[0] ?? ''
  countryChosen.value = true
}

const canContinue = computed(() => {
  if (step.value === 1) return form.stageName.trim().length > 0 && form.age >= 13 && form.age <= 60
  if (step.value === 2) return form.archetype !== undefined
  if (step.value === 3) return form.emphasis !== undefined
  if (step.value === 4) return form.opportunity !== undefined
  return false
})

function next() {
  if (!canContinue.value) return
  if (step.value < TOTAL_STEPS) {
    step.value += 1
    return
  }
  startCareer()
}

function back() {
  if (step.value > 1) step.value -= 1
  else router.push('/')
}

function startCareer() {
  if (!form.archetype || !form.emphasis || !form.opportunity) return
  const seed = Math.floor(Date.now() % 1_000_000)
  store.startCareer(
    {
      stageName: form.stageName.trim(),
      country: form.country,
      city: form.city,
      age: form.age,
      genre: form.genre,
      archetype: form.archetype,
    },
    seed,
    { emphasis: form.emphasis, opportunity: form.opportunity },
  )
  router.push('/career')
}
</script>

<template>
  <main class="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 p-6">
    <div class="flex items-center gap-3">
      <button type="button" class="text-sm text-neutral-400" @click="back">← Atrás</button>
      <div class="flex flex-1 gap-1">
        <span
          v-for="s in TOTAL_STEPS"
          :key="s"
          class="h-1 flex-1 rounded-full"
          :class="s <= step ? 'bg-fuchsia-500' : 'bg-neutral-800'"
        />
      </div>
    </div>

    <!-- Step 1: Identity -->
    <section v-if="step === 1" class="flex flex-col gap-4">
      <h1 class="text-xl font-semibold text-neutral-50">¿Quién eres?</h1>

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
            @click="selectCountry(origin.country)"
          >
            <span class="text-lg leading-none">{{ origin.flag }}</span>
            <span class="leading-tight">{{ origin.country }}</span>
          </button>
        </div>
      </div>

      <div v-if="countryChosen" class="flex flex-col gap-1.5">
        <span class="text-xs text-neutral-400">Ciudad</span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="city in citiesForCountry"
            :key="city"
            type="button"
            class="rounded-full px-3.5 py-2 text-sm ring-1 transition"
            :class="form.city === city ? 'bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-500' : 'text-neutral-300 ring-white/10 hover:bg-neutral-800'"
            @click="form.city = city"
          >
            {{ city }}
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

      <div class="flex flex-col gap-1.5">
        <span class="text-xs text-neutral-400">Tipo de reguetonero</span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="g in GENRES"
            :key="g.id"
            type="button"
            class="rounded-full px-3.5 py-2 text-sm ring-1 transition"
            :class="form.genre === g.id ? 'bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-500' : 'text-neutral-300 ring-white/10 hover:bg-neutral-800'"
            @click="form.genre = g.id"
          >
            {{ g.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Step 2: Archetype -->
    <section v-else-if="step === 2" class="flex flex-col gap-4">
      <h1 class="text-xl font-semibold text-neutral-50">¿Qué tipo de artista eres?</h1>
      <div class="flex flex-col gap-3">
        <button
          v-for="a in ARCHETYPES"
          :key="a.id"
          type="button"
          class="flex flex-col gap-1 rounded-2xl px-4 py-3.5 text-left ring-1 transition"
          :class="form.archetype === a.id ? 'bg-fuchsia-500/10 ring-fuchsia-500' : 'bg-neutral-900 ring-white/10'"
          @click="form.archetype = a.id"
        >
          <span class="text-sm font-semibold text-neutral-50">{{ a.label }}</span>
          <span class="text-xs text-neutral-400">{{ a.description }}</span>
        </button>
      </div>
    </section>

    <!-- Step 3: Emphasis -->
    <section v-else-if="step === 3" class="flex flex-col gap-4">
      <h1 class="text-xl font-semibold text-neutral-50">¿En qué te quieres enfocar?</h1>
      <div class="flex flex-col gap-3">
        <button
          v-for="e in EMPHASES"
          :key="e.id"
          type="button"
          class="flex flex-col gap-1 rounded-2xl px-4 py-3.5 text-left ring-1 transition"
          :class="form.emphasis === e.id ? 'bg-fuchsia-500/10 ring-fuchsia-500' : 'bg-neutral-900 ring-white/10'"
          @click="form.emphasis = e.id"
        >
          <span class="text-sm font-semibold text-neutral-50">{{ e.title }}</span>
          <span class="text-xs text-neutral-400">{{ e.description }}</span>
        </button>
      </div>
    </section>

    <!-- Step 4: First opportunity -->
    <section v-else class="flex flex-col gap-4">
      <h1 class="text-xl font-semibold text-neutral-50">Tu primera oportunidad</h1>
      <div class="flex flex-col gap-3">
        <OfferCard
          v-for="o in OPPORTUNITIES"
          :key="o.id"
          :title="o.title"
          :description="o.description"
          :risk="o.visibleRisk"
          :selected="form.opportunity === o.id"
          @select="form.opportunity = o.id"
        />
      </div>
    </section>

    <div class="mt-auto pt-4">
      <button
        type="button"
        class="w-full rounded-2xl bg-fuchsia-500 px-4 py-3.5 text-sm font-semibold text-white disabled:opacity-40"
        :disabled="!canContinue"
        @click="next"
      >
        {{ step < TOTAL_STEPS ? 'Continuar' : 'Empezar carrera' }}
      </button>
    </div>
  </main>
</template>
