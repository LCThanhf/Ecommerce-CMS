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

export interface ProductsState {
  items: Product[]
  loading: boolean
  error: string | null
  hasFetched: boolean
}
