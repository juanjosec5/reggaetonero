<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import Panel from '@/components/ui/Panel.vue'
import type { CareerChoice, CareerEvent } from '@/types/career'

defineProps<{ event: CareerEvent; resolved?: boolean; choiceTaken?: string }>()
const emit = defineEmits<{ choose: [choice: CareerChoice] }>()
</script>

<template>
  <Panel as="div" :glow="!resolved" class="flex w-full flex-col gap-5">
    <h2 class="display text-xl text-ink">{{ event.title }}</h2>

    <p class="text-sm leading-relaxed text-ink-muted">{{ event.description }}</p>

    <div v-if="resolved" class="rounded-tile bg-surface-2 px-3 py-2 ring-1 ring-hairline">
      <p class="text-xs font-semibold text-accent">→ {{ choiceTaken }}</p>
    </div>

    <div v-else class="flex flex-col gap-3">
      <AppButton
        v-for="choice in event.choices"
        :key="choice.text"
        variant="choice"
        block
        @click="emit('choose', choice)"
      >
        {{ choice.text }}
      </AppButton>
    </div>
  </Panel>
</template>
