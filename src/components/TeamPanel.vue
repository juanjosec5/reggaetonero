<script setup lang="ts">
import { computed } from 'vue'

import Panel from '@/components/ui/Panel.vue'
import { TONE_TEXT, type Tone } from '@/components/ui/tones'
import type { Team, TeamRole } from '@/types/career'

const props = defineProps<{ team: Team }>()

const ROLE_LABELS: Record<TeamRole, string> = {
  manager: 'Mánager',
  producer: 'Productor',
  lawyer: 'Abogado',
  publicist: 'Prensa',
  bookingAgent: 'Agente de shows',
}

// Descriptive only — raw loyalty/skill numbers are never rendered.
function loyaltyLabel(loyalty: number): { text: string; tone: Tone } {
  if (loyalty >= 75) return { text: 'Leal', tone: 'good' }
  if (loyalty >= 50) return { text: 'Firme', tone: 'neutral' }
  if (loyalty >= 25) return { text: 'Inquieto', tone: 'warn' }
  return { text: 'A punto de irse', tone: 'bad' }
}

// Only roles that are actually filled - empty roles stay invisible until hired.
const rows = computed(() =>
  (Object.keys(ROLE_LABELS) as TeamRole[])
    .map((role) => ({ role, member: props.team[role] }))
    .filter((r): r is { role: TeamRole; member: NonNullable<typeof r.member> } => Boolean(r.member))
    .map(({ role, member }) => ({
      role,
      label: ROLE_LABELS[role],
      name: member.name,
      loyalty: loyaltyLabel(member.loyalty),
    })),
)
</script>

<template>
  <Panel v-if="rows.length || team.label" as="section" heading="Equipo">
    <ul class="flex flex-col gap-2">
      <li v-for="row in rows" :key="row.role" class="flex items-center justify-between gap-3">
        <span class="text-xs text-ink-subtle">{{ row.label }}</span>
        <span class="flex items-center gap-2">
          <span class="text-sm text-ink">{{ row.name }}</span>
          <span class="text-xs font-medium" :class="TONE_TEXT[row.loyalty.tone]">
            · {{ row.loyalty.text }}
          </span>
        </span>
      </li>
      <li
        v-if="team.label"
        class="flex items-center justify-between gap-3"
        :class="{ 'border-t border-hairline pt-2': rows.length }"
      >
        <span class="text-xs text-ink-subtle">Sello</span>
        <span class="text-sm text-ink">{{ team.label.name }}</span>
      </li>
    </ul>
  </Panel>
</template>
