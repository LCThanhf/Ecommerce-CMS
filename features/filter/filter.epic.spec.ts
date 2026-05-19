import { describe, it, expect, vi, afterEach } from 'vitest'
import { Subject } from 'rxjs'
import type { Action } from '@reduxjs/toolkit'
import { filterDebounceEpic } from './filter.epic'
import { setFilter, setDebouncedFilter } from './filter.slice'
import type { FilterValues } from './filter.slice'

const FILTER_A: FilterValues = { priceFrom: 0, priceTo: 5_000_000, ratingFrom: 0, ratingTo: 5 }
const FILTER_B: FilterValues = { priceFrom: 1_000_000, priceTo: 8_000_000, ratingFrom: 3, ratingTo: 5 }

describe('filterDebounceEpic', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should emit setDebouncedFilter after 300ms debounce', () => {
    vi.useFakeTimers()

    const action$ = new Subject<Action>()
    const emitted: Action[] = []

    filterDebounceEpic(action$, new Subject() as never, {}).subscribe((a) =>
      emitted.push(a),
    )

    action$.next(setFilter(FILTER_A))

    vi.advanceTimersByTime(299)
    expect(emitted).toHaveLength(0)

    vi.advanceTimersByTime(1)
    expect(emitted).toHaveLength(1)
    expect(emitted[0]).toEqual(setDebouncedFilter(FILTER_A))
  })

  it('should only emit the last filter when slider moves rapidly', () => {
    vi.useFakeTimers()

    const action$ = new Subject<Action>()
    const emitted: Action[] = []

    filterDebounceEpic(action$, new Subject() as never, {}).subscribe((a) =>
      emitted.push(a),
    )

    action$.next(setFilter(FILTER_A))
    vi.advanceTimersByTime(100)
    action$.next(setFilter(FILTER_B))

    vi.advanceTimersByTime(300)
    expect(emitted).toHaveLength(1)
    expect(emitted[0]).toEqual(setDebouncedFilter(FILTER_B))
  })
})
