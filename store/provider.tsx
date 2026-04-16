'use client'

import { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store'
import { hydrateCart } from './cartSlice'
import { loginUser } from './authSlice'
import { getSession } from './usersStorage'
import { fetchProductsRequested, hydrateProducts, markProductsHydrated, type Product } from './productsSlice'
import type { AppDispatch } from './store'

const PRODUCTS_CACHE_KEY = 'ms-products-cache'

const CartHydrator = () => {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const stored = localStorage.getItem('ms-cart')
    if (stored) {
      try {
        dispatch(hydrateCart(JSON.parse(stored)))
      } catch {
        // ignore malformed data
      }
    }
  }, [dispatch])
  return null
}

const AuthHydrator = () => {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const session = getSession()
    if (session) {
      dispatch(loginUser(session))
    }
  }, [dispatch])
  return null
}

const ProductsHydrator = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    let hasCachedProducts = false
    const stored = localStorage.getItem(PRODUCTS_CACHE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { items: Product[]; lastFetchedAt: number | null }
        const hasValidItems = Array.isArray(parsed.items)
        const hasValidTimestamp = parsed.lastFetchedAt === null || typeof parsed.lastFetchedAt === 'number'

        if (hasValidItems && hasValidTimestamp) {
          hasCachedProducts = parsed.items.length > 0
          dispatch(hydrateProducts(parsed))
        }
      } catch {
        // ignore malformed data
      }
    }

    dispatch(markProductsHydrated())

    if (!hasCachedProducts) {
      dispatch(fetchProductsRequested())
    }
  }, [dispatch])

  return null
}

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <CartHydrator />
      <AuthHydrator />
      <ProductsHydrator />
      {children}
    </Provider>
  )
}
