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
    condition: (c) => c.stats.fame >= 35 && c.year >= 5 && c.finances.cash >= 150 && c.attributes.business >= 45,
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
    condition: (c) => c.finances.catalogValue >= 120 && c.year >= 7,
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
      {
        text: 'Devolver lo que te pagaron y montar un fondo para los afectados',
        style: 'loyal',
        effects: [
          { target: 'finances.cash', min: -140, max: -60 },
          { target: 'stats.credibility', min: -2, max: 4 },
          { target: 'hiddenTraits.authenticity', min: 2, max: 6 },
        ],
        delayedEffects: [{ eventId: 'biz_second_chance', triggerYear: 2 }],
      },
    ],
  },
  {
    id: 'biz_second_chance',
    category: 'business',
    title: 'La gente no olvidó lo que hiciste bien',
    description:
      'Un par de años después, la historia que quedó no es la del escándalo sino la del que dio la cara y puso su dinero. Otra marca — esta vez seria — quiere hablar contigo.',
    visibleRisk: 'low',
    condition: () => false, // Follow-up only: reached through a delayed effect.
    weight: () => 0,
    choices: [
      {
        text: 'Firmar, pero leyendo cada línea esta vez',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: 60, max: 160 },
          { target: 'stats.industryRespect', min: 2, max: 6 },
          { target: 'attributes.business', min: 1, max: 4 },
        ],
      },
      {
        text: 'Pasar — ya sabes cómo termina eso',
        style: 'loyal',
        effects: [
          { target: 'stats.credibility', min: 3, max: 7 },
          { target: 'hiddenTraits.authenticity', min: 2, max: 5 },
        ],
      },
    ],
  },
  {
    id: 'biz_greatest_hits',
    category: 'business',
    title: 'El sello quiere sacar un grandes éxitos',
    description: 'Un recopilatorio con tus temas más sonados. Es dinero casi sin esfuerzo, pero también es admitir que lo mejor ya pasó.',
    visibleRisk: 'low',
    condition: (c) => c.age >= 31 && c.stats.catalogStrength >= 35,
    weight: () => 3,
    oncePerCareer: true,
    choices: [
      {
        text: 'Aceptar, es dinero fácil',
        style: 'commercial',
        effects: [
          { target: 'finances.cash', min: 40, max: 110 },
          { target: 'stats.catalogStrength', min: 2, max: 6 },
          { target: 'stats.credibility', min: -4, max: -1 },
        ],
      },
      {
        text: 'Negarte: quieres un disco nuevo de verdad',
        style: 'creative',
        effects: [
          { target: 'hiddenTraits.authenticity', min: 2, max: 6 },
          { target: 'attributes.originality', min: 1, max: 4 },
          { target: 'finances.cash', min: -20, max: 0 },
          { target: 'hiddenTraits.ambition', min: 1, max: 4 },
        ],
      },
    ],
  },
  {
    id: 'biz_endorsement_pick',
    category: 'business',
    title: 'Dos marcas, un solo trato',
    description: 'Te llegan dos ofertas de patrocinio a la vez: una bebida energética que paga fuerte y una marca de tenis de barrio que paga poco pero es respetada.',
    visibleRisk: 'low',
    condition: (c) => c.stats.fame >= 25 && c.stats.fame < 60,
    weight: () => 4,
    choices: [
      {
        text: 'La que paga más',
        style: 'commercial',
        effects: [
          { target: 'finances.cash', min: 30, max: 75 },
          { target: 'hiddenTraits.authenticity', min: -4, max: -1 },
        ],
      },
      {
        text: 'La de barrio, aunque pague poco',
        style: 'loyal',
        effects: [
          { target: 'stats.credibility', min: 3, max: 7 },
          { target: 'hiddenTraits.authenticity', min: 1, max: 4 },
          { target: 'finances.cash', min: 5, max: 20 },
        ],
      },
      {
        text: 'Estirar la negociación para que suban las dos',
        style: 'ambitious',
        effects: [
          { target: 'attributes.business', min: 2, max: 5 },
          { target: 'finances.cash', min: -5, max: 40 },
        ],
      },
    ],
  },
  {
    id: 'biz_publishing_slice',
    category: 'business',
    title: 'Vender un pedazo de tu publishing',
    description: 'Una editora te ofrece un cheque grande hoy por una parte de lo que tus canciones generen de aquí en adelante como compositor.',
    visibleRisk: 'high',
    condition: (c) => c.age >= 30 && c.finances.catalogValue >= 200,
    weight: () => 3,
    choices: [
      {
        text: 'Firmar, el dinero ahora vale más',
        style: 'commercial',
        effects: [
          { target: 'finances.cash', min: 120, max: 260 },
          { target: 'finances.ownershipPercent', min: -12, max: -5 },
          { target: 'hiddenTraits.riskTolerance', min: -2, max: 1 },
        ],
      },
      {
        text: 'Quedarte con todo lo tuyo',
        style: 'safe',
        effects: [
          { target: 'finances.ownershipPercent', min: 1, max: 4 },
          { target: 'stats.industryRespect', min: 1, max: 4 },
        ],
      },
    ],
  },
]
