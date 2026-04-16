import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Post = {
  id: number
  title: string
  body: string
  userId: number
}

export type Product = {
  id: number
  name: string
  price: string
  priceValue: number
  rating: number
}

interface ProductsState {
  items: Product[]
  loading: boolean
  error: string | null
  lastFetchedAt: number | null
  hasHydrated: boolean
}

const PRODUCT_NAMES = [
  'Samsung Galaxy A31',
  'Samsung Galaxy A52',
  'Samsung Galaxy M32',
  'Samsung Galaxy S21 FE',
  'Samsung Galaxy A22',
  'Samsung Galaxy M52',
  'Samsung Galaxy A72',
  'Samsung Galaxy F62',
]

export const mapPostToProduct = (post: Post, index: number): Product => {
  const priceValue = ((post.id % 10) + 1) * 1_000_000
  return {
    id: post.id,
    name: PRODUCT_NAMES[index % PRODUCT_NAMES.length],
    priceValue,
    price: priceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0VNĐ',
    rating: (post.id % 5) + 1,
  }
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  lastFetchedAt: null,
  hasHydrated: false,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsRequested(state) {
      state.error = null
      state.loading = state.items.length === 0
    },
    fetchProductsSuccess(state, action: PayloadAction<Product[]>) {
      state.items = action.payload
      state.loading = false
      state.error = null
      state.lastFetchedAt = Date.now()
    },
    fetchProductsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    hydrateProducts(state, action: PayloadAction<{ items: Product[]; lastFetchedAt: number | null }>) {
      state.items = action.payload.items
      state.lastFetchedAt = action.payload.lastFetchedAt
      state.loading = false
      state.error = null
      state.hasHydrated = true
    },
    markProductsHydrated(state) {
      state.hasHydrated = true
    },
    invalidateProducts(state) {
      state.lastFetchedAt = null
    },
  },
})

export const {
  fetchProductsRequested,
  fetchProductsSuccess,
  fetchProductsFailure,
  hydrateProducts,
  markProductsHydrated,
  invalidateProducts,
} = productsSlice.actions

export const selectProducts = (state: { products: ProductsState }): Product[] => state.products.items
export const selectProductsLoading = (state: { products: ProductsState }): boolean => state.products.loading
export const selectProductsError = (state: { products: ProductsState }): string | null => state.products.error
export const selectProductsLastFetchedAt = (state: { products: ProductsState }): number | null => state.products.lastFetchedAt
export const selectProductsHasHydrated = (state: { products: ProductsState }): boolean => state.products.hasHydrated

export default productsSlice.reducer
