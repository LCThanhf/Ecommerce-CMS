import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProductsRequested,
  selectProducts,
  selectProductsError,
  selectProductsHasHydrated,
  selectProductsLastFetchedAt,
  selectProductsLoading,
  type Product,
} from '@/store/productsSlice'
import type { AppDispatch, RootState } from '@/store/store'

const PRODUCTS_CACHE_TTL_MS = 5 * 60 * 1000

export type { Product }

const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>()
  const products = useSelector((state: RootState) => selectProducts(state))
  const loading = useSelector((state: RootState) => selectProductsLoading(state))
  const error = useSelector((state: RootState) => selectProductsError(state))
  const hasHydrated = useSelector((state: RootState) => selectProductsHasHydrated(state))
  const lastFetchedAt = useSelector((state: RootState) => selectProductsLastFetchedAt(state))
  const hasRequestedRef = useRef(false)

  useEffect(() => {
    if (!hasHydrated || loading || hasRequestedRef.current) {
      return
    }

    const isStale = !lastFetchedAt || (Date.now() - lastFetchedAt) > PRODUCTS_CACHE_TTL_MS
    const shouldFetch = products.length === 0 || isStale

    if (shouldFetch) {
      hasRequestedRef.current = true
      dispatch(fetchProductsRequested())
    }
  }, [dispatch, hasHydrated, loading, products.length, lastFetchedAt])

  return { products, loading, error }
}

export default useProducts
