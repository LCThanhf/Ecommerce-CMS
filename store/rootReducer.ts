import { combineReducers } from '@reduxjs/toolkit'
import searchReducer from '@/features/search/store/search.slice'
import filterReducer from '@/features/filter/store/filter.slice'
import cartReducer from '@/features/cart/store/cart.slice'
import authReducer from '@/features/auth/store/auth.slice'
import toastReducer from '@/features/toast/store/toast.slice'
import productsReducer from '@/features/product/store/product.slice'

export const rootReducer = combineReducers({
  search: searchReducer,
  filter: filterReducer,
  cart: cartReducer,
  auth: authReducer,
  toast: toastReducer,
  products: productsReducer,
})

export type RootReducerState = ReturnType<typeof rootReducer>
