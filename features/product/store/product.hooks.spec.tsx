import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { createTestStore } from '@/test-utils'
import useProducts from './product.hooks'
import { fetchProductsSuccess, fetchProductsFailed } from './product.slice'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

describe('useProducts', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  function renderUseProducts(preloadedState?: Parameters<typeof createTestStore>[0]) {
    const store = createTestStore(preloadedState)
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    )
    // Wrap initial render in act so the mount useEffect (dispatch) settles
    let hookResult!: ReturnType<typeof renderHook<ReturnType<typeof useProducts>, unknown>>
    act(() => {
      hookResult = renderHook(() => useProducts(), { wrapper })
    })
    return { result: hookResult.result, store }
  }

  it('should dispatch fetchProducts on mount when products have not been fetched', () => {
    const { store } = renderUseProducts({
      products: { items: [], loading: false, error: null, hasFetched: false },
    })
    // fetchProducts sets loading = true in the reducer
    expect(store.getState().products.loading).toBe(true)
  })

  it('should NOT dispatch fetchProducts if hasFetched is already true', () => {
    const existingProducts = [{ id: 1, name: 'Phone', price: '5 VND', priceValue: 5, rating: 4 }]
    const { result } = renderUseProducts({
      products: { items: existingProducts, loading: false, error: null, hasFetched: true },
    })

    expect(result.current.hasFetched).toBe(true)
    expect(result.current.products).toEqual(existingProducts)
  })

  it('should expose loading state', () => {
    const { result } = renderUseProducts({
      // loading is already true — the epic just hasn't resolved
      products: { items: [], loading: true, error: null, hasFetched: true },
    })

    expect(result.current.loading).toBe(true)
  })

  it('should reflect fetchProductsSuccess in the returned products', () => {
    const { result, store } = renderUseProducts({
      products: { items: [], loading: true, error: null, hasFetched: false },
    })

    const products = [{ id: 1, name: 'Phone', price: '5 VND', priceValue: 5, rating: 4 }]
    act(() => {
      store.dispatch(fetchProductsSuccess(products))
    })

    expect(result.current.products).toEqual(products)
    expect(result.current.loading).toBe(false)
    expect(result.current.hasFetched).toBe(true)
  })

  it('should expose error state after fetchProductsFailed', () => {
    const { result, store } = renderUseProducts({
      products: { items: [], loading: true, error: null, hasFetched: false },
    })

    act(() => {
      store.dispatch(fetchProductsFailed('Không thể tải sản phẩm. Vui lòng thử lại.'))
    })

    expect(result.current.error).toBe('Không thể tải sản phẩm. Vui lòng thử lại.')
    expect(result.current.loading).toBe(false)
  })
})
