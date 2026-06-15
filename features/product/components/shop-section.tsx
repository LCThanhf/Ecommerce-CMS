'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import useProducts from '@/features/product/store/product.hooks'
import ProductRow from './product-row'
import PaginationControls from './pagination-controls'

const ITEMS_PER_PAGE = 10

const ShopSection = ({
  searchQuery = '',
  priceFrom = 0,
  priceTo = 10_000_000,
  ratingFrom = 0,
  ratingTo = 5,
}: {
  searchQuery?: string
  priceFrom?: number
  priceTo?: number
  ratingFrom?: number
  ratingTo?: number
}) => {
  const router = useRouter()
  const { products, loading, error, hasFetched } = useProducts()
  const [currentPage, setCurrentPage] = useState(1)

  const openDetails = (id: number) => {
    router.push(`/shop/product/${id}`)
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (normalizedQuery) {
        const searchableText = `${product.name} ${product.price}`.toLowerCase()
        if (!searchableText.includes(normalizedQuery)) return false
      }
      if (product.priceValue < priceFrom || product.priceValue > priceTo) return false
      if (product.rating < ratingFrom || product.rating > ratingTo) return false
      return true
    })
  }, [products, normalizedQuery, priceFrom, priceTo, ratingFrom, ratingTo])

  // Reset page to 1 whenever filtering/searching criteria change
  useEffect(() => {
    setCurrentPage(1)
  }, [normalizedQuery, priceFrom, priceTo, ratingFrom, ratingTo])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)

  const productsToRender = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        {loading || !hasFetched ? (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <p className="text-xl text-neutral-500">Đang tải sản phẩm...</p>
          </div>
        ) : error ? (
          <div className="rounded-md border border-dashed border-red-300 bg-red-50 p-6 text-center text-lg text-red-600">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <p className="text-xl text-neutral-500">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-4 pb-6 xl:grid-cols-[max-content_max-content] xl:justify-start xl:gap-x-30">
            {productsToRender.map((product) => (
              <ProductRow key={product.id} product={product} onOpenDetails={openDetails} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && hasFetched && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}

export default ShopSection
