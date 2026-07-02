import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const ShopSection = dynamic(() => import('@/features/product/components/shop-section'))
const CartSection = dynamic(() => import('@/features/cart/components/cart-section'))
const ProfileSection = dynamic(() => import('@/features/user/components/profile-section'))

type ViewKey = 'shop' | 'cart' | 'profile'

type FilterState = {
  priceFrom: number
  priceTo: number
  ratingFrom: number
  ratingTo: number
}

interface ShopContentProps {
  view: ViewKey
  searchQuery: string
  filterState: FilterState
}

export const ShopContent = ({
  view,
  searchQuery,
  filterState,
}: ShopContentProps) => {
  if (view === 'cart') {
    return (
      <Suspense
        fallback={
          <div className="flex min-h-115 items-center justify-center rounded-lg border border-neutral-300 bg-white/50 text-xl text-neutral-500">
            Loading...
          </div>
        }
      >
        <CartSection />
      </Suspense>
    )
  }

  if (view === 'profile') {
    return (
      <Suspense
        fallback={
          <div className="flex min-h-115 items-center justify-center rounded-lg border border-neutral-300 bg-white/50 text-xl text-neutral-500">
            Loading...
          </div>
        }
      >
        <ProfileSection />
      </Suspense>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-115 items-center justify-center rounded-lg border border-neutral-300 bg-white/50 text-xl text-neutral-500">
          Loading...
        </div>
      }
    >
      <ShopSection
        searchQuery={searchQuery}
        priceFrom={filterState.priceFrom}
        priceTo={filterState.priceTo}
        ratingFrom={filterState.ratingFrom}
        ratingTo={filterState.ratingTo}
      />
    </Suspense>
  )
}
