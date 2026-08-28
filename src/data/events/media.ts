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
  {
    id: 'media_local_radio',
    category: 'media',
    title: 'Una emisora local te da rotación',
    description: 'Un DJ de la radio de tu ciudad se encariñó con un tema tuyo y lo está pinchando todas las tardes.',
    visibleRisk: 'low',
    condition: (c) => c.stats.hype >= 6 && c.year <= 6,
    weight: () => 3,
    choices: [
      {
        text: 'Ir al programa y agradecer',
        style: 'safe',
        effects: [
          { target: 'stats.hype', min: 2, max: 6 },
          { target: 'stats.fanbase', min: 1, max: 4 },
        ],
      },
      {
        text: 'Pedir que pongan una más arriesgada',
        style: 'creative',
        effects: [
          { target: 'attributes.originality', min: 1, max: 4 },
          { target: 'stats.hype', min: 0, max: 4 },
          { target: 'stats.credibility', min: 1, max: 3 },
        ],
      },
    ],
  },
  {
    id: 'media_career_retrospective',
    category: 'media',
    title: 'Una revista hace el ranking de tu carrera',
    description: 'Un medio grande publica su lista de los mejores discos de tu generación. Te mencionan — la pregunta es en qué puesto.',
    visibleRisk: 'low',
    condition: (c) => c.age >= 31 && c.stats.culturalImpact >= 16,
    weight: () => 2,
    oncePerCareer: true,
    choices: [
      {
        text: 'Te ponen alto: celebrarlo con tu gente',
        style: 'loyal',
        effects: [
          { target: 'stats.culturalImpact', min: 3, max: 8 },
          { target: 'stats.credibility', min: 2, max: 5 },
        ],
      },
      {
        text: 'Te ponen bajo: usarlo de combustible',
        style: 'ambitious',
        effects: [
          { target: 'hiddenTraits.ambition', min: 3, max: 7 },
          { target: 'stats.hype', min: 2, max: 6 },
          { target: 'hiddenTraits.ego', min: 1, max: 4 },
        ],
      },
    ],
  },
]
