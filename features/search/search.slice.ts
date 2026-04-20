import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  searchQuery: string
  debouncedQuery: string
}

const initialState: SearchState = {
  searchQuery: '',
  debouncedQuery: '',
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setDebouncedQuery: (state, action: PayloadAction<string>) => {
      state.debouncedQuery = action.payload
    },
  },
})

export const { setSearchQuery, setDebouncedQuery } = searchSlice.actions
export default searchSlice.reducer
