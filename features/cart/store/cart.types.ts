export type CartItem = {
  id: number
  name: string
  description: string
  priceValue: number
  priceFormatted: string
  qty: number
  image?: string
}

export interface CartState {
  items: CartItem[]
  hasHydrated: boolean
}
