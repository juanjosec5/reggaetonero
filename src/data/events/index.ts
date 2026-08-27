import type { CareerEvent } from '@/types/career'

import { COLLABORATION_EVENTS } from './collaboration'
import { CONTROVERSY_EVENTS } from './controversy'
import { LABEL_EVENTS } from './label'
import { MEDIA_EVENTS } from './media'
import { MONEY_EVENTS } from './money'
import { MUSIC_EVENTS } from './music'

export const ALL_EVENTS: CareerEvent[] = [
  ...MUSIC_EVENTS,
  ...LABEL_EVENTS,
  ...COLLABORATION_EVENTS,
  ...MONEY_EVENTS,
  ...MEDIA_EVENTS,
  ...CONTROVERSY_EVENTS,
]

export function getEventById(id: string): CareerEvent | undefined {
  return ALL_EVENTS.find((e) => e.id === id)
}
