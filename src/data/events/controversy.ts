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
        // Rushing it out means nobody checked whether the loop was cleared.
        delayedEffects: [{ eventId: 'controversy_sample_lawsuit', triggerYear: 1 }],
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
    // Follow-up only: reached through a delayed effect, never rolled on its own.
    condition: () => false,
    weight: () => 0,
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
        delayedEffects: [{ eventId: 'controversy_feud_public', triggerYear: 1 }],
      },
    ],
  },
  {
    id: 'controversy_sample_lawsuit',
    category: 'controversy',
    title: 'Una productora te demandó',
    description:
      'El loop de esa canción que sacaste con prisa no estaba autorizado. Una productora chica con abogados grandes quiere su parte — y un ejemplo.',
    visibleRisk: 'high',
    condition: () => false, // Follow-up only: reached through a delayed effect.
    weight: () => 0,
    choices: [
      {
        text: 'Arreglar fuera de corte y pagar',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: -190, max: -80 },
          { target: 'stats.credibility', min: -4, max: -1 },
          { target: 'hiddenTraits.patience', min: 1, max: 4 },
        ],
      },
      {
        text: 'Pelearla — el beat lo cambiaste tú',
        style: 'ambitious',
        effects: [
          { target: 'finances.cash', min: -130, max: 20 },
          { target: 'stats.industryRespect', min: -8, max: 4 },
          { target: 'stats.hype', min: -6, max: 3 },
          { target: 'hiddenTraits.resilience', min: 2, max: 6 },
        ],
      },
    ],
  },
  {
    id: 'controversy_feud_public',
    category: 'controversy',
    title: 'El beef se salió de control',
    description:
      'Lo que empezó en indirectas ya llegó a la ceremonia: un empujón, cámaras encima, y un promotor grande que ahora no quiere a ninguno de los dos en su cartel.',
    visibleRisk: 'high',
    condition: () => false, // Follow-up only: reached through a delayed effect.
    weight: () => 0,
    choices: [
      {
        text: 'Bajar el tono y pedir que quede ahí',
        style: 'safe',
        effects: [
          { target: 'stats.credibility', min: 2, max: 6 },
          { target: 'stats.hype', min: -6, max: -1 },
          { target: 'stats.livePower', min: -6, max: -1 },
          { kind: 'rival', field: 'relationship', min: 3, max: 12 },
        ],
      },
      {
        text: 'Doblar la apuesta, esto vende',
        style: 'commercial',
        effects: [
          { target: 'stats.hype', min: 6, max: 16 },
          { target: 'stats.credibility', min: -6, max: 0 },
          { target: 'stats.industryRespect', min: -8, max: -2 },
          { kind: 'rival', field: 'relationship', min: -18, max: -6 },
        ],
      },
    ],
  },
  {
    id: 'controversy_old_post_resurfaces',
    category: 'controversy',
    title: 'Desentierran algo que publicaste hace años',
    description: 'Cuando eras un desconocido escribiste algo feo en redes. Ahora que te miran, alguien lo encontró y lo está moviendo.',
    visibleRisk: 'medium',
    condition: (c) => c.year >= 4 && c.stats.fame >= 30,
    weight: () => 3,
    choices: [
      {
        text: 'Disculparte de frente y sin excusas',
        style: 'safe',
        effects: [
          { target: 'stats.credibility', min: -4, max: 2 },
          { target: 'hiddenTraits.resilience', min: 2, max: 5 },
          { target: 'stats.hype', min: -3, max: 2 },
        ],
      },
      {
        text: 'Contextualizar: eras otra persona',
        style: 'ambitious',
        effects: [
          { target: 'stats.credibility', min: -6, max: 1 },
          { target: 'stats.hype', min: 1, max: 5 },
        ],
      },
      {
        text: 'No decir nada y dejar que se apague',
        style: 'safe',
        effects: [
          { target: 'stats.hype', min: -5, max: -1 },
          { target: 'hiddenTraits.patience', min: 1, max: 4 },
        ],
      },
    ],
  },
]
