'use client'

import { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store'
import { hydrateCart } from './cartSlice'
import type { AppDispatch } from './store'

function CartHydrator() {
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

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartHydrator />
      {children}
    </Provider>
  )
}
