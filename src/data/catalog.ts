/**
 * A read-only, id-keyed lookup over a static list of definitions. Replaces the
 * hand-rolled `const X_BY_ID = new Map(...)` + `getX(id) { throw }` (and the
 * `.find()`-or-throw variant) that every data catalog used to repeat.
 */
export interface Catalog<T extends { id: string }> {
  /** Every definition, in declaration order. */
  readonly all: readonly T[]
  /** The definition for `id`, or throws if there is none. */
  get(id: string): T
  /** The definition for `id`, or `undefined` if there is none. */
  find(id: string): T | undefined
}

export function defineCatalog<T extends { id: string }>(name: string, all: T[]): Catalog<T> {
  const byId = new Map(all.map((item) => [item.id, item]))
  return {
    all,
    get(id) {
      const item = byId.get(id)
      if (!item) throw new Error(`Unknown ${name}: ${id}`)
      return item
    },
    find: (id) => byId.get(id),
  }
}
