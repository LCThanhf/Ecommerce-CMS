import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { renderWithStore } from '@/test-utils'
import ShopPage from './page'

// ── Next.js mocks ──────────────────────────────────────────────────────────
const mockPush = vi.fn()
let mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}))

vi.mock('next/image', () => ({
  default: ({ src, alt }: any) => <img src="mocked-image" alt={alt} />,
}))

vi.mock('next/dynamic', () => ({
  default: (loader: any) => {
    const loaderStr = loader.toString()
    if (loaderStr.includes('shop-section')) {
      return () => <div data-testid="shop-section">Shop Section Mock</div>
    }
    if (loaderStr.includes('cart-section')) {
      return () => <div data-testid="cart-section">Cart Section Mock</div>
    }
    if (loaderStr.includes('profile-section')) {
      return () => <div data-testid="profile-section">Profile Section Mock</div>
    }
    return () => <div>Dynamic Mock</div>
  },
}))

// ── Auth Guard Mock ────────────────────────────────────────────────────────
vi.mock('@/features/auth/auth.hooks', () => ({
  default: () => {},
}))

// ── Section Mocks ──────────────────────────────────────────────────────────
vi.mock('@/features/product/components/shop-section', () => ({
  default: () => <div data-testid="shop-section">Shop Section Mock</div>,
}))

vi.mock('@/features/cart/components/cart-section', () => ({
  default: () => <div data-testid="cart-section">Cart Section Mock</div>,
}))

vi.mock('@/features/user/components/profile-section', () => ({
  default: () => <div data-testid="profile-section">Profile Section Mock</div>,
}))

// ── Fixtures & Setup ───────────────────────────────────────────────────────
const defaultFilter = {
  priceFrom: 0,
  priceTo: 10_000_000,
  ratingFrom: 0,
  ratingTo: 5,
}

const PRELOADED_STATE = {
  search: {
    searchQuery: '',
    debouncedQuery: '',
  },
  filter: {
    filter: defaultFilter,
    debouncedFilter: defaultFilter,
  },
}

function renderPage() {
  return renderWithStore(<ShopPage />, {
    preloadedState: PRELOADED_STATE,
  })
}

// ── Tests ──────────────────────────────────────────────────────────────────
describe('ShopPage', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockSearchParams = new URLSearchParams()
  })

  it('should render Header title "Mobile Shopping"', () => {
    renderPage()
    expect(screen.getByText('Mobile Shopping')).toBeInTheDocument()
  })

  it('should toggle sidebar collapse state when menu button is clicked', () => {
    renderPage()
    const sidebarButton = screen.getByLabelText('Collapse sidebar')
    const menuSpan = screen.getByText('Menu')
    
    // Initial: expanded, so menu label "Menu" has class sm:block
    expect(menuSpan).toHaveClass('sm:block')

    // Collapse
    fireEvent.click(sidebarButton)
    expect(menuSpan).not.toHaveClass('sm:block')
    expect(menuSpan).toHaveClass('hidden')
  })

  it('should handle search input changes by dispatching setSearchQuery', () => {
    const { store } = renderPage()
    const searchInput = screen.getByPlaceholderText('Search...')
    
    fireEvent.change(searchInput, { target: { value: 'iphone' } })
    expect(store.getState().search.searchQuery).toBe('iphone')
  })

  it('should open and close filters popup when filter button is clicked', () => {
    renderPage()
    const filterButton = screen.getByLabelText('Filter')
    
    // Closed initially
    expect(screen.queryByText('Giá')).not.toBeInTheDocument()

    // Open
    fireEvent.click(filterButton)
    expect(screen.getByText('Giá')).toBeInTheDocument()
    expect(screen.getByText('Đánh giá')).toBeInTheDocument()

    // Close
    fireEvent.click(filterButton)
    expect(screen.queryByText('Giá')).not.toBeInTheDocument()
  })

  it('should dispatch setFilter when price/rating dropdowns change in filter popup', () => {
    const { store } = renderPage()
    const filterButton = screen.getByLabelText('Filter')
    
    // Open filter popup
    fireEvent.click(filterButton)

    // Change Price From dropdown
    const priceFromSelect = screen.getByLabelText('Giá từ')
    fireEvent.change(priceFromSelect, { target: { value: '2000000' } })
    expect(store.getState().filter.filter.priceFrom).toBe(2000000)

    // Change Rating To dropdown
    const ratingToSelect = screen.getByLabelText('Đánh giá đến')
    fireEvent.change(ratingToSelect, { target: { value: '4' } })
    expect(store.getState().filter.filter.ratingTo).toBe(4)
  })

  it('should render ShopSection by default when no view search param is present', () => {
    renderPage()
    expect(screen.getByTestId('shop-section')).toBeInTheDocument()
    expect(screen.queryByTestId('cart-section')).not.toBeInTheDocument()
  })

  it('should render CartSection when view search param is "cart"', () => {
    mockSearchParams = new URLSearchParams('view=cart')
    renderPage()
    expect(screen.getByTestId('cart-section')).toBeInTheDocument()
    expect(screen.queryByTestId('shop-section')).not.toBeInTheDocument()
  })

  it('should render ProfileSection when view search param is "profile"', () => {
    mockSearchParams = new URLSearchParams('view=profile')
    renderPage()
    expect(screen.getByTestId('profile-section')).toBeInTheDocument()
    expect(screen.queryByTestId('shop-section')).not.toBeInTheDocument()
  })

  it('should navigate to different sections when nav buttons in sidebar are clicked', () => {
    renderPage()
    const cartNavButton = screen.getByAltText('Cart').closest('button')!
    fireEvent.click(cartNavButton)
    expect(mockPush).toHaveBeenCalledWith('/shop?view=cart')
  })
})
