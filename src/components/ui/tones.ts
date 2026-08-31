/** Semantic status tones — shared by StatusPill and the Team/Market/Rival panels. */
export type Tone = 'good' | 'warn' | 'bad' | 'info' | 'neutral' | 'accent'

/** Text-colour class for a tone (used where only the label is coloured). */
export const TONE_TEXT: Record<Tone, string> = {
  good: 'text-status-good',
  warn: 'text-status-warn',
  bad: 'text-status-bad',
  info: 'text-status-info',
  neutral: 'text-ink-subtle',
  accent: 'text-accent',
}

/** Pill recipe (bg + text + ring) for a tone. */
export const TONE_PILL: Record<Tone, string> = {
  good: 'bg-status-good/12 text-status-good ring-status-good/35',
  warn: 'bg-status-warn/12 text-status-warn ring-status-warn/35',
  bad: 'bg-status-bad/12 text-status-bad ring-status-bad/35',
  info: 'bg-status-info/12 text-status-info ring-status-info/35',
  neutral: 'bg-surface-2 text-ink-muted ring-hairline',
  accent: 'bg-accent/12 text-accent ring-accent/40',
}
