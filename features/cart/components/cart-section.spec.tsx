import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { renderWithStore } from '@/test-utils'
import CartSection from './cart-section'
import type { CartItem } from '../cart.slice'

// ── Next.js mocks ──────────────────────────────────────────────────────────
const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('next/image', () => ({
  // Render a plain <img> so src/alt assertions work in jsdom
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={typeof src === 'object' ? 'mocked-image' : src} alt={alt} className={className} />
  ),
}))

// ── Fixtures ───────────────────────────────────────────────────────────────
const ITEM_A: CartItem = {
  id: 1,
  name: 'Samsung Galaxy A31',
  description: 'A great phone',
  priceValue: 5_000_000,
  priceFormatted: '5\u00a0000\u00a0000\u00a0VN\u0110',
  qty: 2,
}

const ITEM_B: CartItem = {
  id: 2,
  name: 'Samsung Galaxy S21',
  description: 'A flagship phone',
  priceValue: 10_000_000,
  priceFormatted: '10\u00a0000\u00a0000\u00a0VN\u0110',
  qty: 1,
}

// ── Helpers ────────────────────────────────────────────────────────────────
function renderCart(items: CartItem[] = [], hasHydrated = true) {
  return renderWithStore(<CartSection />, {
    preloadedState: { cart: { items, hasHydrated } },
  })
}

// ── Tests ──────────────────────────────────────────────────────────────────
describe('CartSection', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  describe('loading & empty states', () => {
    it('should show loading message when cart has not hydrated', () => {
      renderCart([], false)
      expect(screen.getByText('Đang tải giỏ hàng...')).toBeInTheDocument()
    })

    it('should show empty cart message when there are no items', () => {
      renderCart([])
      expect(screen.getByText('No items in cart yet.')).toBeInTheDocument()
    })
  })

  describe('renders cart items', () => {
    it('should display item names and descriptions', () => {
      renderCart([ITEM_A])
      expect(screen.getByText('Samsung Galaxy A31')).toBeInTheDocument()
      expect(screen.getByText('A great phone')).toBeInTheDocument()
    })

    it('should display formatted price', () => {
      renderCart([ITEM_A])
      // priceFormatted uses non-breaking spaces (\u00a0); use regex to match rendered text
      expect(screen.getByText(/5.000.000.*VN/)).toBeInTheDocument()
    })

    it('should display total item count in the bag', () => {
      renderCart([ITEM_A, ITEM_B]) // qty 2 + 1 = 3
      expect(screen.getByText('3 Items in bag')).toBeInTheDocument()
    })

    it('should compute and display SubTotal, Tax (10%), and Total', () => {
      renderCart([ITEM_A]) // 5_000_000 × 2 = 10_000_000; tax = 1_000_000; total = 11_000_000
      expect(screen.getByText('SubTotal')).toBeInTheDocument()
      expect(screen.getByText('Tax')).toBeInTheDocument()
      expect(screen.getByText('Total')).toBeInTheDocument()
    })
  })

  describe('quantity controls', () => {
    it('should increase item quantity when "+" is clicked', () => {
      const { store } = renderCart([ITEM_A])
      fireEvent.click(screen.getByLabelText('Increase quantity'))
      expect(store.getState().cart.items[0].qty).toBe(3)
    })

    it('should decrease item quantity when "-" is clicked (qty > 1)', () => {
      const { store } = renderCart([ITEM_A]) // qty starts at 2
      fireEvent.click(screen.getByLabelText('Decrease quantity'))
      expect(store.getState().cart.items[0].qty).toBe(1)
    })

    it('should open confirmation dialog when "-" is clicked at qty 1', () => {
      renderCart([{ ...ITEM_A, qty: 1 }])
      fireEvent.click(screen.getByLabelText('Decrease quantity'))
      expect(screen.getByText('Xoá sản phẩm')).toBeInTheDocument()
    })
  })

  describe('remove item flow', () => {
    it('should open confirmation dialog when the × button is clicked', () => {
      renderCart([ITEM_A])
      fireEvent.click(screen.getByLabelText('Remove item'))
      expect(screen.getByText('Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng?')).toBeInTheDocument()
    })

    it('should remove the item after confirming in the dialog', () => {
      const { store } = renderCart([ITEM_A])
      fireEvent.click(screen.getByLabelText('Remove item'))
      fireEvent.click(screen.getByText('Xoá'))
      expect(store.getState().cart.items).toHaveLength(0)
    })

    it('should close the dialog when "Huỷ" is clicked', () => {
      renderCart([ITEM_A])
      fireEvent.click(screen.getByLabelText('Remove item'))
      expect(screen.getByText('Xoá sản phẩm')).toBeInTheDocument()
      fireEvent.click(screen.getByText('Huỷ'))
      expect(screen.queryByText('Xoá sản phẩm')).not.toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('should navigate to the product detail page when the image is clicked', () => {
      renderCart([ITEM_A])
      // The product image is wrapped in a <button>
      const imageButton = screen.getByAltText('Samsung Galaxy A31').closest('button')!
      fireEvent.click(imageButton)
      expect(mockPush).toHaveBeenCalledWith('/shop/product/1')
    })
  })
})
