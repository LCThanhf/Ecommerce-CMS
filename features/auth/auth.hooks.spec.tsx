import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { createTestStore } from '@/test-utils'
import useAuthGuard from './auth.hooks'

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

vi.mock('@/features/auth/auth.storage', () => ({
  getSession: vi.fn(() => null),
}))

// Must use the same specifier as vi.mock so vi.mocked() operates on the mock, not the real function
import { getSession } from '@/features/auth/auth.storage'

describe('useAuthGuard', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    vi.mocked(getSession).mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function renderUseAuthGuard(preloadedState?: Parameters<typeof createTestStore>[0]) {
    const store = createTestStore(preloadedState)
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    )
    return renderHook(() => useAuthGuard(), { wrapper })
  }

  it('should return isReady: false before hydration completes', () => {
    const { result } = renderUseAuthGuard({
      auth: { user: null, hasHydrated: false },
    })

    expect(result.current.isReady).toBe(false)
    // Router should NOT redirect yet — hydration hasn't finished
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('should redirect to /login after hydration when there is no user or session', () => {
    vi.mocked(getSession).mockReturnValue(null)

    renderUseAuthGuard({
      auth: { user: null, hasHydrated: true },
    })

    expect(mockReplace).toHaveBeenCalledWith('/login')
  })

  it('should return isReady: true and NOT redirect when a Redux user is present', () => {
    const { result } = renderUseAuthGuard({
      auth: { user: { username: 'testuser', email: 'test@example.com' }, hasHydrated: true },
    })

    expect(result.current.isReady).toBe(true)
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('should return isReady: true and NOT redirect when a session exists (remember me)', () => {
    vi.mocked(getSession).mockReturnValue({ username: 'testuser', email: 'test@example.com' })

    const { result } = renderUseAuthGuard({
      auth: { user: null, hasHydrated: true },
    })

    expect(result.current.isReady).toBe(true)
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
