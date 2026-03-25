'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import galaxyA31 from '../../assets/samsung-galaxy-a31.png'

type Product = {
  id: number
  name: string
  price: string
  priceValue: number
  rating: number
}

const PRODUCT_NAMES = [
  'Samsung Galaxy A31',
  'Samsung Galaxy A52',
  'Samsung Galaxy M32',
  'Samsung Galaxy S21 FE',
  'Samsung Galaxy A22',
  'Samsung Galaxy M52',
  'Samsung Galaxy A72',
  'Samsung Galaxy F62',
]

const products: Product[] = Array.from({ length: 40 }, (_, index) => {
  const id = index + 1
  const priceValue = ((id % 10) + 1) * 1_000_000
  const rating = (id % 5) + 1
  return {
    id,
    name: PRODUCT_NAMES[index % PRODUCT_NAMES.length],
    price: priceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0VN\u0110',
    priceValue,
    rating,
  }
})

const INITIAL_VISIBLE_COUNT = 16
const LOAD_MORE_COUNT = 4
const LOAD_DELAY_MS = 700

function RatingStar({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 59 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M47.7227 59.9961L29.4928 49.7439L11.2586 59.9886L14.7446 38.2831L-0.00270414 22.9072L20.3817 19.7446L29.5016 -0.00265632L38.6141 19.7488L58.9973 22.92L44.2447 38.2892L47.7227 59.9961Z"
        fill="#FFCC00"
      />
      <path
        d="M38.6758 19.623C29.444 33.0596 29.3438 33.2058 29.3438 33.2058L58.9352 22.845L38.6758 19.623Z"
        fill="#FFE680"
      />
      <path d="M29.4955 32.917V49.7877L11.0774 59.8945L29.4955 32.917Z" fill="#FFDD55" />
      <path d="M29.4955 32.917L47.6047 59.3803L44.2057 37.9488L29.4955 32.917Z" fill="#FFDD55" />
      <path d="M0.117065 22.8678L29.4971 32.9177L20.4195 19.6523L0.117065 22.8678Z" fill="#FFE680" />
      <path d="M29.4955 32.917V0.0409241L38.5572 19.6448L29.4955 32.917Z" fill="#FFDD55" />
      <path d="M11.2657 59.622L14.6866 38.0095L29.498 32.917L11.2657 59.622Z" fill="#FFD42A" />
    </svg>
  )
}

function PhoneThumbnail() {
  return (
    <div className="relative h-36 w-28 md:h-44 md:w-32">
      <Image
        src={galaxyA31}
        alt="Samsung Galaxy A31"
        fill
        loading="lazy"
        sizes="(max-width: 768px) 112px, 128px"
        className="rounded-sm object-contain"
      />
    </div>
  )
}

function ProductRow({ product, onOpenDetails }: { product: Product; onOpenDetails: (id: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpenDetails(product.id)}
      className="flex w-fit gap-3 rounded-md px-1 py-2 text-left transition hover:bg-white/40 md:gap-4"
    >
      <PhoneThumbnail />

      <div className="flex flex-col justify-center">
        <h3 className="text-lg leading-none font-semibold text-neutral-900 md:text-2xl">{product.name}</h3>
        <p className="mt-2 text-2xl leading-none font-extrabold text-neutral-900 md:mt-4 md:text-4xl">{product.price}</p>
        <div className="mt-2 flex items-center gap-1 text-amber-400">
          {Array.from({ length: product.rating }).map((_, index) => (
            <RatingStar key={index} className="h-10 w-10 shrink-0 md:h-14 md:w-14" />
          ))}
        </div>
      </div>
    </button>
  )
}

export default function ShopSection({
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
}) {
  const router = useRouter()
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLoadingMoreRef = useRef(false)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

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
  }, [normalizedQuery, priceFrom, priceTo, ratingFrom, ratingTo])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT)
    isLoadingMoreRef.current = false
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current)
      loadTimerRef.current = null
    }
  }, [normalizedQuery, priceFrom, priceTo, ratingFrom, ratingTo])

  const productsToRender = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  )
  const hasMore = visibleCount < filteredProducts.length

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) {
      return
    }

    const scrollRoot = document.getElementById('shop-scroll-container')

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || isLoadingMoreRef.current) {
          return
        }

        isLoadingMoreRef.current = true
        loadTimerRef.current = setTimeout(() => {
          setVisibleCount((previousCount) =>
            Math.min(previousCount + LOAD_MORE_COUNT, filteredProducts.length)
          )
          isLoadingMoreRef.current = false
        }, LOAD_DELAY_MS)
      },
      {
        root: scrollRoot,
        rootMargin: '160px 0px'
      }
    )

    observer.observe(sentinelRef.current)

    return () => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current)
        loadTimerRef.current = null
      }
      isLoadingMoreRef.current = false
      observer.disconnect()
    }
  }, [filteredProducts.length, hasMore])

  return (
    <div>
      <div className="grid grid-cols-1 gap-y-4 pb-6 xl:grid-cols-[max-content_max-content] xl:justify-start xl:gap-x-30">
        {productsToRender.map((product) => (
          <ProductRow key={product.id} product={product} onOpenDetails={openDetails} />
        ))}
      </div>

      {hasMore ? <div ref={sentinelRef} className="h-10 w-full" aria-hidden="true" /> : null}

      {filteredProducts.length === 0 ? (
        <div className="rounded-md border border-dashed border-neutral-300 bg-white/70 p-6 text-center text-lg text-neutral-600">
          No products found.
        </div>
      ) : null}
    </div>
  )
}
