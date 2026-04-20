import { type Epic, ofType } from 'redux-observable'
import { debounceTime, delay, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators'
import { EMPTY, concat, of } from 'rxjs'
import type { Action } from '@reduxjs/toolkit'
import { addItem, addItemSilent, removeItem, updateQty, type CartItem } from './cart.slice'
import { showToast, hideToast } from '@/features/toast/toast.slice'

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
      ),
    ),
  )
