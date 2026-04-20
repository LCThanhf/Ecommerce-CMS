export type CartItem = {
  id: number
  name: string
  description: string
  priceValue: number
  priceFormatted: string
  qty: number
}

export interface CartState {
  items: CartItem[]
  hasHydrated: boolean
}
