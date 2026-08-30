import { homeCity } from '@/data/cities'
import { VERDICTS } from '@/data/verdicts'
import { computeIdentity } from '@/engine/identityEngine'
import { formatCount, recordDelta, recordStars, ZERO_DELTA } from '@/engine/stars'
import type { Career, LegacyResult } from '@/types/career'

/**
 * Turns the raw end-of-career numbers into something a player can read: a word
 * for each score, a generated recap, and the plain-text block behind the
 * "Copiar resumen" button. Pure - no Vue.
 */

const SCORE_BANDS: [max: number, label: string][] = [
  [25, 'Flojo'],
  [40, 'Discreto'],
  [55, 'Sólido'],
  [70, 'Fuerte'],
  [Infinity, 'De época'],
]

/** One-word read on a 0-100 legacy score. */
export function scoreBand(score: number): string {
  return SCORE_BANDS.find(([max]) => score < max)![1]
}

/** The numeric 0-100 scores on `LegacyResult` (everything except `verdictId`). */
export type LegacyScoreKey = Exclude<keyof LegacyResult, 'verdictId'>

/** The five scores shown on the card + glossary, in display order. */
export const LEGACY_METRICS: { key: LegacyScoreKey; label: string; blurb: string }[] = [
  { key: 'commercialScore', label: 'Comercial', blurb: 'Qué tan grande sonaste: fama, hype, catálogo y fanáticos.' },
  { key: 'artisticScore', label: 'Artístico', blurb: 'La obra: talento, escritura, originalidad y autenticidad.' },
  { key: 'liveScore', label: 'En vivo', blurb: 'La tarima: presencia, carisma y poder de convocatoria.' },
  { key: 'industryScore', label: 'Industria', blurb: 'El negocio: respeto, contactos y olfato para moverte.' },
  { key: 'longevityScore', label: 'Permanencia', blurb: 'Cuánto te mantuviste arriba a lo largo de la carrera.' },
]

/** Best single-year star rating the career ever hit (0-5, half steps). */
export function peakStars(career: Career): number {
  let best = 0
  let prev = ZERO_DELTA
  for (const year of career.history) {
    const d = recordDelta(year.recordSnapshot, prev)
    best = Math.max(best, recordStars(d, year.statsSnapshot))
    prev = year.recordSnapshot
  }
  return best
}

/** Every city the artist lived in, in order, deduped. */
export function citiesLived(career: Career): string[] {
  const seen = career.history.map((h) => h.residence).filter(Boolean)
  const ordered = seen.length ? seen : [career.residence || homeCity(career.artist.country)]
  return [...new Set(ordered)]
}

/** "4½★" / "3★" / "0★" */
export function formatStars(n: number): string {
  const half = n % 1 >= 0.5
  const whole = Math.floor(n)
  if (whole === 0) return half ? '½★' : '0★'
  return `${whole}${half ? '½' : ''}★`
}

/** "⭐⭐⭐✨" for 3.5, "⭐⭐⭐⭐" for 4, "" for 0 — for the share text. */
export function starEmoji(n: number): string {
  return '⭐'.repeat(Math.floor(n)) + (n % 1 >= 0.5 ? '✨' : '')
}

const AXES = [
  { key: 'commercialScore', label: 'lo comercial' },
  { key: 'artisticScore', label: 'la obra' },
  { key: 'liveScore', label: 'la tarima' },
  { key: 'industryScore', label: 'el negocio' },
] as const

const LEGADO_PHRASE: Record<string, string> = {
  Flojo: 'una carrera que pasó sin dejar mucha huella',
  Discreto: 'un nombre que algunos todavía recuerdan',
  Sólido: 'un nombre que la escena va a recordar',
  Fuerte: 'de los que marcaron su época',
  'De época': 'un nombre que se va a seguir nombrando por años',
}

function highlights(career: Career): string[] {
  const r = career.record
  const out: string[] = []
  if (r.platinumRecords > 0) out.push(`${r.platinumRecords} ${r.platinumRecords === 1 ? 'disco de platino' : 'discos de platino'}`)
  const premios = r.grammys + r.billboards
  if (premios > 0) out.push(`${premios} ${premios === 1 ? 'premio' : 'premios'}`)
  const pk = peakStars(career)
  if (pk >= 3) out.push(`un mejor año de ${formatStars(pk)}`)
  if (r.ticketsSold >= 50_000) out.push(`${formatCount(r.ticketsSold)} entradas vendidas`)
  return out
}

/**
 * A 2-3 sentence Spanish recap tying the verdict, the standout and weak axes,
 * the highlights and the legado together. The share block prints the verdict
 * and legado on their own lines, so it passes `{ verdict: false, legado: false }`.
 */
export function buildRecap(career: Career, opts: { verdict?: boolean; legado?: boolean } = {}): string {
  const { verdict: withVerdict = true, legado: withLegado = true } = opts
  const legacy = career.legacy
  if (!legacy) return ''
  const sentences: string[] = []

  const identity = computeIdentity(career)
  const verdict = VERDICTS.find((v) => v.id === legacy.verdictId)

  if (withVerdict && verdict) {
    const who = identity.defined ? `${identity.label}, ` : ''
    sentences.push(`${who}${career.artist.stageName} se hizo ${verdict.title}.`)
  }

  const ranked = [...AXES].sort((a, b) => legacy[b.key] - legacy[a.key])
  const top = ranked[0]!
  const bottom = ranked[ranked.length - 1]!
  const spread = legacy[top.key] - legacy[bottom.key]
  if (spread >= 12) {
    sentences.push(
      `Lo tuyo fue ${top.label} (${legacy[top.key]} · ${scoreBand(legacy[top.key])}) más que ${bottom.label} (${legacy[bottom.key]} · ${scoreBand(legacy[bottom.key])}).`,
    )
  } else {
    sentences.push(`Una carrera pareja: ${top.label} y ${bottom.label} quedaron cerca.`)
  }

  const hi = highlights(career)
  const cities = citiesLived(career)
  const tail: string[] = []
  if (hi.length) tail.push(`Cerraste con ${hi.join(', ')}`)
  if (cities.length > 1) tail.push(`de ${cities[0]} a ${cities.at(-1)}`)
  if (tail.length) sentences.push(`${tail.join(', ')}.`)

  if (withLegado) {
    sentences.push(`Legado ${legacy.legacyScore}/100 — ${LEGADO_PHRASE[scoreBand(legacy.legacyScore)]}.`)
  }

  return sentences.join(' ')
}

/** The short plain-text block behind "Copiar resumen". */
export function buildShareText(career: Career): string {
  const legacy = career.legacy
  if (!legacy) return ''
  const verdict = VERDICTS.find((v) => v.id === legacy.verdictId)
  const r = career.record
  const pk = peakStars(career)

  const trophies = [`💿 ${r.platinumRecords}`, `🏆 ${r.grammys + r.billboards}`]
  if (r.ticketsSold > 0) trophies.push(`🎟 ${formatCount(r.ticketsSold)}`)
  trophies.push(`Legado ${legacy.legacyScore}/100`)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return [
    `🎤 REGGAETONERO — ${career.artist.stageName} (${career.artist.country})`,
    verdict ? `🏆 ${verdict.title}` : '',
    pk >= 1 ? `Mejor año: ${starEmoji(pk)}` : '',
    trophies.join(' · '),
    origin ? `\n${origin}` : '',
  ]
    .filter((line) => line !== '')
    .join('\n')
}
