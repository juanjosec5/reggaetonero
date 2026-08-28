import type { CareerEvent } from '@/types/career'

/**
 * Pure setbacks: something has already gone wrong. Every choice is damage
 * control — the question is only which way you take the hit, never whether.
 */
export const SETBACK_EVENTS: CareerEvent[] = [
  {
    id: 'setback_manager_embezzlement',
    category: 'money',
    title: 'Tu mánager te estuvo robando',
    description: 'Los números no cuadran desde hace años. Tu mánager llevaba tiempo desviando dinero tuyo.',
    visibleRisk: 'high',
    condition: (c) => Boolean(c.team.manager) && c.finances.cash >= 40 && c.year >= 4,
    weight: () => 3,
    oncePerCareer: true,
    choices: [
      {
        text: 'Demandarlo y hacerlo público',
        style: 'ambitious',
        effects: [
          { kind: 'team', role: 'manager', op: 'leave' },
          { target: 'finances.cash', min: -40, max: -10 },
          { target: 'stats.hype', min: -8, max: -2 },
          { target: 'hiddenTraits.resilience', min: 2, max: 5 },
        ],
      },
      {
        text: 'Arreglarlo en privado y cortar por lo sano',
        style: 'safe',
        effects: [
          { kind: 'team', role: 'manager', op: 'leave' },
          { target: 'finances.cash', min: -110, max: -50 },
          { target: 'hiddenTraits.loyalty', min: -6, max: -2 },
        ],
      },
      {
        text: 'Perdonarlo, es familia',
        style: 'loyal',
        effects: [
          { target: 'finances.cash', min: -70, max: -30 },
          { kind: 'team', role: 'manager', op: 'adjustLoyalty', min: -20, max: -8 },
          { target: 'hiddenTraits.loyalty', min: 2, max: 6 },
        ],
      },
    ],
  },
  {
    id: 'setback_streaming_fraud_claim',
    category: 'controversy',
    title: 'Te acusan de inflar tus números',
    description: 'Un reportaje asegura que buena parte de tus streams son bots. Tú juras que no, pero el daño ya está hecho.',
    visibleRisk: 'high',
    condition: (c) => c.stats.hype >= 40 && c.record.hits >= 2,
    weight: () => 2,
    choices: [
      {
        text: 'Publicar todos tus datos para defenderte',
        style: 'safe',
        effects: [
          { target: 'stats.credibility', min: -10, max: -3 },
          { target: 'stats.hype', min: -6, max: 0 },
          { target: 'stats.industryRespect', min: -4, max: 2 },
        ],
      },
      {
        text: 'Ignorarlo y seguir soltando música',
        style: 'ambitious',
        effects: [
          { target: 'stats.credibility', min: -14, max: -6 },
          { target: 'stats.industryRespect', min: -8, max: -2 },
        ],
      },
    ],
  },
  {
    id: 'setback_gear_stolen_on_tour',
    category: 'tour',
    title: 'Les robaron en la gira',
    description: 'Se llevaron el equipo, los discos duros y las sesiones sin respaldo de tu próximo disco.',
    visibleRisk: 'high',
    condition: (c) => c.stats.livePower >= 20 && c.year >= 3,
    weight: () => 2,
    choices: [
      {
        text: 'Reponer todo y volver al estudio a rehacerlo',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: -80, max: -35 },
          { target: 'stats.catalogStrength', min: -6, max: -1 },
        ],
      },
      {
        text: 'Rearmar el disco de memoria, más crudo',
        style: 'creative',
        effects: [
          { target: 'stats.catalogStrength', min: -10, max: -3 },
          { target: 'attributes.originality', min: 0, max: 4 },
          { target: 'hiddenTraits.resilience', min: 2, max: 6 },
        ],
      },
    ],
  },
  {
    id: 'setback_flop_streak',
    category: 'music',
    title: 'Tres sencillos seguidos que no pegaron',
    description: 'La radio no los pone, las plataformas no los empujan y la prensa habla de que "se te fue el momento".',
    visibleRisk: 'medium',
    condition: (c) => c.record.releases >= 5 && c.record.hits === 0 && c.stats.fame >= 20,
    weight: () => 4,
    choices: [
      {
        text: 'Parar, reinventarte y volver distinto',
        style: 'creative',
        effects: [
          { target: 'stats.hype', min: -10, max: -3 },
          { target: 'stats.fame', min: -6, max: -1 },
          { target: 'attributes.originality', min: 2, max: 6 },
          { target: 'hiddenTraits.adaptability', min: 2, max: 5 },
        ],
      },
      {
        text: 'Insistir con más de lo mismo, más fuerte',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: -6, max: 2 },
          { target: 'stats.credibility', min: -8, max: -2 },
          { target: 'finances.cash', min: -30, max: -5 },
        ],
      },
    ],
  },
  {
    id: 'setback_label_shelves_album',
    category: 'label',
    title: 'El sello engavetó tu álbum',
    description: 'Terminaste el disco y la disquera decidió no sacarlo: dicen que "no es el momento". Tu música no es tuya para lanzarla.',
    visibleRisk: 'high',
    condition: (c) => Boolean(c.team.label) && c.year >= 4,
    weight: () => 3,
    choices: [
      {
        text: 'Pagar para recuperar los derechos del disco',
        style: 'ambitious',
        effects: [
          { target: 'finances.cash', min: -140, max: -70 },
          { target: 'finances.ownershipPercent', min: 4, max: 12 },
          { target: 'stats.catalogStrength', min: 2, max: 8 },
        ],
      },
      {
        text: 'Esperar a que cambien de opinión',
        style: 'safe',
        effects: [
          { target: 'stats.hype', min: -14, max: -6 },
          { target: 'hiddenTraits.patience', min: 3, max: 7 },
          { target: 'hiddenTraits.ambition', min: -4, max: -1 },
        ],
      },
      {
        text: 'Filtrarlo tú mismo y asumir las consecuencias',
        style: 'creative',
        effects: [
          { target: 'stats.credibility', min: 3, max: 9 },
          { target: 'stats.hype', min: 2, max: 8 },
          { target: 'stats.industryRespect', min: -12, max: -4 },
          { target: 'finances.cash', min: -50, max: -15 },
        ],
        delayedEffects: [{ eventId: 'setback_label_lawsuit', triggerYear: 1 }],
      },
    ],
  },
  {
    id: 'setback_label_lawsuit',
    category: 'label',
    title: 'El sello te demandó',
    description: 'Filtrar el disco tenía precio y la disquera vino a cobrarlo en los tribunales.',
    visibleRisk: 'high',
    // Follow-up only: reached through a delayed effect, never rolled on its own.
    condition: () => false,
    weight: () => 0,
    choices: [
      {
        text: 'Negociar una salida y quedar libre del contrato',
        style: 'ambitious',
        effects: [
          { kind: 'label', op: 'leave' },
          { target: 'finances.cash', min: -160, max: -80 },
          { target: 'finances.ownershipPercent', min: 8, max: 20 },
          { target: 'hiddenTraits.resilience', min: 3, max: 7 },
        ],
      },
      {
        text: 'Pelearla hasta el final',
        style: 'ambitious',
        effects: [
          { target: 'finances.cash', min: -120, max: -40 },
          { target: 'stats.industryRespect', min: -10, max: 4 },
          { target: 'stats.hype', min: -6, max: 4 },
        ],
      },
    ],
  },
  {
    id: 'setback_tax_debt',
    category: 'money',
    title: 'Te llegó una deuda de impuestos de años',
    description: 'Nadie llevó bien las cuentas cuando empezó a entrar dinero. Ahora el fisco quiere lo suyo, con intereses.',
    visibleRisk: 'high',
    condition: (c) => c.finances.cash >= 60 && c.year >= 5,
    weight: () => 3,
    oncePerCareer: true,
    choices: [
      {
        text: 'Pagar todo de golpe y quedar limpio',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: -150, max: -70 },
          { target: 'hiddenTraits.discipline', min: 2, max: 5 },
        ],
      },
      {
        text: 'Acogerte a un plan de pagos',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: -60, max: -25 },
          { target: 'finances.annualIncome', min: -8, max: -2 },
        ],
        delayedEffects: [{ eventId: 'setback_tax_debt_followup', triggerYear: 2 }],
      },
    ],
  },
  {
    id: 'setback_tax_debt_followup',
    category: 'money',
    title: 'El plan de pagos se te complicó',
    description: 'Un año flojo y las cuotas del fisco pesan más de lo que pensabas.',
    visibleRisk: 'medium',
    // Follow-up only: reached through a delayed effect, never rolled on its own.
    condition: () => false,
    weight: () => 0,
    choices: [
      {
        text: 'Vender algo para cubrirlo',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: -50, max: -20 },
          { target: 'finances.netWorth', min: -30, max: -10 },
        ],
      },
      {
        text: 'Salir a girar para tapar el hueco',
        style: 'ambitious',
        effects: [
          { target: 'stats.livePower', min: 2, max: 6 },
          { target: 'finances.cash', min: -10, max: 40 },
          { target: 'hiddenTraits.resilience', min: -3, max: 2 },
        ],
      },
    ],
  },
  {
    id: 'setback_vocal_injury',
    category: 'health',
    title: 'Un problema en las cuerdas vocales',
    description: 'El médico es claro: si no paras y te operas, tu voz no va a volver a ser la misma.',
    visibleRisk: 'high',
    condition: (c) => c.attributes.voice >= 30 && c.stats.livePower >= 25 && c.age >= 27,
    weight: () => 2,
    oncePerCareer: true,
    choices: [
      {
        text: 'Operarte y parar un año entero',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: -70, max: -25 },
          { target: 'stats.hype', min: -12, max: -4 },
          { target: 'stats.livePower', min: -8, max: -2 },
          { target: 'attributes.voice', min: -2, max: 2 },
        ],
      },
      {
        text: 'Seguir cantando con tratamiento e infiltraciones',
        style: 'ambitious',
        effects: [
          { target: 'attributes.voice', min: -12, max: -4 },
          { target: 'attributes.performance', min: -6, max: -1 },
          { target: 'stats.livePower', min: -3, max: 3 },
        ],
      },
    ],
  },
]
