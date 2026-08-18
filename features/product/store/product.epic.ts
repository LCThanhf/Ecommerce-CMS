import { type Epic, ofType } from 'redux-observable'
import { catchError, map, switchMap } from 'rxjs/operators'
import { of } from 'rxjs'
import type { Action } from '@reduxjs/toolkit'
import { fetchProducts, fetchProductsSuccess, fetchProductsFailed, Product } from './product.slice'
import { fetchProductsAPI } from './product.api'

export const fetchProductsEpic: Epic<Action, Action, unknown> = (action$) =>
  action$.pipe(
    ofType(fetchProducts.type),
    switchMap(() =>
      fetchProductsAPI().pipe(
        map((productions: any[]) => {
          const formattedProducts: Product[] = productions.map(p => ({
            id: p.id,
            name: p.name,
            priceValue: p.price,
            price: `${p.price.toLocaleString('vi-VN')} VNĐ`,
            quantity: p.stockQuantity,
            description: p.description,
            image: p.imageUrl,
            subImage1: p.subImage1,
            subImage2: p.subImage2,
            subImage3: p.subImage3,
            rating: p.rating
          }))
          return fetchProductsSuccess(formattedProducts)
        }),
        catchError((error) => {
          console.error('Lỗi khi fetch sản phẩm:', error)
          return of(fetchProductsFailed('Không thể tải sản phẩm. Vui lòng thử lại.'))
        }),
      ),
    ),
  )

