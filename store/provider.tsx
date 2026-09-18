'use client'

import { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store'
import { hydrateCart, markCartHydrated } from '@/features/cart/store/cart.slice'
import { loginUser, markAuthHydrated } from '@/features/auth/store/auth.slice'
import { getSession } from '@/features/auth/store/auth.storage'
import { hydrateLanguage, markLanguageHydrated } from '@/features/language/store/language.slice'
import type { Language } from '@/features/language/store/language.slice'
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
    dispatch(markCartHydrated())
  }, [dispatch])
  return null
}

const AuthHydrator = () => {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const session = getSession()
    if (session) {
      const token = localStorage.getItem('token')
      let isExpired = false
      if (token) {
        try {
          const payloadBase64 = token.split('.')[1]
          if (payloadBase64) {
            // Support base64url format
            const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
            const payload = JSON.parse(decodedJson)
            if (payload.exp && payload.exp * 1000 < Date.now()) {
              isExpired = true
            }
          }
        } catch (e) {
          isExpired = true
        }
      } else {
        isExpired = true
      }
      
      if (isExpired) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('session-expired', { detail: { isAdmin: false } }))
        }, 100)
      } else {
        dispatch(loginUser(session))
      }
    }
    dispatch(markAuthHydrated())
  }, [dispatch])
  return null
}

const LanguageHydrator = () => {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const stored = localStorage.getItem('ms-language') as Language | null
    if (stored === 'en' || stored === 'vi') {
      dispatch(hydrateLanguage(stored))
    } else {
      dispatch(markLanguageHydrated())
    }
  }, [dispatch])
  return null
}

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <CartHydrator />
      <AuthHydrator />
      <LanguageHydrator />
      {children}
    </Provider>
  )
}
