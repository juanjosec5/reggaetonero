<script setup lang="ts">
import { computed } from 'vue'

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
function loyaltyLabel(loyalty: number): { text: string; tone: string } {
  if (loyalty >= 75) return { text: 'Leal', tone: 'text-emerald-400' }
  if (loyalty >= 50) return { text: 'Firme', tone: 'text-neutral-300' }
  if (loyalty >= 25) return { text: 'Inquieto', tone: 'text-amber-400' }
  return { text: 'A punto de irse', tone: 'text-rose-400' }
}

const rows = computed(() =>
  (Object.keys(ROLE_LABELS) as TeamRole[]).map((role) => {
    const member = props.team[role]
    return {
      role,
      label: ROLE_LABELS[role],
      name: member?.name ?? 'Vacante',
      filled: Boolean(member),
      loyalty: member ? loyaltyLabel(member.loyalty) : null,
    }
  }),
)
</script>

<template>
  <section class="rounded-2xl bg-neutral-900/60 p-4 ring-1 ring-white/5">
    <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Equipo</h2>
    <ul class="flex flex-col gap-2">
      <li v-for="row in rows" :key="row.role" class="flex items-center justify-between gap-3">
        <span class="text-xs text-neutral-500">{{ row.label }}</span>
        <span class="flex items-center gap-2">
          <span class="text-sm" :class="row.filled ? 'text-neutral-100' : 'text-neutral-600'">{{ row.name }}</span>
          <span v-if="row.loyalty" class="text-xs font-medium" :class="row.loyalty.tone">· {{ row.loyalty.text }}</span>
        </span>
      </li>
      <li v-if="team.label" class="flex items-center justify-between gap-3 border-t border-white/5 pt-2">
        <span class="text-xs text-neutral-500">Sello</span>
        <span class="text-sm text-neutral-100">{{ team.label.name }}</span>
      </li>
    </ul>
  </section>
</template>
