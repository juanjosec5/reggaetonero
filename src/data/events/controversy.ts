import type { CareerEvent } from '@/types/career'

export const CONTROVERSY_EVENTS: CareerEvent[] = [
  {
    id: 'controversy_leaked_demo',
    category: 'controversy',
    title: 'Se filtró una maqueta sin terminar',
    description: 'Una versión sin terminar de una canción tuya se filtró en redes.',
    visibleRisk: 'high',
    condition: (c) => c.stats.fame >= 20,
    weight: () => 3,
    choices: [
      {
        text: 'Terminarla rápido y lanzarla oficialmente',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: 3, max: 8 },
          { target: 'stats.catalogStrength', min: -2, max: 3 },
        ],
      },
      {
        text: 'No decir nada y dejar que pase',
        style: 'safe',
        effects: [{ target: 'stats.credibility', min: -3, max: 1 }],
      },
      {
        text: 'Hablar públicamente del incidente',
        style: 'ambitious',
        effects: [
          { target: 'stats.fame', min: 2, max: 6 },
          { target: 'hiddenTraits.ego', min: 1, max: 3 },
        ],
        delayedEffects: [{ eventId: 'controversy_feud_escalation', triggerYear: 1 }],
      },
    ],
  },
  {
    id: 'controversy_rival_feud',
    category: 'controversy',
    title: 'Un rival te tira indirectas',
    description: 'Otro artista lleva semanas mencionándote en indirectas y entrevistas.',
    visibleRisk: 'medium',
    condition: (c) => c.stats.fame >= 25,
    weight: () => 3,
    choices: [
      {
        text: 'Responder con una canción',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: 6, max: 14 },
          { target: 'stats.credibility', min: -4, max: 2 },
        ],
      },
      {
        text: 'Ignorarlo completamente',
        style: 'safe',
        effects: [{ target: 'hiddenTraits.patience', min: 2, max: 5 }],
      },
      {
        text: 'Resolverlo en privado',
        style: 'loyal',
        effects: [{ target: 'hiddenTraits.resilience', min: 1, max: 4 }],
      },
    ],
  },
  {
    id: 'controversy_feud_escalation',
    category: 'controversy',
    title: 'El incidente sigue coleando',
    description: 'Todavía te preguntan por lo que dijiste hace un tiempo.',
    visibleRisk: 'low',
    condition: () => true,
    weight: () => 3,
    choices: [
      {
        text: 'Dejarlo atrás en silencio',
        style: 'safe',
        effects: [{ target: 'stats.credibility', min: 1, max: 4 }],
      },
      {
        text: 'Usarlo para seguir generando ruido',
        style: 'commercial',
        effects: [{ target: 'stats.hype', min: 3, max: 7 }],
      },
    ],
  },
]
