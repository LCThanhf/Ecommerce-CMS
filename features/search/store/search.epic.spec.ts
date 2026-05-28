import { describe, it, expect, vi, afterEach } from 'vitest'
import { Subject } from 'rxjs'
import type { Action } from '@reduxjs/toolkit'
import { searchDebounceEpic } from './search.epic'
import { setSearchQuery, setDebouncedQuery } from './search.slice'

describe('searchDebounceEpic', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should emit setDebouncedQuery after 300ms debounce', async () => {
    vi.useFakeTimers()

    const action$ = new Subject<Action>()
    const emitted: Action[] = []

    searchDebounceEpic(action$, new Subject() as never, {}).subscribe((a) =>
      emitted.push(a),
    )

    action$.next(setSearchQuery('iphone'))

    // Not emitted yet
    vi.advanceTimersByTime(299)
    expect(emitted).toHaveLength(0)

    // Now debounce fires
    vi.advanceTimersByTime(1)
    expect(emitted).toHaveLength(1)
    expect(emitted[0]).toEqual(setDebouncedQuery('iphone'))
  })

  it('should debounce: only emit the last value when multiple actions fire quickly', () => {
    vi.useFakeTimers()

    const action$ = new Subject<Action>()
    const emitted: Action[] = []

    searchDebounceEpic(action$, new Subject() as never, {}).subscribe((a) =>
      emitted.push(a),
    )

    action$.next(setSearchQuery('i'))
    action$.next(setSearchQuery('ip'))
    action$.next(setSearchQuery('iph'))
    action$.next(setSearchQuery('ipho'))
    action$.next(setSearchQuery('iphon'))
    action$.next(setSearchQuery('iphone'))

    vi.advanceTimersByTime(300)

    // Only the last value emitted
    expect(emitted).toHaveLength(1)
    expect(emitted[0]).toEqual(setDebouncedQuery('iphone'))
  })

  it('should emit separately for actions spaced farther than 300ms apart', () => {
    vi.useFakeTimers()

    const action$ = new Subject<Action>()
    const emitted: Action[] = []

    searchDebounceEpic(action$, new Subject() as never, {}).subscribe((a) =>
      emitted.push(a),
    )

    action$.next(setSearchQuery('samsung'))
    vi.advanceTimersByTime(300)
    expect(emitted).toHaveLength(1)

    action$.next(setSearchQuery('apple'))
    vi.advanceTimersByTime(300)
    expect(emitted).toHaveLength(2)

    expect(emitted[1]).toEqual(setDebouncedQuery('apple'))
  })
})
