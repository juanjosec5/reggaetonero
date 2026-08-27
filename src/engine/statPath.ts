import { clampAttribute, clampStat, clampTrait } from '@/engine/constants'
import type { Career } from '@/types/career'

type Namespace = 'attributes' | 'hiddenTraits' | 'stats' | 'finances'

function parseTarget(target: string): { namespace: Namespace; key: string } {
  const [namespace, key] = target.split('.')
  if (!namespace || !key || !isNamespace(namespace)) {
    throw new Error(`Invalid stat target: "${target}"`)
  }
  return { namespace, key }
}

function isNamespace(value: string): value is Namespace {
  return value === 'attributes' || value === 'hiddenTraits' || value === 'stats' || value === 'finances'
}

function getBag(career: Career, namespace: Namespace): Record<string, number> {
  return career[namespace] as unknown as Record<string, number>
}

function clampForTarget(namespace: Namespace, key: string, value: number): number {
  switch (namespace) {
    case 'attributes':
      return clampAttribute(value)
    case 'hiddenTraits':
      return clampTrait(value)
    case 'stats':
      return clampStat(value)
    case 'finances':
      return key === 'ownershipPercent' ? clampStat(value) : Math.max(0, value)
  }
}

/** Reads a stat by dotted path, e.g. "attributes.talent" or "finances.cash". */
export function getStatValue(career: Career, target: string): number {
  const { namespace, key } = parseTarget(target)
  const value = getBag(career, namespace)[key]
  if (typeof value !== 'number') throw new Error(`Unknown stat target: "${target}"`)
  return value
}

/** Mutates `career` in place, adding `delta` to the value at the dotted path and clamping it. */
export function applyStatDelta(career: Career, target: string, delta: number): void {
  const { namespace, key } = parseTarget(target)
  const bag = getBag(career, namespace)
  const current = bag[key]
  if (typeof current !== 'number') throw new Error(`Unknown stat target: "${target}"`)
  bag[key] = clampForTarget(namespace, key, current + delta)
}
