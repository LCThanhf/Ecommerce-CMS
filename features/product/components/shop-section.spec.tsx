import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { renderWithStore } from '@/test-utils'
import ShopSection from './shop-section'
import type { Product } from '../store/product.slice'

// ── Next.js mocks ──────────────────────────────────────────────────────────
const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, className }: { src: any; alt: string; className?: string }) => (
    <img src={typeof src === 'object' ? 'mocked-image' : src} alt={alt} className={className} />
  ),
}))

// ── IntersectionObserver Mock ──────────────────────────────────────────────
class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

// ── Fixtures ───────────────────────────────────────────────────────────────
const PRODUCT_1: Product = {
  id: 1,
  name: 'Samsung Galaxy A31',
  price: '5\u00a0000\u00a0000\u00a0VNĐ',
  priceValue: 5000000,
  rating: 4,
}

const PRODUCT_2: Product = {
  id: 2,
  name: 'Samsung Galaxy S21 FE',
  price: '8\u00a0000\u00a0000\u00a0VNĐ',
  priceValue: 8000000,
  rating: 5,
}

// ── Helpers ────────────────────────────────────────────────────────────────
function renderShop(
  productsState: {
    items: Product[]
    loading: boolean
    error: string | null
    hasFetched: boolean
  }
) {
  return renderWithStore(<ShopSection />, {
    preloadedState: { products: productsState },
  })
}

// ── Tests ──────────────────────────────────────────────────────────────────
describe('ShopSection', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('should show loading message when loading state is true', () => {
    renderShop({ items: [], loading: true, error: null, hasFetched: false })
    expect(screen.getByText('Đang tải sản phẩm...')).toBeInTheDocument()
  })

  it('should show loading message when hasFetched is false', () => {
    renderShop({ items: [], loading: false, error: null, hasFetched: false })
    expect(screen.getByText('Đang tải sản phẩm...')).toBeInTheDocument()
  })

  it('should show error message when fetch fails', () => {
    renderShop({ items: [], loading: false, error: 'Lỗi kết nối mạng', hasFetched: true })
    expect(screen.getByText('Lỗi kết nối mạng')).toBeInTheDocument()
  })

  it('should show empty message when no products match filters', () => {
    renderShop({ items: [], loading: false, error: null, hasFetched: true })
    expect(screen.getByText('No products found.')).toBeInTheDocument()
  })

  it('should render product list when products are loaded', () => {
    renderShop({ items: [PRODUCT_1, PRODUCT_2], loading: false, error: null, hasFetched: true })
    expect(screen.getByText('Samsung Galaxy A31')).toBeInTheDocument()
    expect(screen.getByText('Samsung Galaxy S21 FE')).toBeInTheDocument()
    expect(screen.getByText(/5.000.000.*VNĐ/)).toBeInTheDocument()
    expect(screen.getByText(/8.000.000.*VNĐ/)).toBeInTheDocument()
  })

  it('should navigate to product detail page when a product is clicked', () => {
    renderShop({ items: [PRODUCT_1], loading: false, error: null, hasFetched: true })
    const productButton = screen.getByText('Samsung Galaxy A31').closest('button')!
    fireEvent.click(productButton)
    expect(mockPush).toHaveBeenCalledWith('/shop/product/1')
  })
})
