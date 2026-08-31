import type { CareerEvent } from '@/types/career'

export const MANAGEMENT_EVENTS: CareerEvent[] = [
  {
    id: 'mgmt_first_manager',
    category: 'management',
    title: 'Alguien quiere manejar tu carrera',
    description: 'Una mánager con contactos te ofrece llevar tu carrera a cambio de un porcentaje y un adelanto que le debes de entrada.',
    visibleRisk: 'medium',
    condition: (c) => !c.team.manager && c.stats.hype >= 15,
    weight: (c) => 4 + c.stats.hype / 20,
    oncePerCareer: true,
    choices: [
      {
        text: 'Firmar con ella',
        style: 'ambitious',
        effects: [
          { kind: 'team', role: 'manager', op: 'hire' },
          { target: 'finances.cash', min: -40, max: -15 },
          { target: 'hiddenTraits.authenticity', min: -3, max: -1 },
          { target: 'stats.industryRespect', min: 2, max: 6 },
        ],
        // Having a manager sets a relationship storyline in motion.
        delayedEffects: [{ eventId: 'mgmt_manager_conflict', triggerYear: 3 }],
      },
      {
        text: 'Seguir manejándote tú mismo',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.discipline', min: 2, max: 5 },
          { target: 'stats.hype', min: -5, max: -1 },
          { target: 'stats.industryRespect', min: -3, max: 0 },
        ],
      },
    ],
  },
  {
    id: 'mgmt_manager_conflict',
    category: 'management',
    title: 'Tu mánager y tú no están de acuerdo',
    description: 'Tu mánager quiere una dirección; tú quieres otra. La tensión se nota en todo el equipo.',
    visibleRisk: 'medium',
    condition: (c) => Boolean(c.team.manager),
    weight: () => 3,
    choices: [
      {
        text: 'Imponer tu criterio',
        style: 'ambitious',
        effects: [
          { kind: 'team', role: 'manager', op: 'adjustLoyalty', min: -14, max: -5 },
          { target: 'hiddenTraits.ego', min: 2, max: 5 },
          { target: 'stats.hype', min: -4, max: 2 },
        ],
        // Push her around and, if you get big enough, someone bigger comes calling.
        delayedEffects: [{ eventId: 'mgmt_manager_poaches_you', triggerYear: 2 }],
      },
      {
        text: 'Ceder y confiar en su experiencia',
        style: 'loyal',
        effects: [
          { kind: 'team', role: 'manager', op: 'adjustLoyalty', min: 4, max: 10 },
          { target: 'hiddenTraits.patience', min: 2, max: 4 },
          { target: 'hiddenTraits.authenticity', min: -4, max: -1 },
        ],
        // Trust her fully and you stop checking the books.
        delayedEffects: [{ eventId: 'setback_manager_embezzlement', triggerYear: 2 }],
      },
      {
        text: 'Despedirla y buscar otra opción',
        style: 'ambitious',
        effects: [
          { kind: 'team', role: 'manager', op: 'leave' },
          { target: 'finances.cash', min: -35, max: -10 },
          { target: 'stats.industryRespect', min: -6, max: -2 },
          { target: 'stats.hype', min: -6, max: -1 },
        ],
        delayedEffects: [{ eventId: 'mgmt_first_manager', triggerYear: 1 }],
      },
    ],
  },
  {
    id: 'mgmt_hire_lawyer',
    category: 'management',
    title: 'Un abogado de la industria te ofrece sus servicios',
    description: 'Un despacho especializado en música urbana quiere revisar todos tus contratos. No es barato.',
    visibleRisk: 'low',
    condition: (c) => !c.team.lawyer && c.finances.cash >= 80 && c.year >= 3,
    weight: () => 3,
    choices: [
      {
        text: 'Contratarlo',
        style: 'safe',
        effects: [
          { kind: 'team', role: 'lawyer', op: 'hire' },
          { target: 'finances.cash', min: -45, max: -20 },
          { target: 'finances.ownershipPercent', min: 1, max: 4 },
        ],
      },
      {
        text: 'Firmar los contratos tú mismo y ahorrar',
        style: 'ambitious',
        effects: [
          { target: 'finances.cash', min: 5, max: 20 },
          { target: 'finances.ownershipPercent', min: -8, max: -2 },
        ],
      },
    ],
  },
  {
    id: 'mgmt_hire_publicist',
    category: 'management',
    title: 'Una firma de prensa quiere encargarse de tu imagen',
    description: 'Te proponen manejar tus entrevistas, redes y crisis por una tarifa mensual alta.',
    visibleRisk: 'low',
    condition: (c) => !c.team.publicist && c.stats.fame >= 20 && c.finances.cash >= 60,
    weight: () => 3,
    choices: [
      {
        text: 'Contratar a la firma',
        style: 'commercial',
        effects: [
          { kind: 'team', role: 'publicist', op: 'hire' },
          { target: 'finances.cash', min: -35, max: -15 },
          { target: 'stats.hype', min: 3, max: 8 },
          { target: 'hiddenTraits.authenticity', min: -3, max: 0 },
        ],
      },
      {
        text: 'Manejar tu imagen tú mismo',
        style: 'loyal',
        effects: [
          { target: 'hiddenTraits.authenticity', min: 1, max: 4 },
          { target: 'stats.hype', min: -4, max: 0 },
        ],
      },
    ],
  },
  {
    id: 'mgmt_hire_booking_agent',
    category: 'management',
    title: 'Un agente de shows quiere tu ruta de conciertos',
    description: 'Dice que puede llenarte la agenda de fechas si le das la exclusiva y una comisión gorda.',
    visibleRisk: 'low',
    condition: (c) => !c.team.bookingAgent && c.stats.livePower >= 8,
    weight: () => 3,
    choices: [
      {
        text: 'Darle la exclusiva',
        style: 'ambitious',
        effects: [
          { kind: 'team', role: 'bookingAgent', op: 'hire' },
          { target: 'finances.cash', min: -25, max: -8 },
          { target: 'stats.livePower', min: 3, max: 8 },
        ],
      },
      {
        text: 'Seguir cerrando shows por tu cuenta',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: -5, max: 6 },
          { target: 'stats.livePower', min: -3, max: 2 },
        ],
      },
    ],
  },
  {
    id: 'mgmt_manager_poaches_you',
    category: 'management',
    title: 'Una mánager más grande te tira los perros',
    description: 'La mánager de varios artistas top quiere sumarte a su lista. Su tarifa también es de otro nivel.',
    visibleRisk: 'high',
    condition: (c) => Boolean(c.team.manager) && c.stats.fame >= 45,
    weight: () => 2,
    choices: [
      {
        text: 'Cambiar de mánager',
        style: 'ambitious',
        effects: [
          { kind: 'team', role: 'manager', op: 'leave' },
          { kind: 'team', role: 'manager', op: 'hire', personId: 'mgr_la_jefa' },
          { target: 'finances.cash', min: -80, max: -30 },
          { target: 'stats.industryRespect', min: -2, max: 8 },
          { target: 'hiddenTraits.loyalty', min: -5, max: -1 },
        ],
      },
      {
        text: 'Quedarte con quien te trajo hasta aquí',
        style: 'loyal',
        effects: [
          { kind: 'team', role: 'manager', op: 'adjustLoyalty', min: 8, max: 15 },
          { target: 'hiddenTraits.loyalty', min: 3, max: 6 },
          { target: 'stats.internationalReach', min: -4, max: 0 },
        ],
      },
    ],
  },
  {
    id: 'mgmt_hire_producer',
    category: 'management',
    title: 'Un productor quiere ser tu mano derecha',
    description: 'Un productor con oído quiere dejar de trabajar por proyecto y sentarse contigo de fijo, en exclusiva.',
    visibleRisk: 'low',
    condition: (c) => !c.team.producer && c.stats.hype >= 20 && c.finances.cash >= 50,
    weight: () => 3,
    choices: [
      {
        text: 'Ficharlo en exclusiva',
        style: 'ambitious',
        effects: [
          { kind: 'team', role: 'producer', op: 'hire' },
          { target: 'finances.cash', min: -45, max: -20 },
          { target: 'attributes.productionSense', min: 2, max: 5 },
        ],
        delayedEffects: [{ eventId: 'rel_producer_loyalty_test', triggerYear: 2 }],
      },
      {
        text: 'Seguir trabajando con varios',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.adaptability', min: 1, max: 4 },
          { target: 'attributes.originality', min: 0, max: 3 },
        ],
      },
    ],
  },
  {
    id: 'mgmt_label_takes_a_meeting',
    category: 'management',
    title: 'Un sello grande te cita a una reunión',
    description: 'No es una oferta todavía. Quieren conocerte, ver de qué vas y medir cuánto pedirías. Cómo llegues a esa sala marca el resto.',
    visibleRisk: 'low',
    condition: (c) => !c.team.label && c.stats.hype >= 22 && c.stats.hype < 55,
    weight: () => 4,
    choices: [
      {
        text: 'Ir con cifras y un plan claro',
        style: 'ambitious',
        effects: [
          { target: 'attributes.business', min: 2, max: 5 },
          { target: 'stats.industryRespect', min: 2, max: 6 },
        ],
      },
      {
        text: 'Ir de frío, a ver qué ofrecen',
        style: 'safe',
        effects: [
          { target: 'stats.industryRespect', min: -2, max: 3 },
          { target: 'hiddenTraits.patience', min: 1, max: 3 },
        ],
      },
      {
        text: 'Mandar a tu gente y hacerte el difícil',
        style: 'commercial',
        effects: [
          { target: 'stats.hype', min: 1, max: 5 },
          { target: 'hiddenTraits.ego', min: 1, max: 4 },
          { target: 'stats.industryRespect', min: -3, max: 2 },
        ],
      },
    ],
  },
]
