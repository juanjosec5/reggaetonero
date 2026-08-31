import type { CareerEvent } from '@/types/career'

export const MONEY_EVENTS: CareerEvent[] = [
  {
    id: 'money_brand_sponsorship',
    category: 'money',
    title: 'Una marca quiere patrocinarte',
    description: 'Una marca de ropa te ofrece dinero por usar y promocionar sus productos.',
    visibleRisk: 'low',
    condition: (c) => c.stats.fame >= 10,
    weight: () => 3,
    choices: [
      {
        text: 'Aceptar el patrocinio',
        style: 'commercial',
        effects: [
          { target: 'finances.cash', min: 20, max: 50 },
          { target: 'hiddenTraits.authenticity', min: -3, max: -1 },
        ],
      },
      {
        text: 'Rechazarlo, no te representa',
        style: 'safe',
        effects: [{ target: 'hiddenTraits.authenticity', min: 1, max: 4 }],
      },
    ],
  },
  {
    id: 'money_tour_promoter_advance',
    category: 'money',
    title: 'Un promotor te ofrece una gira',
    description: 'Un promotor te adelanta dinero para organizar tu primera gira de shows.',
    visibleRisk: 'medium',
    condition: (c) => c.stats.livePower >= 10,
    weight: () => 4,
    choices: [
      {
        text: 'Aceptar y salir de gira',
        style: 'ambitious',
        effects: [
          { target: 'finances.cash', min: 20, max: 60 },
          { target: 'stats.livePower', min: 3, max: 8 },
          { target: 'hiddenTraits.resilience', min: -2, max: 2 },
        ],
      },
      {
        text: 'Esperar a estar mejor preparado',
        style: 'safe',
        effects: [{ target: 'hiddenTraits.patience', min: 2, max: 5 }],
      },
    ],
  },
  {
    id: 'money_advisor_pitch',
    category: 'money',
    title: 'Un asesor te propone invertir',
    description: 'Un asesor financiero te propone meter tus ahorros en un negocio fuera de la música.',
    visibleRisk: 'high',
    condition: (c) => c.finances.cash >= 250 && c.year >= 3,
    weight: () => 3,
    choices: [
      {
        text: 'Invertir una parte fuerte de tus ahorros',
        style: 'ambitious',
        effects: [{ target: 'finances.cash', min: -60, max: 90 }],
      },
      {
        text: 'Guardar tu dinero, prefieres lo seguro',
        style: 'safe',
        effects: [{ target: 'hiddenTraits.patience', min: 1, max: 3 }],
      },
    ],
  },
  {
    id: 'money_day_job',
    category: 'money',
    title: 'El trabajo de verdad',
    description: 'Tu familia te recuerda que la música no paga la renta. Puedes seguir en el trabajo o dejarlo y apostarlo todo.',
    visibleRisk: 'medium',
    condition: (c) => c.year <= 3 && c.stats.fame < 15,
    weight: () => 4,
    oncePerCareer: true,
    choices: [
      {
        text: 'Dejarlo y apostar todo por la música',
        style: 'ambitious',
        effects: [
          { target: 'hiddenTraits.ambition', min: 3, max: 8 },
          { target: 'hiddenTraits.riskTolerance', min: 2, max: 5 },
          { target: 'stats.hype', min: 1, max: 5 },
          { target: 'finances.cash', min: -50, max: -20 },
        ],
      },
      {
        text: 'Mantener el trabajo por ahora',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: 30, max: 70 },
          { target: 'hiddenTraits.discipline', min: 1, max: 4 },
          { target: 'stats.hype', min: -6, max: -2 },
        ],
      },
    ],
  },
  {
    id: 'money_first_real_royalty',
    category: 'money',
    title: 'El primer cheque de royalties con ceros',
    description: 'Llega la liquidación del semestre y por primera vez es dinero de verdad. Puedes vivir de esto un rato — o hacerlo crecer.',
    visibleRisk: 'medium',
    condition: (c) => c.year >= 4 && c.year <= 9 && c.stats.fame >= 25,
    weight: () => 4,
    choices: [
      {
        text: 'Reinvertirlo todo en la próxima campaña',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: 4, max: 9 },
          { target: 'finances.cash', min: -10, max: 20 },
        ],
      },
      {
        text: 'Comprarte por fin algo tuyo',
        style: 'commercial',
        effects: [
          { target: 'finances.cash', min: -20, max: 10 },
          { target: 'hiddenTraits.ego', min: 1, max: 4 },
          { target: 'stats.hype', min: 1, max: 4 },
        ],
      },
      {
        text: 'Guardarlo y montar un fondo',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: 40, max: 90 },
          { target: 'attributes.business', min: 1, max: 4 },
        ],
      },
    ],
  },
]
