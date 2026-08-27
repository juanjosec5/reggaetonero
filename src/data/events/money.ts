import type { CareerEvent } from '@/types/career'

export const MONEY_EVENTS: CareerEvent[] = [
  {
    id: 'money_brand_sponsorship',
    category: 'money',
    title: 'Una marca quiere patrocinarte',
    description: 'Una marca de ropa te ofrece dinero por usar y promocionar sus productos.',
    visibleRisk: 'low',
    condition: (c) => c.stats.fame >= 10,
    weight: () => 4,
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
    condition: (c) => c.stats.livePower >= 10 || c.record.shows >= 3,
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
    condition: (c) => c.finances.cash >= 80,
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
]
