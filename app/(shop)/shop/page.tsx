'use client'

import { Suspense } from 'react'
import { ShopLayout } from '@/features/shop/components/shop-layout'

const ShopPage = () => {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-neutral-500">Loading...</div>}>
      <ShopLayout />
    </Suspense>
  )
}

export default ShopPage
