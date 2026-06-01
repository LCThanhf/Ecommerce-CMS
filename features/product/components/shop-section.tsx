'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import useProducts from '@/features/product/store/product.hooks'
import ProductRow from './product-row'

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
      {totalPages > 1 && !loading && hasFetched && (
        <div className="mt-8 flex items-center justify-center gap-2 pb-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-white"
            aria-label="Previous Page"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1
            const isActive = pageNum === currentPage
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm font-semibold transition ${
                  isActive
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-white"
            aria-label="Next Page"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  )
}

export default ShopSection
