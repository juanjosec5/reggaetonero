import type { Career, ChoiceStyle } from '@/types/career'

/**
 * The "título de reggaetonero" shown in the play header and on the legacy card.
 * Unlike the end-game verdict, it is derived purely from the *style* of the
 * choices the player has made so far, and it sharpens as more decisions land.
 * It is deliberately never one of the verdict titles.
 */
export interface ArtistIdentity {
  id: string
  label: string // Spanish
  blurb: string // one short Spanish line
  /** false until enough decisions have been made to read a direction. */
  defined: boolean
}

/** Decisions needed before an identity resolves out of "Sin definir". */
export const MIN_DECISIONS = 3

/** A secondary style this close to the dominant one (by count) counts as a real blend. */
const BLEND_RATIO = 0.6

const UNDEFINED_IDENTITY: ArtistIdentity = {
  id: 'sin_definir',
  label: 'Sin definir',
  blurb: 'Todavía te estás encontrando.',
  defined: false,
}

const BY_STYLE: Record<ChoiceStyle, Omit<ArtistIdentity, 'defined'>> = {
  commercial: { id: 'el_del_billete', label: 'El del Billete', blurb: 'Cada movida la mides en billete.' },
  creative: { id: 'el_raro', label: 'El Raro', blurb: 'Prefieres sonar distinto que sonar seguro.' },
  ambitious: { id: 'el_hambriento', label: 'El Hambriento', blurb: 'Nunca te conformas con lo que ya tienes.' },
  loyal: { id: 'el_de_la_casa', label: 'El de la Casa', blurb: 'Bailas con los que te trajeron.' },
  safe: { id: 'el_calculador', label: 'El Calculador', blurb: 'No mueves ficha sin calcular el riesgo.' },
}

/** Blends keyed by the two styles sorted alphabetically and joined with "+". */
const BLENDS: Record<string, Omit<ArtistIdentity, 'defined'>> = {
  'commercial+creative': {
    id: 'el_versatil',
    label: 'El Versátil',
    blurb: 'Suenas comercial sin soltar tu rareza.',
  },
  'ambitious+commercial': {
    id: 'el_tiburon',
    label: 'El Tiburón',
    blurb: 'Vas por todo y por todos.',
  },
}

function styleCounts(career: Career): Record<ChoiceStyle, number> {
  const counts: Record<ChoiceStyle, number> = {
    safe: 0,
    ambitious: 0,
    loyal: 0,
    creative: 0,
    commercial: 0,
  }
  for (const year of career.history) {
    if (year.choiceStyle) counts[year.choiceStyle] += 1
  }
  return counts
}

export function computeIdentity(career: Career): ArtistIdentity {
  const counts = styleCounts(career)
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0)
  if (total < MIN_DECISIONS) return UNDEFINED_IDENTITY

  const ranked = (Object.entries(counts) as [ChoiceStyle, number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])

  const [topStyle, topCount] = ranked[0]!
  const second = ranked[1]

  if (second && second[1] >= topCount * BLEND_RATIO) {
    const key = [topStyle, second[0]].sort().join('+')
    const blend = BLENDS[key]
    if (blend) return { ...blend, defined: true }
  }

  return { ...BY_STYLE[topStyle], defined: true }
}
