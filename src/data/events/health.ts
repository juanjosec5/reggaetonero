import type { CareerEvent } from '@/types/career'

export const HEALTH_EVENTS: CareerEvent[] = [
  {
    id: 'health_studio_exhaustion',
    category: 'health',
    title: 'Llevas meses sin parar en el estudio',
    description: 'No recuerdas el último día libre. El equipo empieza a preocuparse.',
    visibleRisk: 'medium',
    condition: (c) => c.record.releases >= 3 && c.year >= 3,
    weight: () => 2,
    choices: [
      {
        text: 'Tomarte un descanso real',
        style: 'safe',
        effects: [
          { target: 'stats.hype', min: -5, max: -1 },
          { target: 'hiddenTraits.discipline', min: 2, max: 5 },
          { target: 'hiddenTraits.resilience', min: 2, max: 5 },
        ],
      },
      {
        text: 'Seguir, el momento es ahora',
        style: 'ambitious',
        effects: [
          { target: 'attributes.writing', min: 1, max: 4 },
          { target: 'hiddenTraits.resilience', min: -4, max: -1 },
        ],
        delayedEffects: [{ eventId: 'health_collapse', triggerYear: 2 }],
      },
    ],
  },
  {
    id: 'health_collapse',
    category: 'health',
    title: 'Tu cuerpo dijo basta',
    description: 'Te desplomaste antes de un show. Los médicos hablan de agotamiento extremo.',
    visibleRisk: 'high',
    // Follow-up only: reached through a delayed effect, never rolled on its own.
    condition: () => false,
    weight: () => 0,
    oncePerCareer: true,
    choices: [
      {
        text: 'Parar todo y recuperarte bien',
        style: 'safe',
        effects: [
          { target: 'stats.hype', min: -12, max: -4 },
          { target: 'stats.livePower', min: -8, max: -3 },
          { target: 'hiddenTraits.resilience', min: 4, max: 9 },
          { target: 'hiddenTraits.patience', min: 3, max: 6 },
        ],
      },
      {
        text: 'Volver antes de tiempo',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: -3, max: 2 },
          { target: 'hiddenTraits.resilience', min: -6, max: -2 },
          { target: 'attributes.performance', min: -5, max: -1 },
        ],
      },
    ],
  },
  {
    id: 'health_party_lifestyle',
    category: 'health',
    title: 'La fiesta se está volviendo el trabajo',
    description: 'Cada noche hay algo, y cada mañana cuesta más levantarse al estudio.',
    visibleRisk: 'medium',
    condition: (c) => c.stats.fame >= 30 && c.hiddenTraits.discipline < 55,
    weight: () => 3,
    choices: [
      {
        text: 'Poner límites y rodearte de otra gente',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.discipline', min: 4, max: 9 },
          { target: 'stats.hype', min: -3, max: 1 },
        ],
      },
      {
        text: 'Dejarte llevar, es parte del personaje',
        style: 'creative',
        effects: [
          { target: 'stats.hype', min: 2, max: 7 },
          { target: 'hiddenTraits.discipline', min: -6, max: -2 },
          { target: 'hiddenTraits.authenticity', min: 1, max: 4 },
        ],
        delayedEffects: [{ eventId: 'health_wakeup_call', triggerYear: 3 }],
      },
    ],
  },
  {
    id: 'health_wakeup_call',
    category: 'health',
    title: 'Un susto de verdad',
    description: 'Alguien cercano no la contó. De repente todo se ve distinto.',
    visibleRisk: 'high',
    // Follow-up only: reached through a delayed effect, never rolled on its own.
    condition: () => false,
    weight: () => 0,
    choices: [
      {
        text: 'Limpiar tu vida y contarlo en tu música',
        style: 'creative',
        effects: [
          { target: 'hiddenTraits.discipline', min: 6, max: 12 },
          { target: 'attributes.writing', min: 3, max: 8 },
          { target: 'stats.credibility', min: 3, max: 8 },
        ],
      },
      {
        text: 'Guardar el dolor y seguir igual',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.resilience', min: -4, max: 2 },
          { target: 'stats.hype', min: -2, max: 3 },
        ],
      },
    ],
  },
  {
    id: 'health_grind_catches_up',
    category: 'health',
    title: 'El ritmo te está pasando factura',
    description: 'Entre estudio, promo y fechas llevas meses durmiendo cuatro horas. El equipo médico te dice que pares antes de que algo pare por ti.',
    visibleRisk: 'medium',
    condition: (c) => c.year >= 4 && c.year <= 10 && c.stats.hype >= 25,
    weight: () => 3,
    choices: [
      {
        text: 'Tomarte un trimestre real de descanso',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.resilience', min: 3, max: 7 },
          { target: 'stats.hype', min: -8, max: -3 },
          { target: 'attributes.talent', min: 1, max: 3 },
        ],
      },
      {
        text: 'Bajar el ritmo solo un poco',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.discipline', min: 1, max: 4 },
          { target: 'stats.hype', min: -3, max: 0 },
        ],
      },
      {
        text: 'Aguantar, el momento es ahora',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: 2, max: 6 },
          { target: 'hiddenTraits.resilience', min: -5, max: -1 },
          { target: 'hiddenTraits.ambition', min: 1, max: 3 },
        ],
      },
    ],
  },
]
