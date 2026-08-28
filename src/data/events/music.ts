import type { CareerEvent } from '@/types/career'

export const MUSIC_EVENTS: CareerEvent[] = [
  {
    id: 'music_first_studio_session',
    category: 'music',
    title: 'Tu primera sesión de grabación',
    description:
      'Tienes que decidir dónde grabar tu primera canción de verdad. El presupuesto es el que es.',
    visibleRisk: 'low',
    condition: (c) => c.year <= 2,
    weight: () => 5,
    oncePerCareer: true,
    choices: [
      {
        text: 'Ahorrar y pagar un estudio de calidad',
        style: 'ambitious',
        effects: [
          { target: 'attributes.productionSense', min: 2, max: 6 },
          { target: 'stats.hype', min: 3, max: 8 },
          { target: 'finances.cash', min: -80, max: -40 },
        ],
      },
      {
        text: 'Grabar en tu cuarto con lo que tienes',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.authenticity', min: 2, max: 5 },
          { target: 'stats.hype', min: 2, max: 6 },
          { target: 'finances.cash', min: -5, max: 0 },
        ],
      },
      {
        text: 'Buscar un productor amigo que te fíe',
        style: 'creative',
        effects: [
          { target: 'attributes.productionSense', min: 1, max: 3 },
          { target: 'stats.hype', min: 1, max: 4 },
          { target: 'hiddenTraits.loyalty', min: 2, max: 5 },
        ],
      },
    ],
  },
  {
    id: 'music_viral_snippet',
    category: 'music',
    title: 'Un adelanto se hizo viral',
    description: 'Un pedazo de una canción que aún no está lista se está pegando en redes.',
    visibleRisk: 'medium',
    condition: (c) => c.stats.hype >= 12,
    weight: (c) => 4 + c.stats.hype / 20,
    choices: [
      {
        text: 'Lanzarla ya, aunque no esté perfecta',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: 5, max: 12 },
          { target: 'stats.credibility', min: -6, max: -2 },
        ],
      },
      {
        text: 'Terminarla bien antes de soltarla',
        style: 'safe',
        effects: [
          { target: 'stats.hype', min: -8, max: -3 },
          { target: 'stats.catalogStrength', min: 3, max: 8 },
        ],
      },
      {
        text: 'Rehacerla completamente con otro enfoque',
        style: 'creative',
        effects: [
          { target: 'attributes.originality', min: 2, max: 6 },
          { target: 'stats.hype', min: -10, max: -4 },
        ],
      },
    ],
  },
  {
    id: 'music_trending_sound_pivot',
    category: 'music',
    title: 'Un sonido nuevo está arrasando',
    description: 'Todo el mundo está haciendo el mismo tipo de canción y está funcionando.',
    visibleRisk: 'medium',
    condition: (c) => c.year >= 2,
    weight: () => 4,
    choices: [
      {
        text: 'Subirte a la ola',
        style: 'commercial',
        effects: [
          { target: 'stats.hype', min: 4, max: 10 },
          { target: 'hiddenTraits.authenticity', min: -8, max: -3 },
        ],
      },
      {
        text: 'Quedarte fiel a tu sonido',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.authenticity', min: 3, max: 7 },
          { target: 'stats.credibility', min: 2, max: 5 },
        ],
      },
      {
        text: 'Mezclar tu estilo con el sonido nuevo',
        style: 'creative',
        effects: [
          { target: 'attributes.originality', min: 1, max: 4 },
          { target: 'stats.hype', min: 2, max: 5 },
        ],
      },
    ],
  },
  {
    id: 'music_concept_album',
    category: 'music',
    title: 'Tu próximo álbum',
    description: 'Es hora de decidir qué tipo de álbum vas a hacer.',
    visibleRisk: 'high',
    condition: (c) => c.stats.catalogStrength >= 15 && c.year >= 3,
    weight: () => 4,
    choices: [
      {
        text: 'Un álbum conceptual, arriesgado y personal',
        style: 'creative',
        effects: [
          { target: 'stats.catalogStrength', min: -4, max: 10 },
          { target: 'hiddenTraits.authenticity', min: 4, max: 8 },
        ],
      },
      {
        text: 'Un álbum comercial pensado para pegar',
        style: 'commercial',
        effects: [
          { target: 'stats.hype', min: 5, max: 12 },
          { target: 'hiddenTraits.authenticity', min: -5, max: -2 },
        ],
      },
      {
        text: 'Un balance entre lo comercial y lo personal',
        style: 'safe',
        effects: [
          { target: 'stats.catalogStrength', min: 2, max: 6 },
          { target: 'stats.hype', min: 1, max: 4 },
        ],
      },
    ],
  },
  {
    id: 'music_writers_block',
    category: 'music',
    title: 'Se te secaron las ideas',
    description: 'Llevas semanas sin poder terminar una canción que te convenza.',
    visibleRisk: 'low',
    condition: (c) => c.year >= 2,
    weight: () => 3,
    choices: [
      {
        text: 'Tomarte un tiempo fuera para recargar',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.resilience', min: 2, max: 5 },
          { target: 'stats.hype', min: -4, max: -1 },
        ],
      },
      {
        text: 'Forzarlo y grabar de todas formas',
        style: 'ambitious',
        effects: [
          { target: 'hiddenTraits.discipline', min: 2, max: 5 },
          { target: 'attributes.writing', min: -3, max: 1 },
        ],
      },
      {
        text: 'Escribir con alguien más por primera vez',
        style: 'creative',
        effects: [
          { target: 'attributes.writing', min: 1, max: 4 },
          { target: 'hiddenTraits.adaptability', min: 2, max: 5 },
        ],
      },
    ],
  },
]
