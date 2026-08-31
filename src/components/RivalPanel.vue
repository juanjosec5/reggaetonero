<script setup lang="ts">
import { computed } from 'vue'

import Panel from '@/components/ui/Panel.vue'
import { TONE_TEXT, type Tone } from '@/components/ui/tones'
import type { Rival } from '@/types/career'

const props = defineProps<{ rivals: Rival[]; playerFame: number }>()

// Descriptive only — no raw fame/relationship numbers are rendered.
function standingLabel(gap: number): { text: string; tone: Tone } {
  if (gap > 18) return { text: 'Por encima de ti', tone: 'bad' }
  if (gap < -18) return { text: 'Por debajo de ti', tone: 'good' }
  return { text: 'A tu nivel', tone: 'warn' }
}

function relationshipLabel(value: number): { text: string; tone: Tone } {
  if (value <= -40) return { text: 'Beef', tone: 'bad' }
  if (value <= -12) return { text: 'Tensión', tone: 'warn' }
  if (value >= 40) return { text: 'Buena onda', tone: 'good' }
  return { text: 'Neutral', tone: 'neutral' }
}

// Only rivals a decision has actually put in front of the player.
const rows = computed(() =>
  props.rivals
    .filter((rival) => rival.discovered)
    .sort((a, b) => b.fame - a.fame)
    .map((rival) => ({
      id: rival.id,
      name: rival.name,
      style: rival.style,
      standing: standingLabel(rival.fame - props.playerFame),
      relationship: relationshipLabel(rival.relationship),
    })),
)
</script>

<template>
  <Panel v-if="rows.length" as="section" heading="Rivales">
    <ul class="flex flex-col gap-3">
      <li v-for="row in rows" :key="row.id" class="flex flex-col gap-0.5">
        <div class="flex items-center justify-between gap-3">
          <span class="text-sm font-medium text-ink">{{ row.name }}</span>
          <span class="text-xs font-medium" :class="TONE_TEXT[row.standing.tone]">
            {{ row.standing.text }}
          </span>
        </div>
        <div class="flex items-center justify-between gap-3">
          <span class="truncate text-xs text-ink-subtle">{{ row.style }}</span>
          <span class="shrink-0 text-xs font-medium" :class="TONE_TEXT[row.relationship.tone]">
            {{ row.relationship.text }}
          </span>
        </div>
      </li>
    </ul>
  </Panel>
</template>
