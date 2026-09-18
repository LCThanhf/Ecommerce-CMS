import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { OrderDetailModal } from './order-detail-modal'
import type { Order } from '@/features/order/store/order.types'

const MOCK_ORDER: Order = {
  id: 101,
  userId: 1,
  orderCode: 'ORD-TEST-123',
  recipientName: 'Nguyễn Văn A',
  recipientPhone: '0901234567',
  shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
  paymentMethod: 'COD',
  status: 'Pending',
  subTotal: 500000,
  taxAmount: 50000,
  totalAmount: 550000,
  createdAt: '2026-09-10T08:00:00Z',
  items: [
    {
      id: 1,
      productId: 10,
      productName: 'Điện thoại thông minh X',
      quantity: 1,
      unitPrice: 500000,
      subtotal: 500000,
    },
  ],
}

describe('OrderDetailModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <OrderDetailModal
        isOpen={false}
        onClose={vi.fn()}
        order={MOCK_ORDER}
        onUpdateStatus={vi.fn()}
        isUpdatingStatus={false}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders order details correctly when isOpen is true', () => {
    render(
      <OrderDetailModal
        isOpen={true}
        onClose={vi.fn()}
        order={MOCK_ORDER}
        onUpdateStatus={vi.fn()}
        isUpdatingStatus={false}
      />
    )

    expect(screen.getByText('Đơn hàng: #ORD-TEST-123')).toBeDefined()
    expect(screen.getByText('Nguyễn Văn A')).toBeDefined()
    expect(screen.getByText('0901234567')).toBeDefined()
    expect(screen.getByText('123 Đường ABC, Quận 1, TP.HCM')).toBeDefined()
    expect(screen.getByText('Điện thoại thông minh X')).toBeDefined()
  })

  it('calls onClose when close button in footer is clicked', () => {
    const handleClose = vi.fn()
    render(
      <OrderDetailModal
        isOpen={true}
        onClose={handleClose}
        order={MOCK_ORDER}
        onUpdateStatus={vi.fn()}
        isUpdatingStatus={false}
      />
    )

    const closeBtn = screen.getByRole('button', { name: 'Đóng' })
    fireEvent.click(closeBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onUpdateStatus when status select changes', () => {
    const handleUpdate = vi.fn()
    render(
      <OrderDetailModal
        isOpen={true}
        onClose={vi.fn()}
        order={MOCK_ORDER}
        onUpdateStatus={handleUpdate}
        isUpdatingStatus={false}
      />
    )

    const statusSelect = screen.getByLabelText('Cập nhật trạng thái đơn')
    fireEvent.change(statusSelect, { target: { value: 'Processing' } })
    expect(handleUpdate).toHaveBeenCalledWith(101, 'Processing')
  })
})
