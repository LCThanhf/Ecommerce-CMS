export type OrderStatus = 'Pending' | 'Processing' | 'Shipping' | 'Completed' | 'Cancelled'

export interface OrderItemDto {
  id?: number
  productId: number
  productName: string
  productImage?: string
  unitPrice: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: number
  orderCode: string
  userId: number
  recipientName: string
  recipientPhone: string
  shippingAddress: string
  paymentMethod: string
  status: OrderStatus
  subTotal: number
  taxAmount: number
  totalAmount: number
  createdAt: string
  items: OrderItemDto[]
}

export interface CreateOrderRequest {
  recipientName: string
  recipientPhone: string
  shippingAddress: string
  paymentMethod?: string
  items: {
    productId: number
    quantity: number
    unitPrice: number
  }[]
}
