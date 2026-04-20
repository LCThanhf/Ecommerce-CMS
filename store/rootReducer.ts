import { combineReducers } from '@reduxjs/toolkit'
import searchReducer from '@/features/search/search.slice'
import filterReducer from '@/features/filter/filter.slice'
import cartReducer from '@/features/cart/cart.slice'
import authReducer from '@/features/auth/auth.slice'
import toastReducer from '@/features/toast/toast.slice'
import productsReducer from '@/features/product/product.slice'

export const rootReducer = combineReducers({
  search: searchReducer,
  filter: filterReducer,
  cart: cartReducer,
  auth: authReducer,
  toast: toastReducer,
  products: productsReducer,
})

export type RootReducerState = ReturnType<typeof rootReducer>
