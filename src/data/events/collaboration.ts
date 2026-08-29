import type { CareerEvent } from '@/types/career'

export const COLLABORATION_EVENTS: CareerEvent[] = [
  {
    id: 'collab_big_star_feature',
    category: 'collaboration',
    title: 'Un artista grande quiere un feature',
    description: 'Un artista mucho más conocido que tú quiere grabar contigo.',
    visibleRisk: 'medium',
    condition: (c) => c.stats.fame >= 10 || c.stats.hype >= 12,
    weight: (c) => 3 + c.stats.fame / 25,
    choices: [
      {
        text: 'Aceptar la colaboración',
        style: 'ambitious',
        effects: [
          { target: 'stats.fame', min: 4, max: 10 },
          { target: 'stats.industryRespect', min: 2, max: 5 },
          { target: 'finances.cash', min: -10, max: -2 },
        ],
      },
      {
        text: 'Pedir condiciones más favorables primero',
        style: 'safe',
        effects: [
          { target: 'stats.fame', min: 1, max: 4 },
          { target: 'hiddenTraits.ego', min: 1, max: 3 },
        ],
      },
      {
        text: 'Rechazarla, no encaja con lo tuyo',
        style: 'loyal',
        effects: [{ target: 'hiddenTraits.authenticity', min: 2, max: 5 }],
      },
    ],
  },
  {
    id: 'collab_producer_partnership',
    category: 'collaboration',
    title: 'Un productor quiere trabajar solo contigo',
    description: 'Un productor talentoso te propone hacer varios proyectos juntos en exclusiva.',
    visibleRisk: 'low',
    condition: (c) => c.year >= 2,
    weight: () => 3,
    choices: [
      {
        text: 'Aceptar la exclusividad',
        style: 'loyal',
        effects: [
          { target: 'attributes.productionSense', min: 3, max: 7 },
          { target: 'hiddenTraits.loyalty', min: 2, max: 5 },
          { target: 'hiddenTraits.adaptability', min: -3, max: -1 },
        ],
      },
      {
        text: 'Trabajar con él pero seguir abierto a otros',
        style: 'safe',
        effects: [{ target: 'attributes.productionSense', min: 1, max: 3 }],
      },
    ],
  },
  {
    id: 'collab_cross_genre_pressure',
    category: 'collaboration',
    title: 'Te presionan para cruzar de género',
    description: 'Tu equipo insiste en que grabes con un artista de un género totalmente distinto.',
    visibleRisk: 'medium',
    condition: (c) => c.stats.internationalReach >= 10,
    weight: () => 3,
    choices: [
      {
        text: 'Hacerlo, puede abrirte otro público',
        style: 'commercial',
        effects: [
          { target: 'stats.internationalReach', min: 4, max: 9 },
          { target: 'hiddenTraits.authenticity', min: -4, max: -1 },
        ],
      },
      {
        text: 'Negarte, no es tu carril',
        style: 'loyal',
        effects: [{ target: 'hiddenTraits.authenticity', min: 2, max: 5 }],
      },
    ],
  },
  {
    id: 'collab_posse_cut',
    category: 'collaboration',
    title: 'Te llaman para un tema con medio género encima',
    description: 'Un productor arma un tema-evento con seis o siete artistas. Vas a compartir el crédito con todos, y tu verso puede quedar enterrado o robarse la canción.',
    visibleRisk: 'medium',
    condition: (c) => c.stats.fame >= 20 && c.stats.fame < 60,
    weight: () => 3,
    choices: [
      {
        text: 'Entrar y tirar tu mejor verso',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: 3, max: 8 },
          { target: 'attributes.writing', min: 1, max: 4 },
          { target: 'stats.industryRespect', min: 1, max: 4 },
        ],
      },
      {
        text: 'Pedir cerrar el tema o nada',
        style: 'commercial',
        effects: [
          { target: 'hiddenTraits.ego', min: 1, max: 4 },
          { target: 'stats.hype', min: -2, max: 4 },
        ],
      },
      {
        text: 'Pasar, prefieres que tu nombre pese solo',
        style: 'loyal',
        effects: [
          { target: 'stats.credibility', min: 1, max: 4 },
          { target: 'hiddenTraits.authenticity', min: 1, max: 3 },
        ],
      },
    ],
  },
]
