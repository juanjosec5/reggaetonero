import { homeCity } from '@/data/cities'
import type { CareerEvent } from '@/types/career'

/**
 * Where you live. `career.residence` also moves automatically as markets open
 * (see `cities.relocationTarget`) — these give the player a say in it, with the
 * usual trade-off: reach and money pull you out, credibility and authenticity
 * pull you home.
 */
export const RELOCATION_EVENTS: CareerEvent[] = [
  {
    id: 'move_miami_offer',
    category: 'management',
    title: 'Tu equipo te quiere en Miami',
    description:
      'Todos los que mueven algo en el género viven allá. El mánager te lo dice sin rodeos: si quieres jugar en las grandes, es hora de mudarte.',
    visibleRisk: 'medium',
    condition: (c) =>
      c.stats.internationalReach >= 8 &&
      c.residence !== 'Miami' &&
      c.residence !== 'Los Ángeles' &&
      c.age <= 33,
    weight: () => 3,
    choices: [
      {
        text: 'Hacer las maletas y mudarte',
        style: 'ambitious',
        effects: [
          { kind: 'move', city: 'Miami' },
          { kind: 'market', op: 'penetrate', marketId: 'us_latin', min: 6, max: 16 },
          { target: 'stats.internationalReach', min: 4, max: 10 },
          { target: 'stats.credibility', min: -3, max: 0 },
          { target: 'hiddenTraits.authenticity', min: -4, max: -1 },
        ],
        delayedEffects: [{ eventId: 'move_settling_in', triggerYear: 2 }],
      },
      {
        text: 'Quedarte donde están los tuyos',
        style: 'loyal',
        effects: [
          { target: 'hiddenTraits.authenticity', min: 3, max: 8 },
          { target: 'stats.credibility', min: 1, max: 5 },
          { target: 'stats.hype', min: -6, max: 0 },
        ],
      },
    ],
  },
  {
    id: 'move_settling_in',
    category: 'management',
    title: 'Vivir fuera te está cambiando',
    description:
      'Llevas un tiempo lejos de casa. La agenda va llena, pero cuando cuelgas el teléfono el apartamento está en silencio y no conoces a nadie en el edificio.',
    visibleRisk: 'low',
    condition: () => false, // Follow-up only: reached through a delayed effect.
    weight: () => 0,
    choices: [
      {
        text: 'Meterte de lleno en la escena de allá',
        style: 'ambitious',
        effects: [
          { target: 'stats.internationalReach', min: 3, max: 8 },
          { target: 'stats.fanbase', min: 4, max: 10 },
          { target: 'hiddenTraits.adaptability', min: 2, max: 6 },
        ],
      },
      {
        text: 'Volverte a casa y grabar desde ahí',
        style: 'loyal',
        effects: [
          { kind: 'move', city: 'home' },
          { target: 'hiddenTraits.authenticity', min: 4, max: 9 },
          { target: 'stats.credibility', min: 2, max: 6 },
          { target: 'stats.hype', min: -6, max: -2 },
        ],
      },
    ],
  },
  {
    id: 'move_la_calls',
    category: 'management',
    title: 'Los Ángeles te está llamando',
    description:
      'Un sello gringo grande te quiere cerca para cruzar al mercado en inglés. Sería el salto más grande de tu carrera — o el momento en que tu gente deja de sentirte suyo.',
    visibleRisk: 'high',
    condition: (c) => c.stats.internationalReach >= 22 && c.residence !== 'Los Ángeles',
    weight: () => 2,
    oncePerCareer: true,
    choices: [
      {
        text: 'Irte y apostar por el crossover',
        style: 'ambitious',
        effects: [
          { kind: 'move', city: 'Los Ángeles' },
          { target: 'stats.internationalReach', min: 6, max: 14 },
          { target: 'stats.culturalImpact', min: 3, max: 9 },
          { target: 'finances.cash', min: 20, max: 90 },
          { target: 'stats.credibility', min: -7, max: -2 },
          { target: 'hiddenTraits.authenticity', min: -6, max: -1 },
        ],
      },
      {
        text: 'Tu escena está donde estás',
        style: 'loyal',
        effects: [
          { target: 'stats.credibility', min: 4, max: 9 },
          { target: 'hiddenTraits.authenticity', min: 2, max: 6 },
          { target: 'stats.internationalReach', min: -4, max: 0 },
        ],
      },
    ],
  },
  {
    id: 'move_back_home',
    category: 'relationship',
    title: 'Extrañas tu ciudad',
    description:
      'Llevas años lejos. Tu familia envejece en fotos y los tuyos ya te hablan como a un visitante. Podrías volver — o aceptar que este es el precio.',
    visibleRisk: 'low',
    condition: (c) => c.age >= 30 && c.residence !== homeCity(c.artist.country),
    weight: () => 3,
    oncePerCareer: true,
    choices: [
      {
        text: 'Volver a casa',
        style: 'loyal',
        effects: [
          { kind: 'move', city: 'home' },
          { target: 'hiddenTraits.authenticity', min: 5, max: 12 },
          { target: 'stats.credibility', min: 3, max: 8 },
          { target: 'hiddenTraits.resilience', min: 2, max: 6 },
          { target: 'stats.hype', min: -8, max: -2 },
        ],
      },
      {
        text: 'El negocio está aquí, no puedes soltarlo',
        style: 'ambitious',
        effects: [
          { target: 'attributes.business', min: 3, max: 7 },
          { target: 'stats.industryRespect', min: 2, max: 6 },
          { target: 'hiddenTraits.authenticity', min: -4, max: -1 },
        ],
      },
    ],
  },
]
