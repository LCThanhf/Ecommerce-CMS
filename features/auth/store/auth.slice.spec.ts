import { describe, it, expect } from 'vitest'
import authReducer, { loginUser, logoutUser, markAuthHydrated } from './auth.slice'

describe('authSlice', () => {
  const initialState = {
    user: null,
    hasHydrated: false,
  }

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle loginUser', () => {
    const user = { id: 1, username: 'testuser', email: 'test@example.com', role: 'User' }
    const actual = authReducer(initialState, loginUser(user))
    expect(actual.user).toEqual(user)
  })

  it('should handle logoutUser', () => {
    const stateWithUser = {
      user: { id: 1, username: 'testuser', email: 'test@example.com', role: 'User' },
      hasHydrated: true,
    }
    const actual = authReducer(stateWithUser, logoutUser())
    expect(actual.user).toBeNull()
  })

  it('should handle markAuthHydrated', () => {
    const actual = authReducer(initialState, markAuthHydrated())
    expect(actual.hasHydrated).toBe(true)
  })
})
