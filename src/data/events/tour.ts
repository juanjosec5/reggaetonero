import type { CareerEvent } from '@/types/career'

export const TOUR_EVENTS: CareerEvent[] = [
  {
    id: 'tour_first_regional_run',
    category: 'tour',
    title: 'Te ofrecen una gira corta por tu región',
    description: 'Un promotor arma diez fechas por ciudades cercanas. Los gastos de carretera corren por tu cuenta.',
    visibleRisk: 'medium',
    condition: (c) => c.stats.fanbase >= 12 && c.era !== 'leyenda',
    weight: () => 4,
    choices: [
      {
        text: 'Salir a la carretera',
        style: 'ambitious',
        effects: [
          { target: 'stats.livePower', min: 5, max: 12 },
          { target: 'finances.cash', min: -25, max: 25 },
          { kind: 'market', op: 'penetrate', min: 4, max: 12 },
          { target: 'hiddenTraits.resilience', min: -4, max: 1 },
          { target: 'stats.hype', min: -3, max: 1 },
        ],
      },
      {
        text: 'Hacer solo las dos o tres fechas grandes',
        style: 'safe',
        effects: [
          { target: 'stats.livePower', min: 1, max: 4 },
          { target: 'finances.cash', min: 2, max: 12 },
        ],
      },
    ],
  },
  {
    id: 'tour_break_new_market',
    category: 'tour',
    title: 'Un festival en otro país te quiere en el cartel',
    description: 'Es un mercado nuevo para ti, lejos de casa. Si nadie te conoce allá, tocar para un campo vacío se ve muy mal.',
    visibleRisk: 'high',
    condition: (c) => c.stats.fame >= 30 && c.markets.some((m) => !m.unlocked),
    weight: (c) => 3 + c.stats.internationalReach / 20,
    choices: [
      {
        text: 'Ir y jugártela',
        style: 'ambitious',
        effects: [
          { kind: 'market', op: 'unlock', marketId: 'mx' },
          { kind: 'market', op: 'penetrate', marketId: 'mx', min: 0, max: 16 },
          { target: 'stats.internationalReach', min: -2, max: 8 },
          { target: 'stats.credibility', min: -6, max: 3 },
          { target: 'finances.cash', min: -40, max: 5 },
        ],
      },
      {
        text: 'Esperar a tener más nombre allá',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.patience', min: 1, max: 4 },
          { target: 'stats.hype', min: -3, max: 0 },
        ],
      },
    ],
  },
  {
    id: 'tour_arena_upgrade',
    category: 'tour',
    title: 'Puedes saltar a recintos más grandes',
    description: 'Tu equipo cree que ya llenas arenas. Si no las llenas, la foto de las gradas vacías da la vuelta al mundo.',
    visibleRisk: 'high',
    condition: (c) => c.stats.livePower >= 24,
    weight: () => 4,
    choices: [
      {
        text: 'Anunciar arenas',
        style: 'ambitious',
        effects: [
          { target: 'stats.livePower', min: -6, max: 16 },
          { target: 'stats.hype', min: -4, max: 10 },
          { target: 'finances.cash', min: -60, max: 40 },
        ],
        delayedEffects: [{ eventId: 'tour_ticket_sales_report', triggerYear: 1 }],
      },
      {
        text: 'Quedarte en teatros llenos',
        style: 'safe',
        effects: [
          { target: 'stats.livePower', min: 1, max: 5 },
          { target: 'stats.credibility', min: 1, max: 4 },
          { target: 'finances.cash', min: 5, max: 20 },
        ],
      },
    ],
  },
  {
    id: 'tour_ticket_sales_report',
    category: 'tour',
    title: 'Llegan los números de la gira',
    description: 'Los reportes de taquilla ya están sobre la mesa.',
    visibleRisk: 'medium',
    // Follow-up only: reached through a delayed effect, never rolled on its own.
    condition: () => false,
    weight: () => 0,
    choices: [
      {
        text: 'Asumir lo que digan los números',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: -50, max: 70 },
          { target: 'stats.livePower', min: -6, max: 8 },
          { target: 'stats.credibility', min: -5, max: 4 },
        ],
      },
      {
        text: 'Reajustar la gira a recintos que sí llenas',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: -20, max: 5 },
          { target: 'hiddenTraits.resilience', min: 2, max: 5 },
        ],
      },
    ],
  },
  {
    id: 'tour_burnout_on_road',
    category: 'tour',
    title: 'La gira te está consumiendo',
    description: 'Llevas meses de bus en bus y el cuerpo te está pasando factura.',
    visibleRisk: 'medium',
    condition: (c) => c.stats.livePower >= 26 && c.age >= 26,
    weight: () => 4,
    choices: [
      {
        text: 'Cancelar fechas y descansar',
        style: 'safe',
        effects: [
          { target: 'stats.livePower', min: -8, max: -3 },
          { target: 'finances.cash', min: -35, max: -10 },
          { target: 'hiddenTraits.resilience', min: 3, max: 7 },
        ],
      },
      {
        text: 'Apretar los dientes y terminar la gira',
        style: 'ambitious',
        effects: [
          { target: 'stats.livePower', min: 3, max: 9 },
          { target: 'finances.cash', min: 10, max: 40 },
          { target: 'hiddenTraits.resilience', min: -5, max: -1 },
        ],
        delayedEffects: [{ eventId: 'health_collapse', triggerYear: 1 }],
      },
    ],
  },
  {
    id: 'tour_international_residency',
    category: 'tour',
    title: 'Te ofrecen una residencia fija',
    description: 'Un recinto grande en el extranjero te quiere para una serie de fechas fijas todo el año. Buen dinero, pero te ata.',
    visibleRisk: 'medium',
    condition: (c) => c.stats.internationalReach >= 12,
    weight: () => 3,
    choices: [
      {
        text: 'Aceptar la residencia',
        style: 'commercial',
        effects: [
          { target: 'finances.cash', min: 40, max: 100 },
          { kind: 'market', op: 'penetrate', marketId: 'us_latin', min: 5, max: 12 },
          { target: 'stats.credibility', min: -5, max: -1 },
          { target: 'hiddenTraits.authenticity', min: -4, max: 0 },
          { kind: 'market', op: 'penetrate', min: -6, max: 0 },
        ],
      },
      {
        text: 'Rechazarla, prefieres girar',
        style: 'loyal',
        effects: [
          { target: 'stats.credibility', min: 2, max: 5 },
          { target: 'finances.cash', min: -15, max: 5 },
          { kind: 'market', op: 'penetrate', min: 2, max: 7 },
        ],
      },
    ],
  },
  {
    id: 'tour_stadium_commitment',
    category: 'tour',
    title: 'Puedes montar una gira de estadios',
    description: 'Los números dan para llenar estadios. Es la gira más grande de tu vida — y la más cara de producir si falla.',
    visibleRisk: 'high',
    condition: (c) => c.stats.fame >= 46 && (c.stats.livePower >= 22 || c.stats.internationalReach >= 22),
    weight: () => 5,
    oncePerCareer: true,
    choices: [
      {
        text: 'Estadios, todo o nada',
        style: 'ambitious',
        effects: [
          { target: 'record.stadiumShows', min: 8, max: 16 },
          { target: 'record.ticketsSold', min: 120_000, max: 320_000 },
          { target: 'stats.livePower', min: 4, max: 10 },
          { target: 'stats.hype', min: 4, max: 10 },
          { target: 'finances.cash', min: -90, max: 40 },
        ],
      },
      {
        text: 'Teatros y arenas, más seguro',
        style: 'safe',
        effects: [
          { target: 'record.clubShows', min: 10, max: 22 },
          { target: 'record.ticketsSold', min: 20_000, max: 70_000 },
          { target: 'stats.livePower', min: 2, max: 5 },
          { target: 'finances.cash', min: 10, max: 45 },
        ],
      },
    ],
  },
  {
    id: 'tour_support_slot_offer',
    category: 'tour',
    title: 'Te ofrecen abrir para un artista grande',
    description: 'Un nombre pesado te quiere de telonero en su gira. Tocas para su público, no el tuyo, y cobras poco — pero te ven miles cada noche.',
    visibleRisk: 'medium',
    condition: (c) => c.stats.fame >= 22 && c.stats.fame < 55 && c.era !== 'leyenda',
    weight: () => 4,
    choices: [
      {
        text: 'Aceptar y robarte cada noche',
        style: 'ambitious',
        effects: [
          { target: 'stats.fanbase', min: 4, max: 10 },
          { target: 'stats.livePower', min: 3, max: 7 },
          { target: 'finances.cash', min: -20, max: 10 },
          { target: 'hiddenTraits.ego', min: -2, max: 2 },
        ],
      },
      {
        text: 'Pedir headline propio en salas chicas',
        style: 'loyal',
        effects: [
          { target: 'stats.credibility', min: 2, max: 6 },
          { target: 'stats.livePower', min: 1, max: 4 },
          { target: 'stats.hype', min: -3, max: 1 },
        ],
      },
    ],
  },
  {
    id: 'tour_anniversary_run',
    category: 'tour',
    title: 'Una gira aniversario de tu primer disco',
    description: 'Un promotor quiere celebrar los años de tu debut tocándolo entero, ciudad por ciudad. Es nostalgia pura y paga muy bien.',
    visibleRisk: 'low',
    condition: (c) => c.age >= 31 && c.stats.catalogStrength >= 25,
    weight: () => 3,
    choices: [
      {
        text: 'Montar la gira aniversario',
        style: 'commercial',
        effects: [
          { target: 'finances.cash', min: 40, max: 110 },
          { target: 'record.ticketsSold', min: 30_000, max: 90_000 },
          { target: 'stats.livePower', min: 2, max: 6 },
          { target: 'stats.hype', min: -4, max: 2 },
        ],
      },
      {
        text: 'Solo si abres con material nuevo',
        style: 'creative',
        effects: [
          { target: 'stats.catalogStrength', min: 2, max: 6 },
          { target: 'stats.credibility', min: 1, max: 4 },
          { target: 'finances.cash', min: 10, max: 40 },
        ],
      },
    ],
  },
]
