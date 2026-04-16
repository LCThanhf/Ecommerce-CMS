'use client'

import { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store'
import { hydrateCart } from './cartSlice'
import { loginUser } from './authSlice'
import { getSession } from './usersStorage'
import type { AppDispatch } from './store'

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

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <CartHydrator />
      <AuthHydrator />
      {children}
    </Provider>
  )
}
