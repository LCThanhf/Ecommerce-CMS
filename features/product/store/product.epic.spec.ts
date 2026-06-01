import { describe, it, expect, vi, afterEach } from 'vitest'
import { Subject, of, throwError } from 'rxjs'
import type { Action } from '@reduxjs/toolkit'
import { fetchProductsEpic } from './product.epic'
import { fetchProducts, fetchProductsSuccess, fetchProductsFailed } from './product.slice'
import * as productApi from './product.api'

const MOCK_POSTS = [
  { id: 1, title: 'Post 1', body: 'Body', userId: 1 },
]

describe('fetchProductsEpic', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should dispatch fetchProductsSuccess with mapped products on a successful fetch', async () => {
    vi.spyOn(productApi, 'fetchPosts').mockReturnValue(of(MOCK_POSTS))

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
  })

  it('should dispatch fetchProductsFailed when fetchPosts throws', async () => {
    vi.spyOn(productApi, 'fetchPosts').mockReturnValue(
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
    const firstFetchSubject = new Subject<typeof MOCK_POSTS>()

    vi.spyOn(productApi, 'fetchPosts')
      .mockReturnValueOnce(firstFetchSubject)
      .mockReturnValueOnce(of([{ id: 2, title: 'Post 2', body: 'Body', userId: 1 }]))

    const action$ = new Subject<Action>()
    const emitted: Action[] = []

    fetchProductsEpic(action$, new Subject() as never, {}).subscribe((a) =>
      emitted.push(a),
    )

    action$.next(fetchProducts()) // first request (in-flight)
    action$.next(fetchProducts()) // second request cancels the first (switchMap)

    await vi.waitFor(() => emitted.length > 0)
    firstFetchSubject.next(MOCK_POSTS) // emit first request result — should be ignored

    // Only the second request result should arrive
    await new Promise((r) => setTimeout(r, 20))
    expect(emitted).toHaveLength(1)
    expect((emitted[0] as ReturnType<typeof fetchProductsSuccess>).payload[0].id).toBe(2)
  })
})
