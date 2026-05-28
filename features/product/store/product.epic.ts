import { type Epic, ofType } from 'redux-observable'
import { catchError, map, switchMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import type { Action } from '@reduxjs/toolkit'
import { fetchProducts, fetchProductsSuccess, fetchProductsFailed, mapPostToProduct } from './product.slice'
import { fetchPosts } from './product.api'

export const fetchProductsEpic: Epic<Action, Action, unknown> = (action$) =>
  action$.pipe(
    ofType(fetchProducts.type),
    switchMap(() =>
      from(fetchPosts()).pipe(
        map((posts) => fetchProductsSuccess(posts.map(mapPostToProduct))),
        catchError(() => of(fetchProductsFailed('Không thể tải sản phẩm. Vui lòng thử lại.'))),
      ),
    ),
  )
