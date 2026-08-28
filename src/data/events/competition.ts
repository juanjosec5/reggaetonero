import type { CareerEvent } from '@/types/career'

export const COMPETITION_EVENTS: CareerEvent[] = [
  {
    id: 'comp_rival_subtweet',
    category: 'competition',
    title: 'Un colega te tira una indirecta',
    description: 'Un artista de tu misma camada suelta una línea que claramente va para ti.',
    visibleRisk: 'medium',
    condition: (c) => c.rivals.length > 0 && c.stats.fame >= 20,
    weight: () => 4,
    choices: [
      {
        text: 'Responder con una tiradera',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: 5, max: 12 },
          { kind: 'rival', field: 'relationship', min: -25, max: -10 },
          { kind: 'rival', field: 'fame', min: -3, max: 4 },
        ],
      },
      {
        text: 'Ignorarlo, estás en otra',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.patience', min: 2, max: 5 },
          { kind: 'rival', field: 'relationship', min: -5, max: 3 },
        ],
      },
      {
        text: 'Llamarlo en privado para bajar el fuego',
        style: 'loyal',
        effects: [
          { kind: 'rival', field: 'relationship', min: 5, max: 15 },
          { target: 'hiddenTraits.ego', min: -3, max: -1 },
        ],
      },
    ],
  },
  {
    id: 'comp_rival_collab_offer',
    category: 'competition',
    title: 'Un rival te propone unir fuerzas',
    description: 'El artista con el que siempre te comparan quiere grabar un tema juntos.',
    visibleRisk: 'medium',
    condition: (c) => c.rivals.some((r) => r.relationship > -20) && c.stats.fame >= 30,
    weight: () => 3,
    choices: [
      {
        text: 'Hacer el tema juntos',
        style: 'commercial',
        effects: [
          { target: 'stats.fame', min: 3, max: 10 },
          { kind: 'rival', field: 'relationship', min: 15, max: 30 },
          { kind: 'rival', field: 'fame', min: 3, max: 9 },
          { target: 'stats.credibility', min: -6, max: 2 },
        ],
      },
      {
        text: 'Rechazarlo, te resta más que suma',
        style: 'ambitious',
        effects: [
          { kind: 'rival', field: 'relationship', min: -18, max: -6 },
          { target: 'hiddenTraits.ego', min: 2, max: 5 },
          { target: 'stats.hype', min: -4, max: 0 },
        ],
      },
    ],
  },
  {
    id: 'comp_awards_snub',
    category: 'competition',
    title: 'Te dejaron fuera de las nominaciones',
    description: 'Tu mejor año y los premios grandes ni te mencionaron. Un rival se llevó todo.',
    visibleRisk: 'medium',
    condition: (c) => c.stats.fame >= 35 && c.record.hits >= 2,
    weight: () => 3,
    choices: [
      {
        text: 'Quejarte en público',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: 2, max: 6 },
          { target: 'stats.industryRespect', min: -6, max: -1 },
          { target: 'hiddenTraits.ego', min: 2, max: 5 },
        ],
      },
      {
        text: 'Usarlo como combustible',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.ambition', min: 3, max: 7 },
          { target: 'hiddenTraits.resilience', min: 2, max: 5 },
        ],
      },
    ],
  },
  {
    id: 'comp_awards_win',
    category: 'competition',
    title: 'Ganaste el premio grande',
    description: 'Tu nombre en el sobre. La sala de pie. Los rivales aplaudiendo apretando la mandíbula. Ahora todos esperan que lo repitas.',
    visibleRisk: 'low',
    condition: (c) => c.stats.fame >= 45 && c.record.hits >= 3,
    weight: () => 2,
    oncePerCareer: true,
    choices: [
      {
        text: 'Dedicar el premio a tu gente',
        style: 'loyal',
        effects: [
          { target: 'stats.industryRespect', min: 5, max: 11 },
          { target: 'stats.culturalImpact', min: 4, max: 9 },
          { kind: 'award', award: 'grammy', title: 'Grammy — Álbum del Año' },
          { kind: 'rival', field: 'relationship', min: -12, max: -2 },
        ],
      },
      {
        text: 'Aprovechar el discurso para mandar un mensaje',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: 6, max: 14 },
          { target: 'stats.credibility', min: -6, max: 3 },
          { target: 'stats.industryRespect', min: -6, max: 2 },
          { kind: 'award', award: 'billboard', title: 'Billboard — Artista del Año' },
        ],
      },
    ],
  },
  {
    id: 'comp_new_wave_threat',
    category: 'competition',
    title: 'Una nueva camada te está comiendo el terreno',
    description: 'Artistas diez años más jóvenes están sonando en todos lados y tú suenas a "antes".',
    visibleRisk: 'medium',
    condition: (c) => c.age >= 30 && c.stats.hype < 40,
    weight: () => 3,
    choices: [
      {
        text: 'Adaptar tu sonido a lo que suena hoy',
        style: 'commercial',
        effects: [
          { target: 'stats.hype', min: 5, max: 12 },
          { target: 'hiddenTraits.adaptability', min: 3, max: 6 },
          { target: 'hiddenTraits.authenticity', min: -4, max: -1 },
        ],
      },
      {
        text: 'Doblar la apuesta por tu estilo',
        style: 'loyal',
        effects: [
          { target: 'stats.credibility', min: 4, max: 9 },
          { target: 'hiddenTraits.authenticity', min: 3, max: 6 },
          { target: 'stats.hype', min: -4, max: 1 },
        ],
      },
    ],
  },
  {
    id: 'comp_rival_falls_off',
    category: 'competition',
    title: 'Tu mayor rival se está apagando',
    description: 'El artista con el que competiste toda la carrera lleva un par de años en caída.',
    visibleRisk: 'low',
    condition: (c) => c.rivals.some((r) => r.fame < c.stats.fame - 20) && c.year >= 9,
    weight: () => 2,
    choices: [
      {
        text: 'Tenderle la mano para un tema',
        style: 'loyal',
        effects: [
          { kind: 'rival', field: 'relationship', min: 20, max: 35 },
          { kind: 'rival', field: 'fame', min: 4, max: 10 },
          { target: 'stats.industryRespect', min: 2, max: 6 },
          { target: 'stats.hype', min: -5, max: 0 },
          { target: 'finances.cash', min: -20, max: 0 },
        ],
      },
      {
        text: 'Dejar que se hunda solo',
        style: 'ambitious',
        effects: [
          { kind: 'rival', field: 'relationship', min: -14, max: -4 },
          { target: 'hiddenTraits.ego', min: 1, max: 4 },
          { target: 'stats.industryRespect', min: -4, max: 0 },
        ],
      },
    ],
  },
]
