import { type Epic, ofType, combineEpics } from 'redux-observable'
import { debounceTime, map, mergeMap, tap, withLatestFrom, switchMap, delay, catchError } from 'rxjs/operators'
import { EMPTY, concat, from, of } from 'rxjs'
import { setSearchQuery, setDebouncedQuery } from './searchSlice'
import { setFilter, setDebouncedFilter } from './filterSlice'
import { addItem, addItemSilent, removeItem, updateQty } from './cartSlice'
import type { CartItem } from './cartSlice'
import { showToast, hideToast } from './toastSlice'
import {
  fetchProductsRequested,
  fetchProductsSuccess,
  fetchProductsFailure,
  mapPostToProduct,
  type Post,
  type Product,
} from './productsSlice'
import type { Action } from '@reduxjs/toolkit'

const PRODUCTS_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts'
const PRODUCTS_CACHE_KEY = 'ms-products-cache'
const PRODUCTS_FETCH_ERROR = 'Không thể tải sản phẩm. Vui lòng thử lại.'

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

export const productsFetchEpic: Epic<Action, Action, unknown> = (action$) =>
  action$.pipe(
    ofType(fetchProductsRequested.type),
    switchMap(() =>
      from(fetch(PRODUCTS_ENDPOINT)).pipe(
        switchMap((response) => {
          if (!response.ok) {
            throw new Error('Bad response')
          }
          return from(response.json() as Promise<Post[]>)
        }),
        map((posts) => fetchProductsSuccess(posts.map(mapPostToProduct))),
        catchError(() => of(fetchProductsFailure(PRODUCTS_FETCH_ERROR))),
      )
    ),
  )

export const productsPersistEpic: Epic<Action, Action, unknown> = (action$, state$) =>
  action$.pipe(
    ofType(fetchProductsSuccess.type),
    withLatestFrom(state$),
    tap(([, state]) => {
      const productsState = (state as { products: { items: Product[]; lastFetchedAt: number | null } }).products
      localStorage.setItem(
        PRODUCTS_CACHE_KEY,
        JSON.stringify({
          items: productsState.items,
          lastFetchedAt: productsState.lastFetchedAt,
        })
      )
    }),
    mergeMap(() => EMPTY),
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

export const rootEpic = combineEpics(
  searchDebounceEpic,
  filterDebounceEpic,
  productsFetchEpic,
  productsPersistEpic,
  cartPersistEpic,
  cartToastEpic,
)
