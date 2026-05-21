import { describe, it, expect } from 'vitest'
import searchReducer, { setSearchQuery, setDebouncedQuery } from './search.slice'

describe('searchSlice', () => {
  const initialState = {
    searchQuery: '',
    debouncedQuery: '',
  }

  it('should return the initial state', () => {
    expect(searchReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle setSearchQuery', () => {
    const actual = searchReducer(initialState, setSearchQuery('iphone'))
    expect(actual.searchQuery).toBe('iphone')
    expect(actual.debouncedQuery).toBe('')
  })

  it('should handle setDebouncedQuery', () => {
    const actual = searchReducer(initialState, setDebouncedQuery('samsung'))
    expect(actual.debouncedQuery).toBe('samsung')
    expect(actual.searchQuery).toBe('')
  })
})
