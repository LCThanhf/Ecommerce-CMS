import { describe, it, expect, vi, beforeEach } from 'vitest'
import languageReducer, { setLanguage, hydrateLanguage, markLanguageHydrated } from './language.slice'

describe('languageSlice', () => {
  const initialState = {
    language: 'en' as const,
    hasHydrated: false,
  }

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
    })
  })

  it('should return the initial state', () => {
    expect(languageReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle setLanguage', () => {
    const actual = languageReducer(initialState, setLanguage('vi'))
    expect(actual.language).toBe('vi')
    expect(localStorage.setItem).toHaveBeenCalledWith('ms-language', 'vi')
  })

  it('should handle hydrateLanguage', () => {
    const actual = languageReducer(initialState, hydrateLanguage('vi'))
    expect(actual.language).toBe('vi')
    expect(actual.hasHydrated).toBe(true)
  })

  it('should handle markLanguageHydrated', () => {
    const actual = languageReducer(initialState, markLanguageHydrated())
    expect(actual.hasHydrated).toBe(true)
    expect(actual.language).toBe('en')
  })
})
