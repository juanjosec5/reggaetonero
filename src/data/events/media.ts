import type { CareerEvent } from '@/types/career'

export const MEDIA_EVENTS: CareerEvent[] = [
  {
    id: 'media_viral_interview',
    category: 'media',
    title: 'Una entrevista se hace viral',
    description: 'Algo que dijiste en una entrevista se está compartiendo por todos lados.',
    visibleRisk: 'medium',
    condition: (c) => c.stats.fame >= 15,
    weight: () => 3,
    choices: [
      {
        text: 'Aprovechar el momento y hablar más de ello',
        style: 'ambitious',
        effects: [
          { target: 'stats.fame', min: 3, max: 8 },
          { target: 'stats.credibility', min: -3, max: 2 },
        ],
      },
      {
        text: 'Dejar que se apague solo',
        style: 'safe',
        effects: [{ target: 'stats.fame', min: -2, max: 2 }],
      },
    ],
  },
  {
    id: 'media_documentary_offer',
    category: 'media',
    title: 'Te ofrecen hacer un documental',
    description: 'Una productora quiere contar la historia de tu carrera hasta ahora.',
    visibleRisk: 'medium',
    condition: (c) => c.year >= 4 && c.stats.fame >= 20,
    weight: () => 3,
    oncePerCareer: true,
    choices: [
      {
        text: 'Abrir tu vida completamente',
        style: 'ambitious',
        effects: [
          { target: 'stats.culturalImpact', min: 5, max: 12 },
          { target: 'hiddenTraits.ego', min: 2, max: 5 },
        ],
      },
      {
        text: 'Participar pero con límites claros',
        style: 'safe',
        effects: [{ target: 'stats.culturalImpact', min: 2, max: 6 }],
      },
      {
        text: 'Rechazarlo, prefieres tu privacidad',
        style: 'loyal',
        effects: [{ target: 'hiddenTraits.authenticity', min: 1, max: 4 }],
      },
    ],
  },
  {
    id: 'media_algorithm_shift',
    category: 'media',
    title: 'Las plataformas cambiaron el algoritmo',
    description: 'Un cambio en las plataformas de streaming está afectando cómo te descubre la gente.',
    visibleRisk: 'low',
    condition: (c) => c.year >= 3,
    weight: () => 3,
    choices: [
      {
        text: 'Adaptar tu estrategia de contenido',
        style: 'creative',
        effects: [
          { target: 'hiddenTraits.adaptability', min: 3, max: 6 },
          { target: 'stats.hype', min: 1, max: 4 },
        ],
      },
      {
        text: 'Ignorarlo y seguir igual',
        style: 'safe',
        effects: [{ target: 'stats.hype', min: -4, max: -1 }],
      },
    ],
  },
]
