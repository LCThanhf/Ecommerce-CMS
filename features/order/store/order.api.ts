import { api } from '@/services/api'
import type { Order, CreateOrderRequest, OrderStatus } from './order.types'

export const orderApi = {
  createOrder: (payload: CreateOrderRequest): Promise<Order> => {
    return api.post<Order>('/orders', payload)
  },
  getMyOrders: (): Promise<Order[]> => {
    return api.get<Order[]>('/orders')
  },
  getOrderById: (id: number): Promise<Order> => {
    return api.get<Order>(`/orders/${id}`)
  },
  // Admin endpoints
  getAllOrders: (): Promise<Order[]> => {
    return api.get<Order[]>('/admin/orders')
  },
  updateOrderStatus: (id: number, status: OrderStatus): Promise<Order> => {
    return api.put<Order>(`/admin/orders/${id}/status`, { status })
  },
}
