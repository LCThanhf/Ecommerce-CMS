import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface ShopUiState {
  isCollapsed: boolean
  isFilterOpen: boolean
}

const initialState: ShopUiState = {
  isCollapsed: false,
  isFilterOpen: false,
}

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isCollapsed = !state.isCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isCollapsed = action.payload
    },
    toggleFilter: (state) => {
      state.isFilterOpen = !state.isFilterOpen
    },
    setFilterOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterOpen = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarCollapsed, toggleFilter, setFilterOpen } = shopSlice.actions
export default shopSlice.reducer
