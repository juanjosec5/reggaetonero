import type { CareerEvent } from '@/types/career'

export const RELATIONSHIP_EVENTS: CareerEvent[] = [
  {
    id: 'rel_producer_credit_dispute',
    category: 'relationship',
    title: 'Un productor dice que no le diste crédito',
    description: 'DJ Marea asegura que media base de tu último hit es suya y no aparece en los créditos.',
    visibleRisk: 'medium',
    condition: (c) => c.record.hits >= 1 && c.year >= 3,
    weight: () => 3,
    choices: [
      {
        text: 'Reconocerlo y pagarle lo justo',
        style: 'loyal',
        effects: [
          { target: 'finances.cash', min: -25, max: -8 },
          { kind: 'relationship', personId: 'prod_dj_marea', field: 'trust', min: 15, max: 30 },
          { target: 'stats.industryRespect', min: 2, max: 6 },
        ],
      },
      {
        text: 'Negarlo, el tema es tuyo',
        style: 'ambitious',
        effects: [
          { kind: 'relationship', personId: 'prod_dj_marea', field: 'trust', min: -25, max: -10 },
          { kind: 'relationship', personId: 'prod_dj_marea', field: 'tension', min: 15, max: 30 },
        ],
        delayedEffects: [{ eventId: 'rel_producer_goes_public', triggerYear: 1 }],
      },
    ],
  },
  {
    id: 'rel_producer_goes_public',
    category: 'relationship',
    title: 'El productor lo contó todo en una entrevista',
    description: 'DJ Marea dio nombres, fechas y capturas. La industria está escuchando.',
    visibleRisk: 'high',
    // Follow-up only: reached through a delayed effect, never rolled on its own.
    condition: () => false,
    weight: () => 0,
    choices: [
      {
        text: 'Arreglarlo ahora, aunque duela',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: -60, max: -25 },
          { target: 'stats.credibility', min: -5, max: -1 },
          { kind: 'relationship', personId: 'prod_dj_marea', field: 'trust', min: 10, max: 20 },
        ],
      },
      {
        text: 'Ir a la guerra de declaraciones',
        style: 'ambitious',
        effects: [
          { target: 'stats.credibility', min: -12, max: -4 },
          { target: 'stats.hype', min: 2, max: 8 },
          { target: 'stats.industryRespect', min: -8, max: -2 },
        ],
      },
    ],
  },
  {
    id: 'rel_mentor_appears',
    category: 'relationship',
    title: 'Un veterano te toma bajo su ala',
    description: 'Un artista de la vieja escuela te ofrece consejo y contactos sin pedir nada a cambio.',
    visibleRisk: 'low',
    condition: (c) => c.year >= 2 && c.year <= 10,
    weight: () => 3,
    oncePerCareer: true,
    choices: [
      {
        text: 'Escucharlo y dejarte guiar',
        style: 'loyal',
        effects: [
          { kind: 'relationship', personId: 'mentor_el_patriarca', field: 'trust', min: 20, max: 35 },
          { target: 'attributes.business', min: 2, max: 5 },
          { target: 'hiddenTraits.patience', min: 2, max: 5 },
        ],
      },
      {
        text: 'Agradecer pero seguir tu camino',
        style: 'ambitious',
        effects: [
          { target: 'hiddenTraits.ambition', min: 2, max: 5 },
          { kind: 'relationship', personId: 'mentor_el_patriarca', field: 'trust', min: -5, max: 5 },
        ],
      },
    ],
  },
  {
    id: 'rel_mentor_calls_favor',
    category: 'relationship',
    title: 'El veterano te pide un favor',
    description: 'El mentor que te abrió puertas te pide un feature gratis para su hijo, que no tiene nivel.',
    visibleRisk: 'medium',
    condition: (c) => c.relationships.some((r) => r.personId === 'mentor_el_patriarca' && r.trust >= 55),
    weight: () => 4,
    choices: [
      {
        text: 'Hacerlo por respeto',
        style: 'loyal',
        effects: [
          { kind: 'relationship', personId: 'mentor_el_patriarca', field: 'loyalty', min: 15, max: 30 },
          { target: 'stats.credibility', min: -4, max: -1 },
          { target: 'hiddenTraits.loyalty', min: 2, max: 5 },
        ],
      },
      {
        text: 'Decir que no, tu nombre vale',
        style: 'ambitious',
        effects: [
          { kind: 'relationship', personId: 'mentor_el_patriarca', field: 'trust', min: -30, max: -15 },
          { kind: 'relationship', personId: 'mentor_el_patriarca', field: 'tension', min: 20, max: 40 },
        ],
      },
    ],
  },
  {
    id: 'rel_producer_loyalty_test',
    category: 'relationship',
    title: 'Otro artista quiere robarte a tu productor',
    description: 'Le ofrecen a tu productor de cabecera el triple de lo que tú le pagas.',
    visibleRisk: 'medium',
    condition: (c) => Boolean(c.team.producer),
    weight: () => 3,
    choices: [
      {
        text: 'Igualar la oferta',
        style: 'loyal',
        effects: [
          { target: 'finances.cash', min: -60, max: -25 },
          { kind: 'team', role: 'producer', op: 'adjustLoyalty', min: 12, max: 25 },
        ],
      },
      {
        text: 'Dejarlo ir y buscar sonido nuevo',
        style: 'ambitious',
        effects: [
          { kind: 'team', role: 'producer', op: 'leave' },
          { target: 'attributes.originality', min: 1, max: 5 },
          { target: 'attributes.productionSense', min: -4, max: -1 },
        ],
      },
    ],
  },
  {
    id: 'rel_barrio_crew',
    category: 'relationship',
    title: 'Tu combo del barrio quiere entrar contigo',
    description: 'Los que estaban desde antes quieren ser parte del proyecto: manejo, coros, la logística. Son familia, pero no son profesionales.',
    visibleRisk: 'medium',
    condition: (c) => c.year <= 4 && c.stats.hype >= 8,
    weight: () => 3,
    choices: [
      {
        text: 'Meterlos en todo, son familia',
        style: 'loyal',
        effects: [
          { target: 'hiddenTraits.loyalty', min: 3, max: 7 },
          { target: 'hiddenTraits.authenticity', min: 2, max: 5 },
          { target: 'attributes.productionSense', min: -3, max: 0 },
          { target: 'finances.cash', min: -20, max: -5 },
        ],
      },
      {
        text: 'Trabajar con gente que sepa',
        style: 'ambitious',
        effects: [
          { target: 'attributes.business', min: 1, max: 4 },
          { target: 'attributes.productionSense', min: 1, max: 3 },
          { target: 'hiddenTraits.authenticity', min: -4, max: -1 },
          { target: 'hiddenTraits.loyalty', min: -5, max: -2 },
        ],
      },
    ],
  },
  {
    id: 'rel_next_gen_cosign',
    category: 'relationship',
    title: 'Un pibe nuevo quiere tu co-sign',
    description: 'Un artista diez años más joven te manda un tema para que le tires un verso. Podría ser el próximo grande — o nada.',
    visibleRisk: 'low',
    condition: (c) => c.age >= 32 && (c.stats.industryRespect >= 22 || c.stats.fame >= 45),
    weight: () => 3,
    choices: [
      {
        text: 'Darle el feature y abrirle puertas',
        style: 'loyal',
        effects: [
          { target: 'stats.industryRespect', min: 3, max: 8 },
          { target: 'stats.culturalImpact', min: 2, max: 6 },
          { target: 'hiddenTraits.adaptability', min: 1, max: 4 },
        ],
      },
      {
        text: 'Cobrarle caro por tu nombre',
        style: 'commercial',
        effects: [
          { target: 'finances.cash', min: 20, max: 60 },
          { target: 'stats.credibility', min: -5, max: -1 },
        ],
      },
      {
        text: 'Ignorarlo, que se lo gane',
        style: 'ambitious',
        effects: [{ target: 'hiddenTraits.ego', min: 1, max: 4 }],
      },
    ],
  },
]
