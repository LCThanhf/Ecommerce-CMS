import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Product = {
  id: number
  name: string
  price: string
  priceValue: number
  rating: number
  quantity?: number
  description?: string
  image?: string
  subImage1?: string
  subImage2?: string
  subImage3?: string
}



type ProductsState = {
  items: Product[]
  loading: boolean
  error: string | null
  hasFetched: boolean
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  hasFetched: false,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProducts() {
      return initialState
    },
    fetchProducts(state) {
      state.loading = true
      state.error = null
    },
    fetchProductsSuccess(state, action: PayloadAction<Product[]>) {
      state.items = action.payload
      state.loading = false
      state.error = null
      state.hasFetched = true
    },
    fetchProductsFailed(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      state.hasFetched = true
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.items.unshift(action.payload)
    },
    deleteProduct(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
  },
})

export const {
  resetProducts,
  fetchProducts,
  fetchProductsSuccess,
  fetchProductsFailed,
  addProduct,
  deleteProduct,
  updateProduct,
} = productsSlice.actions
export default productsSlice.reducer