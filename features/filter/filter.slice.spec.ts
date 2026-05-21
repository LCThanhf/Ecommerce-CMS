import { describe, it, expect } from 'vitest'
import filterReducer, { setFilter, setDebouncedFilter } from './filter.slice'
import type { FilterValues } from './filter.slice'

describe('filterSlice', () => {
  const defaultFilter: FilterValues = {
    priceFrom: 0,
    priceTo: 10_000_000,
    ratingFrom: 0,
    ratingTo: 5,
  }

  const initialState = {
    filter: defaultFilter,
    debouncedFilter: defaultFilter,
  }

  const customFilter: FilterValues = {
    priceFrom: 1_000_000,
    priceTo: 5_000_000,
    ratingFrom: 3,
    ratingTo: 4,
  }

  it('should return the initial state', () => {
    expect(filterReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle setFilter', () => {
    const actual = filterReducer(initialState, setFilter(customFilter))
    expect(actual.filter).toEqual(customFilter)
    // debouncedFilter should remain unchanged
    expect(actual.debouncedFilter).toEqual(defaultFilter)
  })

  it('should handle setDebouncedFilter', () => {
    const actual = filterReducer(initialState, setDebouncedFilter(customFilter))
    expect(actual.debouncedFilter).toEqual(customFilter)
    // filter should remain unchanged
    expect(actual.filter).toEqual(defaultFilter)
  })
})
