import type { CareerEvent } from '@/types/career'

export const BUSINESS_EVENTS: CareerEvent[] = [
  {
    id: 'biz_brand_deal',
    category: 'business',
    title: 'Una marca de ropa quiere ponerte en su campaña',
    description: 'Buen cheque, pero la marca es genérica y no dice nada de ti.',
    visibleRisk: 'low',
    condition: (c) => c.stats.fame >= 25,
    weight: (c) => 3 + c.stats.fame / 30,
    choices: [
      {
        text: 'Firmar el contrato publicitario',
        style: 'commercial',
        effects: [
          { target: 'finances.cash', min: 30, max: 90 },
          { target: 'hiddenTraits.authenticity', min: -4, max: -1 },
        ],
      },
      {
        text: 'Rechazarlo, no va contigo',
        style: 'loyal',
        effects: [
          { target: 'stats.credibility', min: 2, max: 6 },
          { target: 'hiddenTraits.authenticity', min: 2, max: 5 },
        ],
      },
    ],
  },
  {
    id: 'biz_launch_own_brand',
    category: 'business',
    title: 'Puedes lanzar tu propia marca',
    description: 'Ropa, licor o tu propio sello: tienes el nombre para montar un negocio propio.',
    visibleRisk: 'high',
    condition: (c) => c.finances.cash >= 150 && c.attributes.business >= 45,
    weight: () => 3,
    oncePerCareer: true,
    choices: [
      {
        text: 'Invertir fuerte y montarla',
        style: 'ambitious',
        effects: [
          { target: 'finances.cash', min: -120, max: -60 },
          { target: 'attributes.business', min: 3, max: 8 },
        ],
        delayedEffects: [{ eventId: 'biz_brand_returns', triggerYear: 2 }],
      },
      {
        text: 'Hacer una colaboración pequeña con una marca ya montada',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: -25, max: 35 },
          { target: 'hiddenTraits.authenticity', min: -3, max: 0 },
        ],
      },
    ],
  },
  {
    id: 'biz_brand_returns',
    category: 'business',
    title: 'Tu negocio da su primer balance',
    description: 'Ya se puede ver si la marca que montaste camina o no.',
    visibleRisk: 'medium',
    // Follow-up only: reached through a delayed effect, never rolled on its own.
    condition: () => false,
    weight: () => 0,
    choices: [
      {
        text: 'Reinvertir y doblar la apuesta',
        style: 'ambitious',
        effects: [
          { target: 'finances.cash', min: -90, max: 160 },
          { target: 'finances.netWorth', min: -20, max: 60 },
          { target: 'hiddenTraits.discipline', min: -2, max: 3 },
        ],
      },
      {
        text: 'Sacar lo que puedas y cerrar',
        style: 'safe',
        effects: [{ target: 'finances.cash', min: -50, max: 25 }],
      },
    ],
  },
  {
    id: 'biz_catalog_sale_offer',
    category: 'business',
    title: 'Un fondo quiere comprar tu catálogo',
    description: 'Te ofrecen un cheque enorme hoy a cambio de todos los derechos de tu música.',
    visibleRisk: 'high',
    condition: (c) => c.finances.catalogValue >= 120 && c.year >= 8,
    weight: () => 2,
    oncePerCareer: true,
    choices: [
      {
        text: 'Vender el catálogo entero',
        style: 'commercial',
        effects: [
          { target: 'finances.cash', min: 200, max: 400 },
          { target: 'finances.ownershipPercent', min: -100, max: -100 },
          { target: 'hiddenTraits.authenticity', min: -6, max: -2 },
        ],
      },
      {
        text: 'Vender solo una parte',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: 80, max: 160 },
          { target: 'finances.ownershipPercent', min: -30, max: -15 },
        ],
      },
      {
        text: 'No vender nada',
        style: 'loyal',
        effects: [
          { target: 'hiddenTraits.patience', min: 2, max: 5 },
          { target: 'stats.credibility', min: 1, max: 4 },
        ],
      },
    ],
  },
  {
    id: 'biz_crypto_pitch',
    category: 'business',
    title: 'Te ofrecen ser la cara de una app financiera',
    description: 'Pagan en acciones de una empresa que promete mucho y explica poco.',
    visibleRisk: 'high',
    condition: (c) => c.stats.fame >= 40,
    weight: () => 2,
    choices: [
      {
        text: 'Aceptar y arriesgarte',
        style: 'ambitious',
        effects: [{ target: 'finances.cash', min: 20, max: 60 }],
        delayedEffects: [{ eventId: 'biz_endorsement_blowup', triggerYear: 2 }],
      },
      {
        text: 'Pasar, huele mal',
        style: 'safe',
        effects: [{ target: 'stats.credibility', min: 1, max: 4 }],
      },
    ],
  },
  {
    id: 'biz_endorsement_blowup',
    category: 'controversy',
    title: 'La empresa que respaldaste colapsó',
    description: 'La app que promocionaste dejó a mucha gente sin su dinero, y tu cara está en todos los anuncios.',
    visibleRisk: 'high',
    // Follow-up only: reached through a delayed effect, never rolled on its own.
    condition: () => false,
    weight: () => 0,
    choices: [
      {
        text: 'Pedir disculpas públicamente',
        style: 'safe',
        effects: [
          { target: 'stats.credibility', min: -10, max: -3 },
          { target: 'hiddenTraits.resilience', min: 2, max: 5 },
        ],
      },
      {
        text: 'Guardar silencio y esperar que pase',
        style: 'safe',
        effects: [
          { target: 'stats.credibility', min: -6, max: -2 },
          { target: 'stats.hype', min: -8, max: -2 },
        ],
      },
    ],
  },
]
