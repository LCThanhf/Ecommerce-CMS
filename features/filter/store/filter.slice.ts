import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type FilterValues = {
  priceFrom: number
  priceTo: number
  ratingFrom: number
  ratingTo: number
}

interface FilterState {
  filter: FilterValues
  debouncedFilter: FilterValues
}

const DEFAULT_FILTER: FilterValues = {
  priceFrom: 0,
  priceTo: 10_000_000,
  ratingFrom: 0,
  ratingTo: 5,
}

const initialState: FilterState = {
  filter: DEFAULT_FILTER,
  debouncedFilter: DEFAULT_FILTER,
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterValues>) => {
      state.filter = action.payload
    },
    setDebouncedFilter: (state, action: PayloadAction<FilterValues>) => {
      state.debouncedFilter = action.payload
    },
  },
})

export const { setFilter, setDebouncedFilter } = filterSlice.actions
export default filterSlice.reducer
