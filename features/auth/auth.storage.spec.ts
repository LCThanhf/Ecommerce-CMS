import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getUsers, saveUser, findUser, getSession, saveSession, clearSession } from './auth.storage'

describe('auth.storage', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('users', () => {
    it('should save and get users', () => {
      const user = { username: 'test', email: 'test@example.com', password: 'password123' }
      saveUser(user)
      const users = getUsers()
      expect(users).toHaveLength(1)
      expect(users[0]).toEqual(user)
    })

    it('should return empty array if no users', () => {
      expect(getUsers()).toEqual([])
    })

    it('should find user with correct credentials', () => {
      const user = { username: 'test', email: 'test@example.com', password: 'password123' }
      saveUser(user)
      expect(findUser('test', 'password123')).toEqual(user)
      expect(findUser('test', 'wrongpassword')).toBeUndefined()
    })
  })

  describe('session', () => {
    it('should save session to localStorage if rememberLogin is true', () => {
      const user = { username: 'test', email: 'test@example.com' }
      saveSession(user, true)
      
      expect(localStorage.getItem('ms-session')).toBeTruthy()
      expect(sessionStorage.getItem('ms-session-temp')).toBeNull()
      expect(getSession()).toEqual(user)
    })

    it('should save session to sessionStorage if rememberLogin is false', () => {
      const user = { username: 'test', email: 'test@example.com' }
      saveSession(user, false)
      
      expect(localStorage.getItem('ms-session')).toBeNull()
      expect(sessionStorage.getItem('ms-session-temp')).toBeTruthy()
      expect(getSession()).toEqual(user)
    })

    it('should clear session from both storages', () => {
      const user = { username: 'test', email: 'test@example.com' }
      saveSession(user, true)
      saveSession(user, false) // Note: saveSession handles clearing the other storage internally, but let's test clearSession directly
      
      // Let's manually set both to test clearSession
      localStorage.setItem('ms-session', JSON.stringify(user))
      sessionStorage.setItem('ms-session-temp', JSON.stringify(user))
      
      clearSession()
      
      expect(localStorage.getItem('ms-session')).toBeNull()
      expect(sessionStorage.getItem('ms-session-temp')).toBeNull()
      expect(getSession()).toBeNull()
    })
  })
})
