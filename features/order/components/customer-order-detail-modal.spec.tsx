import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { CustomerOrderDetailModal } from './customer-order-detail-modal'
import type { Order } from '@/features/order/store/order.types'

const MOCK_ORDER: Order = {
  id: 202,
  userId: 1,
  orderCode: 'ORD-CUST-999',
  recipientName: 'Trần Thị B',
  recipientPhone: '0987654321',
  shippingAddress: '456 Lê Lợi, TP. Đà Nẵng',
  paymentMethod: 'COD',
  status: 'Completed',
  subTotal: 1200000,
  taxAmount: 120000,
  totalAmount: 1320000,
  createdAt: '2026-09-09T10:00:00Z',
  items: [
    {
      id: 2,
      productId: 20,
      productName: 'Tai nghe Bluetooth Pro',
      quantity: 2,
      unitPrice: 600000,
      subtotal: 1200000,
    },
  ],
}

describe('CustomerOrderDetailModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <CustomerOrderDetailModal isOpen={false} onClose={vi.fn()} order={MOCK_ORDER} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders customer order details properly when isOpen is true', () => {
    render(
      <CustomerOrderDetailModal isOpen={true} onClose={vi.fn()} order={MOCK_ORDER} />
    )

    expect(screen.getByText(/ORD-CUST-999/)).toBeDefined()
    expect(screen.getByText('Trần Thị B')).toBeDefined()
    expect(screen.getByText('0987654321')).toBeDefined()
    expect(screen.getByText('Tai nghe Bluetooth Pro')).toBeDefined()
    expect(screen.getByText('Hoàn thành')).toBeDefined()
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <CustomerOrderDetailModal isOpen={true} onClose={handleClose} order={MOCK_ORDER} />
    )

    const closeButtons = screen.getAllByRole('button', { name: 'Đóng' })
    expect(closeButtons.length).toBeGreaterThan(0)
    fireEvent.click(closeButtons[0])
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
