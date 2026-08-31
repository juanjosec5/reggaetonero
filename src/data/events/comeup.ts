import type { CareerEvent } from '@/types/career'

/**
 * The come-up: a cohesive pool of age-22-25 scenarios so the opening years feel
 * distinct run to run instead of pulling the same handful of prompts. All gated
 * on `year <= 3` (a couple on `<= 2`), most also fade once buzz builds. Effects
 * are deliberately small and spread across every ChoiceStyle so the pool doesn't
 * systematically feed one verdict. No origin gating - regional colour comes from
 * the home-city string already threaded through the run.
 */
export const COMEUP_EVENTS: CareerEvent[] = [
  {
    id: 'comeup_stage_name',
    category: 'music',
    title: 'El nombre con el que te van a conocer',
    description:
      'Vas a soltar tu primer tema serio y todavía no tienes claro cómo te vas a hacer llamar. Lo que elijas ahora te lo comes toda la carrera.',
    visibleRisk: 'low',
    condition: (c) => c.year <= 2,
    weight: () => 5,
    oncePerCareer: true,
    choices: [
      {
        text: 'Un nombre pegajoso, fácil de gritar',
        style: 'commercial',
        effects: [
          { target: 'stats.hype', min: 2, max: 6 },
          { target: 'hiddenTraits.authenticity', min: -3, max: -1 },
        ],
      },
      {
        text: 'Tu apodo de siempre, el del barrio',
        style: 'loyal',
        effects: [
          { target: 'hiddenTraits.authenticity', min: 3, max: 6 },
          { target: 'stats.credibility', min: 1, max: 4 },
        ],
      },
      {
        text: 'Algo raro que nadie más tiene',
        style: 'creative',
        effects: [
          { target: 'attributes.originality', min: 2, max: 5 },
          { target: 'stats.hype', min: -2, max: 3 },
        ],
      },
    ],
  },
  {
    id: 'comeup_first_paid_slot',
    category: 'tour',
    title: 'Te pagan por tocar fuera de tu ciudad',
    description:
      'Un promotor de otra ciudad te ofrece plata de verdad por abrir una fecha. Es lejos y el bus te come casi toda la ganancia.',
    visibleRisk: 'low',
    condition: (c) => c.year <= 3 && c.stats.hype >= 4,
    weight: () => 4,
    oncePerCareer: true,
    choices: [
      {
        text: 'Ir, aunque quedes casi a mano',
        style: 'ambitious',
        effects: [
          { target: 'stats.livePower', min: 3, max: 7 },
          { target: 'stats.fanbase', min: 2, max: 6 },
          { target: 'finances.cash', min: -10, max: 15 },
        ],
      },
      {
        text: 'Pedir más o no moverte',
        style: 'safe',
        effects: [
          { target: 'attributes.business', min: 1, max: 4 },
          { target: 'stats.livePower', min: -1, max: 2 },
        ],
      },
      {
        text: 'Llevar a tu DJ y montar un show real',
        style: 'creative',
        effects: [
          { target: 'stats.livePower', min: 4, max: 8 },
          { target: 'finances.cash', min: -30, max: -10 },
          { target: 'hiddenTraits.discipline', min: 1, max: 3 },
        ],
      },
    ],
  },
  {
    id: 'comeup_first_check',
    category: 'money',
    title: 'El primer cheque de la música',
    description:
      'Te cae el primer pago que sale de una canción tuya. No alcanza para nada, pero es la primera vez que la música te da algo.',
    visibleRisk: 'low',
    condition: (c) => c.year <= 3 && c.stats.fame < 12,
    weight: (c) => 5 - c.year,
    choices: [
      {
        text: 'Meterlo entero en el próximo tema',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: 2, max: 5 },
          { target: 'attributes.productionSense', min: 1, max: 3 },
          { target: 'finances.cash', min: -5, max: 5 },
        ],
      },
      {
        text: 'Guardarlo, por primera vez tienes algo',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: 15, max: 35 },
          { target: 'hiddenTraits.patience', min: 1, max: 4 },
        ],
      },
      {
        text: 'Invitar al combo que estuvo desde el día uno',
        style: 'loyal',
        effects: [
          { target: 'hiddenTraits.loyalty', min: 2, max: 5 },
          { target: 'stats.fanbase', min: 1, max: 4 },
        ],
      },
    ],
  },
  {
    id: 'comeup_first_hater',
    category: 'controversy',
    title: 'Tu primer hater de verdad',
    description:
      'Alguien con más seguidores que tú se puso a bajarte en los comentarios y la gente lo está compartiendo. Es feo, pero te están mirando.',
    visibleRisk: 'medium',
    condition: (c) => c.year <= 3 && c.stats.hype >= 6,
    weight: () => 4,
    choices: [
      {
        text: 'Contestar con una tiraera',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: 4, max: 9 },
          { target: 'stats.credibility', min: -3, max: 2 },
          { target: 'hiddenTraits.ego', min: 2, max: 5 },
        ],
      },
      {
        text: 'Ignorarlo y seguir soltando música',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.resilience', min: 2, max: 5 },
          { target: 'stats.credibility', min: 1, max: 3 },
        ],
      },
      {
        text: 'Reírte y hacer un meme con eso',
        style: 'creative',
        effects: [
          { target: 'stats.hype', min: 2, max: 6 },
          { target: 'hiddenTraits.adaptability', min: 1, max: 4 },
        ],
      },
    ],
  },
  {
    id: 'comeup_family_faith',
    category: 'relationship',
    title: 'En tu casa no creen en esto',
    description:
      'Un familiar mayor te dice de frente que estás perdiendo el tiempo, que consigas algo serio. Te duele porque lo dice de cariño.',
    visibleRisk: 'low',
    condition: (c) => c.year <= 3 && c.stats.fame < 15,
    weight: () => 3,
    choices: [
      {
        text: 'Usarlo de combustible',
        style: 'ambitious',
        effects: [
          { target: 'hiddenTraits.ambition', min: 3, max: 7 },
          { target: 'hiddenTraits.resilience', min: 1, max: 4 },
        ],
      },
      {
        text: 'Sentarte a explicarles el plan',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.patience', min: 2, max: 5 },
          { target: 'attributes.business', min: 1, max: 3 },
        ],
      },
      {
        text: 'Prometerles que en un año verán algo',
        style: 'loyal',
        effects: [
          { target: 'hiddenTraits.discipline', min: 2, max: 5 },
          { target: 'stats.hype', min: -2, max: 2 },
        ],
      },
    ],
  },
  {
    id: 'comeup_studio_hustle',
    category: 'music',
    title: 'Conseguir horas de estudio',
    description:
      'No tienes con qué pagar una sesión completa. Hay formas de entrar al estudio, pero todas cuestan algo.',
    visibleRisk: 'low',
    condition: (c) => c.year <= 2,
    weight: () => 4,
    choices: [
      {
        text: 'Cambiar trabajo de mánager por horas',
        style: 'ambitious',
        effects: [
          { target: 'attributes.productionSense', min: 2, max: 5 },
          { target: 'hiddenTraits.discipline', min: 1, max: 3 },
        ],
      },
      {
        text: 'Grabar de madrugada, cuando está libre y barato',
        style: 'safe',
        effects: [
          { target: 'stats.catalogStrength', min: 2, max: 5 },
          { target: 'hiddenTraits.resilience', min: 1, max: 3 },
          { target: 'finances.cash', min: -15, max: -5 },
        ],
      },
      {
        text: 'Armar un setup casero con lo que sea',
        style: 'creative',
        effects: [
          { target: 'attributes.originality', min: 1, max: 4 },
          { target: 'attributes.productionSense', min: 1, max: 4 },
          { target: 'hiddenTraits.authenticity', min: 1, max: 3 },
        ],
      },
    ],
  },
  {
    id: 'comeup_feature_swap',
    category: 'collaboration',
    title: 'Otro nadie te propone un feature',
    description:
      'Un artista tan chico como tú te ofrece meterse en tu tema si tú te metes en el suyo. Ninguno de los dos mueve una aguja todavía.',
    visibleRisk: 'low',
    condition: (c) => c.year <= 3 && c.stats.fame < 20,
    weight: () => 4,
    choices: [
      {
        text: 'Hacerlo, dos suman más que uno',
        style: 'loyal',
        effects: [
          { target: 'stats.fanbase', min: 2, max: 6 },
          { target: 'stats.hype', min: 1, max: 4 },
          { target: 'hiddenTraits.loyalty', min: 1, max: 3 },
        ],
      },
      {
        text: 'Esperar a alguien que te sume de verdad',
        style: 'ambitious',
        effects: [
          { target: 'hiddenTraits.ambition', min: 1, max: 4 },
          { target: 'stats.hype', min: -2, max: 1 },
        ],
      },
      {
        text: 'Aceptar solo si el tema es raro y arriesgado',
        style: 'creative',
        effects: [
          { target: 'attributes.originality', min: 2, max: 5 },
          { target: 'stats.credibility', min: 1, max: 3 },
        ],
      },
    ],
  },
  {
    id: 'comeup_viral_clip',
    category: 'media',
    title: 'Se hizo viral algo que no es tu música',
    description:
      'Un video tuyo hablando pistolas en la calle explotó. Miles de personas te conocen ahora, pero por un clip, no por una canción.',
    visibleRisk: 'medium',
    condition: (c) => c.year <= 3 && c.stats.hype >= 5,
    weight: () => 4,
    choices: [
      {
        text: 'Soltar un tema de una para aprovechar',
        style: 'commercial',
        effects: [
          { target: 'stats.hype', min: 4, max: 9 },
          { target: 'stats.catalogStrength', min: -3, max: 2 },
          { target: 'hiddenTraits.authenticity', min: -3, max: 0 },
        ],
      },
      {
        text: 'Dejar que pase y salir con algo bien hecho',
        style: 'safe',
        effects: [
          { target: 'stats.catalogStrength', min: 3, max: 6 },
          { target: 'stats.hype', min: -4, max: -1 },
        ],
      },
      {
        text: 'Jugar con el personaje que la gente quiere ver',
        style: 'creative',
        effects: [
          { target: 'attributes.charisma', min: 1, max: 4 },
          { target: 'hiddenTraits.adaptability', min: 2, max: 5 },
        ],
      },
    ],
  },
  {
    id: 'comeup_sketchy_manager',
    category: 'management',
    title: 'Un tipo del ambiente te quiere "manejar"',
    description:
      'Un man conocido en la movida se te acerca ofreciéndote manejarte. No tiene oficina ni contratos, pero conoce a todo el mundo y a ti nadie.',
    visibleRisk: 'medium',
    condition: (c) => c.year <= 3 && c.stats.hype < 15,
    weight: () => 3,
    choices: [
      {
        text: 'Darle una oportunidad de palabra',
        style: 'ambitious',
        effects: [
          { target: 'stats.hype', min: 2, max: 6 },
          { target: 'hiddenTraits.riskTolerance', min: 2, max: 5 },
          { target: 'hiddenTraits.authenticity', min: -2, max: 0 },
        ],
      },
      {
        text: 'Nada sin papeles',
        style: 'safe',
        effects: [
          { target: 'attributes.business', min: 2, max: 4 },
          { target: 'hiddenTraits.patience', min: 1, max: 3 },
        ],
      },
      {
        text: 'Usar sus contactos sin firmar nada',
        style: 'creative',
        effects: [
          { target: 'stats.industryRespect', min: 1, max: 4 },
          { target: 'hiddenTraits.ego', min: 1, max: 4 },
        ],
      },
    ],
  },
  {
    id: 'comeup_freestyle_battle',
    category: 'competition',
    title: 'Te retan a una tarima de freestyle',
    description:
      'En una batalla local te llaman al escenario delante de gente que sí sabe. Si la rompes te respetan; si te trabas, lo van a subir igual.',
    visibleRisk: 'medium',
    condition: (c) => c.year <= 3,
    weight: () => 4,
    choices: [
      {
        text: 'Subir y darlo todo',
        style: 'ambitious',
        effects: [
          { target: 'stats.credibility', min: 3, max: 7 },
          { target: 'attributes.performance', min: 1, max: 4 },
          { target: 'stats.hype', min: 1, max: 5 },
        ],
      },
      {
        text: 'Pasar, todavía no estás listo',
        style: 'safe',
        effects: [
          { target: 'hiddenTraits.patience', min: 1, max: 3 },
          { target: 'stats.credibility', min: -3, max: 0 },
        ],
      },
      {
        text: 'Subir con un flow que nadie usa ahí',
        style: 'creative',
        effects: [
          { target: 'attributes.originality', min: 2, max: 6 },
          { target: 'stats.credibility', min: 1, max: 4 },
        ],
      },
    ],
  },
  {
    id: 'comeup_beat_pack_credit',
    category: 'music',
    title: 'Un productor te fía un pack de beats',
    description:
      'Un productor que va subiendo te ofrece cinco instrumentales a crédito: pagas cuando la música empiece a mover algo.',
    visibleRisk: 'medium',
    condition: (c) => c.year <= 3 && c.stats.catalogStrength < 20,
    weight: () => 3,
    choices: [
      {
        text: 'Aceptar y quedar debiendo',
        style: 'ambitious',
        effects: [
          { target: 'stats.catalogStrength', min: 3, max: 7 },
          { target: 'finances.cash', min: -20, max: -5 },
          { target: 'hiddenTraits.riskTolerance', min: 1, max: 3 },
        ],
        // A handshake deal on beats you never fully paid for.
        delayedEffects: [{ eventId: 'rel_beatmaker_wants_his_cut', triggerYear: 3 }],
      },
      {
        text: 'Solo pagar lo que puedas de contado',
        style: 'safe',
        effects: [
          { target: 'stats.catalogStrength', min: 1, max: 3 },
          { target: 'attributes.business', min: 1, max: 3 },
        ],
      },
      {
        text: 'Proponerle producirte a cambio de puntos',
        style: 'loyal',
        effects: [
          { target: 'hiddenTraits.loyalty', min: 2, max: 5 },
          { target: 'attributes.productionSense', min: 1, max: 4 },
          { target: 'finances.ownershipPercent', min: -3, max: -1 },
        ],
      },
    ],
  },
  {
    id: 'comeup_first_image',
    category: 'media',
    title: 'La primera sesión de fotos',
    description:
      'Te queda algo de plata. Puedes gastarla en fotos y un video que te hagan ver más grande de lo que eres, o guardarla.',
    visibleRisk: 'low',
    condition: (c) => c.year <= 3 && c.stats.fame < 18,
    weight: (c) => 5 - c.year,
    choices: [
      {
        text: 'Invertir en verse grande antes de serlo',
        style: 'commercial',
        effects: [
          { target: 'stats.hype', min: 3, max: 7 },
          { target: 'finances.cash', min: -35, max: -15 },
        ],
      },
      {
        text: 'Guardar la plata para grabar',
        style: 'safe',
        effects: [
          { target: 'finances.cash', min: 5, max: 15 },
          { target: 'stats.catalogStrength', min: 1, max: 3 },
        ],
      },
      {
        text: 'Hacerlo tú mismo con un amigo que edita',
        style: 'creative',
        effects: [
          { target: 'attributes.originality', min: 1, max: 4 },
          { target: 'stats.hype', min: 1, max: 4 },
          { target: 'hiddenTraits.authenticity', min: 1, max: 3 },
        ],
      },
    ],
  },
]
