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
  },
})

export const { resetProducts, fetchProducts, fetchProductsSuccess, fetchProductsFailed } = productsSlice.actions
export default productsSlice.reducer