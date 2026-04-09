import { type Epic, ofType, combineEpics } from 'redux-observable'
import { debounceTime, map, mergeMap, tap, withLatestFrom, switchMap, delay } from 'rxjs/operators'
import { EMPTY, concat, of } from 'rxjs'
import { setSearchQuery, setDebouncedQuery } from './searchSlice'
import { setFilter, setDebouncedFilter } from './filterSlice'
import { addItem, addItemSilent, removeItem, updateQty } from './cartSlice'
import type { CartItem } from './cartSlice'
import { showToast, hideToast } from './toastSlice'
import type { Action } from '@reduxjs/toolkit'

export const searchDebounceEpic: Epic<Action, Action, unknown> = (action$) =>
  action$.pipe(
    ofType(setSearchQuery.type),
    debounceTime(300),
    map((action) => setDebouncedQuery((action as ReturnType<typeof setSearchQuery>).payload)),
  )

export const filterDebounceEpic: Epic<Action, Action, unknown> = (action$) =>
  action$.pipe(
    ofType(setFilter.type),
    debounceTime(300),
    map((action) => setDebouncedFilter((action as ReturnType<typeof setFilter>).payload)),
  )

export const cartPersistEpic: Epic<Action, Action, unknown> = (action$, state$) =>
  action$.pipe(
    ofType(addItem.type, addItemSilent.type, removeItem.type, updateQty.type),
    debounceTime(150),
    withLatestFrom(state$),
    tap(([, state]) => {
      const items = (state as { cart: { items: CartItem[] } }).cart.items
      localStorage.setItem('ms-cart', JSON.stringify(items))
      const totalQty = items.reduce((sum, i) => sum + i.qty, 0)
      localStorage.setItem('ms-cart-count', String(totalQty))
    }),
    mergeMap(() => EMPTY),
  )

export const cartToastEpic: Epic<Action, Action, unknown> = (action$) =>
  action$.pipe(
    ofType(addItem.type),
    switchMap(() =>
      concat(
        of(showToast('Đã thêm vào giỏ hàng!')),
        of(hideToast()).pipe(delay(2000)),
      )
    ),
  )

export const rootEpic = combineEpics(searchDebounceEpic, filterDebounceEpic, cartPersistEpic, cartToastEpic)
