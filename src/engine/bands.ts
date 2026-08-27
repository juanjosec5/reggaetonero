import { BAND_THRESHOLDS } from '@/engine/constants'

export type AttributeBandLabel = 'Natural' | 'Promising' | 'Strong' | 'Elite' | 'Exceptional'

/**
 * Maps a raw 1-100 attribute value to a descriptive band. This is the ONLY
 * form an attribute may take in the UI - the raw number itself must never be
 * rendered to the player. See plan.md section 0.
 */
export function attributeBandLabel(value: number): AttributeBandLabel {
  if (value >= BAND_THRESHOLDS.top) return 'Exceptional'
  if (value >= BAND_THRESHOLDS.veryHigh) return 'Elite'
  if (value >= BAND_THRESHOLDS.high) return 'Strong'
  if (value >= BAND_THRESHOLDS.mid) return 'Promising'
  return 'Natural'
}
