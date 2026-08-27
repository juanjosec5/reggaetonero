import type { CareerEvent } from '@/types/career'

export const LABEL_EVENTS: CareerEvent[] = [
  {
    id: 'label_major_three_album_deal',
    category: 'label',
    title: 'Un sello grande te ofrece contrato',
    description:
      'Una disquera grande te ofrece un contrato de tres álbumes con dinero por adelantado.',
    visibleRisk: 'high',
    condition: (c) => c.stats.hype >= 25 && !c.team.label,
    weight: () => 6,
    oncePerCareer: true,
    choices: [
      {
        text: 'Firmar el contrato',
        style: 'commercial',
        effects: [
          { target: 'finances.cash', min: 60, max: 150 },
          { target: 'finances.ownershipPercent', min: -35, max: -20 },
          { target: 'stats.industryRespect', min: 5, max: 10 },
        ],
      },
      {
        text: 'Negociar mejores términos',
        style: 'ambitious',
        effects: [
          { target: 'finances.cash', min: 20, max: 60 },
          { target: 'finances.ownershipPercent', min: -15, max: -8 },
          { target: 'hiddenTraits.riskTolerance', min: 2, max: 5 },
        ],
        delayedEffects: [{ eventId: 'label_negotiation_backlash', triggerYear: 2 }],
      },
      {
        text: 'Seguir independiente',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.authenticity', min: 3, max: 7 },
          { target: 'stats.credibility', min: 3, max: 6 },
        ],
      },
    ],
  },
  {
    id: 'label_negotiation_backlash',
    category: 'label',
    title: 'El sello no olvidó la negociación',
    description: 'La disquera te está dando menos prioridad de la que esperabas.',
    visibleRisk: 'medium',
    condition: () => true,
    weight: () => 3,
    choices: [
      {
        text: 'Aceptarlo y seguir trabajando',
        style: 'safe',
        effects: [{ target: 'hiddenTraits.patience', min: 2, max: 5 }],
      },
      {
        text: 'Reclamar y exigir más apoyo',
        style: 'ambitious',
        effects: [
          { target: 'stats.industryRespect', min: -3, max: 2 },
          { target: 'hiddenTraits.ego', min: 2, max: 5 },
        ],
      },
    ],
  },
  {
    id: 'label_advance_offer',
    category: 'label',
    title: 'Te ofrecen un adelanto',
    description: 'Un sello independiente te ofrece dinero por adelantado a cambio de un % de tus regalías.',
    visibleRisk: 'medium',
    condition: (c) => c.finances.cash < 200 && c.year >= 2,
    weight: () => 4,
    choices: [
      {
        text: 'Tomar el adelanto',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: 30, max: 70 },
          { target: 'finances.ownershipPercent', min: -10, max: -5 },
        ],
      },
      {
        text: 'Rechazarlo y buscar otra forma',
        style: 'ambitious',
        effects: [{ target: 'hiddenTraits.resilience', min: 2, max: 5 }],
      },
    ],
  },
  {
    id: 'label_masters_buyback',
    category: 'label',
    title: 'La oportunidad de recomprar tus masters',
    description: 'Puedes recomprar una parte de la propiedad de tu catálogo, pero cuesta caro.',
    visibleRisk: 'high',
    condition: (c) => c.finances.ownershipPercent < 80 && c.finances.cash >= 100,
    weight: (c) => (c.finances.ownershipPercent < 60 ? 6 : 3),
    choices: [
      {
        text: 'Pagar por recomprar tus masters',
        style: 'ambitious',
        effects: [
          { target: 'finances.cash', min: -120, max: -60 },
          { target: 'finances.ownershipPercent', min: 10, max: 20 },
        ],
      },
      {
        text: 'Guardar el dinero para otra cosa',
        style: 'safe',
        effects: [{ target: 'finances.cash', min: 0, max: 0 }],
      },
    ],
  },
]
