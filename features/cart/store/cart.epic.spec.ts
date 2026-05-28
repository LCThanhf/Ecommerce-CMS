import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { Subject } from 'rxjs'
import type { Action } from '@reduxjs/toolkit'
import { cartPersistEpic, cartToastEpic } from './cart.epic'
import { addItem, addItemSilent, removeItem, updateQty } from './cart.slice'
import { showToast, hideToast } from '@/features/toast/store/toast.slice'
import type { CartItem } from './cart.slice'

const SAMPLE_ITEM: CartItem = {
  id: 1,
  name: 'Samsung Galaxy A31',
  description: 'A smartphone',
  priceValue: 5_000_000,
  priceFormatted: '5\u00a0000\u00a0000\u00a0VN\u0110',
  qty: 1,
}

describe('cartPersistEpic', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should persist cart to localStorage after addItem (debounced 150ms)', () => {
    vi.useFakeTimers()

    const action$ = new Subject<Action>()
    const state$ = new Subject<unknown>()

    cartPersistEpic(action$, state$ as never, {}).subscribe()

    // Simulate state after addItem
    action$.next(addItem(SAMPLE_ITEM))
    state$.next({ cart: { items: [SAMPLE_ITEM] } })

    // Not persisted yet
    vi.advanceTimersByTime(149)
    expect(localStorage.getItem('ms-cart')).toBeNull()

    // After debounce
    vi.advanceTimersByTime(1)
    expect(localStorage.getItem('ms-cart')).toBe(JSON.stringify([SAMPLE_ITEM]))
    expect(localStorage.getItem('ms-cart-count')).toBe('1')
  })

  it('should debounce multiple rapid cart changes and persist once', () => {
    vi.useFakeTimers()

    const action$ = new Subject<Action>()
    const state$ = new Subject<unknown>()
    let persistCallCount = 0

    // Spy on localStorage.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      persistCallCount++
    })

    cartPersistEpic(action$, state$ as never, {}).subscribe()

    action$.next(addItem(SAMPLE_ITEM))
    state$.next({ cart: { items: [SAMPLE_ITEM] } })
    vi.advanceTimersByTime(50)

    action$.next(updateQty({ id: 1, delta: 1 }))
    state$.next({ cart: { items: [{ ...SAMPLE_ITEM, qty: 2 }] } })
    vi.advanceTimersByTime(50)

    action$.next(removeItem(1))
    state$.next({ cart: { items: [] } })

    // None persisted yet
    expect(persistCallCount).toBe(0)

    vi.advanceTimersByTime(150)
    // Only ONE persist after debounce settles
    expect(persistCallCount).toBe(2) // ms-cart + ms-cart-count = 2 setItem calls
  })
})

describe('cartToastEpic', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should show a toast immediately when addItem is dispatched', () => {
    const action$ = new Subject<Action>()
    const emitted: Action[] = []

    cartToastEpic(action$, new Subject() as never, {}).subscribe((a) =>
      emitted.push(a),
    )

    action$.next(addItem(SAMPLE_ITEM))

    // showToast should fire synchronously
    expect(emitted).toHaveLength(1)
    expect(emitted[0]).toEqual(showToast('Đã thêm vào giỏ hàng!'))
  })

  it('should hide the toast after 2000ms', () => {
    vi.useFakeTimers()

    const action$ = new Subject<Action>()
    const emitted: Action[] = []

    cartToastEpic(action$, new Subject() as never, {}).subscribe((a) =>
      emitted.push(a),
    )

    action$.next(addItem(SAMPLE_ITEM))
    expect(emitted).toHaveLength(1) // showToast

    vi.advanceTimersByTime(1999)
    expect(emitted).toHaveLength(1) // still just showToast

    vi.advanceTimersByTime(1)
    expect(emitted).toHaveLength(2)
    expect(emitted[1]).toEqual(hideToast())
  })

  it('should NOT trigger toast for addItemSilent', () => {
    const action$ = new Subject<Action>()
    const emitted: Action[] = []

    cartToastEpic(action$, new Subject() as never, {}).subscribe((a) =>
      emitted.push(a),
    )

    // addItemSilent should not trigger the toast epic (it only listens to addItem.type)
    action$.next(addItemSilent(SAMPLE_ITEM))

    expect(emitted).toHaveLength(0)
  })
})
