import { describe, it, expect, vi, afterEach } from 'vitest'
import { Subject, of, throwError } from 'rxjs'
import type { Action } from '@reduxjs/toolkit'
import { fetchProductsEpic } from './product.epic'
import { fetchProducts, fetchProductsSuccess, fetchProductsFailed } from './product.slice'
import * as productApi from './product.api'

const MOCK_PRODUCTIONS = [
  { id: 1, name: 'Product 1', price: 1000000, stockQuantity: 10, description: 'Desc', imageUrl: 'img.jpg', rating: 4.5 },
]

describe('fetchProductsEpic', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should dispatch fetchProductsSuccess with mapped products on a successful fetch', async () => {
    vi.spyOn(productApi, 'fetchProductsAPI').mockReturnValue(of(MOCK_PRODUCTIONS))

    const action$ = new Subject<Action>()
    const emitted: Action[] = []

    fetchProductsEpic(action$, new Subject() as never, {}).subscribe((a) =>
      emitted.push(a),
    )

    action$.next(fetchProducts())

    // Wait for the async fetch to complete
    await vi.waitFor(() => emitted.length > 0)

    expect(emitted).toHaveLength(1)
    const successAction = emitted[0] as ReturnType<typeof fetchProductsSuccess>
    expect(successAction.type).toBe(fetchProductsSuccess.type)
    expect(successAction.payload).toHaveLength(1)
    expect(successAction.payload[0].id).toBe(1)
    expect(successAction.payload[0].price).toBe('1.000.000 VNĐ')
  })

  it('should dispatch fetchProductsFailed when fetchProductsAPI throws', async () => {
    vi.spyOn(productApi, 'fetchProductsAPI').mockReturnValue(
      throwError(() => new Error('Network error')),
    )

    const action$ = new Subject<Action>()
    const emitted: Action[] = []

    fetchProductsEpic(action$, new Subject() as never, {}).subscribe((a) =>
      emitted.push(a),
    )

    action$.next(fetchProducts())

    await vi.waitFor(() => emitted.length > 0)

    expect(emitted[0].type).toBe(fetchProductsFailed.type)
    expect((emitted[0] as ReturnType<typeof fetchProductsFailed>).payload).toBe(
      'Không thể tải sản phẩm. Vui lòng thử lại.',
    )
  })

  it('should cancel an in-flight request when a new fetchProducts is dispatched', async () => {
    const firstFetchSubject = new Subject<typeof MOCK_PRODUCTIONS>()

    vi.spyOn(productApi, 'fetchProductsAPI')
      .mockReturnValueOnce(firstFetchSubject)
      .mockReturnValueOnce(of([{ id: 2, name: 'Product 2', price: 2000000, stockQuantity: 5, description: 'Desc', imageUrl: 'img2.jpg', rating: 5 }]))

    const action$ = new Subject<Action>()
    const emitted: Action[] = []

    fetchProductsEpic(action$, new Subject() as never, {}).subscribe((a) =>
      emitted.push(a),
    )

    action$.next(fetchProducts()) // first request (in-flight)
    action$.next(fetchProducts()) // second request cancels the first (switchMap)

    await vi.waitFor(() => emitted.length > 0)
    firstFetchSubject.next(MOCK_PRODUCTIONS) // emit first request result — should be ignored

    // Only the second request result should arrive
    await new Promise((r) => setTimeout(r, 20))
    expect(emitted).toHaveLength(1)
    expect((emitted[0] as ReturnType<typeof fetchProductsSuccess>).payload[0].id).toBe(2)
  })
})
