import type { CareerEvent } from '@/types/career'

import { BUSINESS_EVENTS } from './business'
import { COLLABORATION_EVENTS } from './collaboration'
import { COMEUP_EVENTS } from './comeup'
import { COMPETITION_EVENTS } from './competition'
import { CONTROVERSY_EVENTS } from './controversy'
import { HEALTH_EVENTS } from './health'
import { LABEL_EVENTS } from './label'
import { MANAGEMENT_EVENTS } from './management'
import { MEDIA_EVENTS } from './media'
import { MONEY_EVENTS } from './money'
import { MUSIC_EVENTS } from './music'
import { RELATIONSHIP_EVENTS } from './relationship'
import { RELOCATION_EVENTS } from './relocation'
import { SETBACK_EVENTS } from './setbacks'
import { TOUR_EVENTS } from './tour'

export const ALL_EVENTS: CareerEvent[] = [
  ...COMEUP_EVENTS,
  ...MUSIC_EVENTS,
  ...LABEL_EVENTS,
  ...COLLABORATION_EVENTS,
  ...MONEY_EVENTS,
  ...MEDIA_EVENTS,
  ...CONTROVERSY_EVENTS,
  ...MANAGEMENT_EVENTS,
  ...TOUR_EVENTS,
  ...BUSINESS_EVENTS,
  ...COMPETITION_EVENTS,
  ...RELATIONSHIP_EVENTS,
  ...RELOCATION_EVENTS,
  ...HEALTH_EVENTS,
  ...SETBACK_EVENTS,
]

const EVENT_BY_ID = new Map(ALL_EVENTS.map((e) => [e.id, e]))

export function getEventById(id: string): CareerEvent | undefined {
  return EVENT_BY_ID.get(id)
}
