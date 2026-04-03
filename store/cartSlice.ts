import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type CartItem = {
  id: number
  name: string
  description: string
  priceValue: number
  priceFormatted: string
  qty: number
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload
    },
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.id === action.payload.id)
      if (existing) {
        existing.qty += 1
      } else {
        state.items.push(action.payload)
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    updateQty(state, action: PayloadAction<{ id: number; delta: number }>) {
      const item = state.items.find((i) => i.id === action.payload.id)
      if (item) {
        item.qty += action.payload.delta
        if (item.qty <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id)
        }
      }
    },
  },
})

export const { hydrateCart, addItem, removeItem, updateQty } = cartSlice.actions
export default cartSlice.reducer

export const selectCartCount = (state: { cart: CartState }): number =>
  state.cart.items.reduce((sum, i) => sum + i.qty, 0)

export const selectCartItems = (state: { cart: CartState }): CartItem[] => state.cart.items
