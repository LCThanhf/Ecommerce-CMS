'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import galaxyA31 from '../../assets/galaxy A31.png'

type Product = {
  id: number
  name: string
  price: string
}

const products: Product[] = [
  { id: 1, name: 'Samsung Galaxy A31', price: '6 940 000 VND' },
  { id: 2, name: 'Samsung Galaxy A31', price: '6 940 000 VND' },
  { id: 3, name: 'Samsung Galaxy A31', price: '6 940 000 VND' },
  { id: 4, name: 'Samsung Galaxy A31', price: '6 940 000 VND' },
  { id: 5, name: 'Samsung Galaxy A31', price: '6 940 000 VND' },
  { id: 6, name: 'Samsung Galaxy A31', price: '6 940 000 VND' },
]

function PhoneThumbnail() {
  return (
    <div className="relative h-28 w-20 md:h-36 md:w-24">
      <Image
        src={galaxyA31}
        alt="Samsung Galaxy A31"
        fill
        sizes="(max-width: 768px) 80px, 96px"
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
      className="flex w-full gap-3 rounded-md px-1 py-2 text-left transition hover:bg-white/40 md:gap-4"
    >
      <PhoneThumbnail />

      <div className="flex flex-col justify-center">
        <h3 className="text-lg leading-none font-semibold text-neutral-900 md:text-2xl">{product.name}</h3>
        <p className="mt-2 text-2xl leading-none font-extrabold text-neutral-900 md:mt-4 md:text-4xl">{product.price}</p>
        <div className="mt-2 flex items-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="h-6 w-6 fill-current md:h-8 md:w-8" />
          ))}
        </div>
      </div>
    </button>
  )
}

export default function ShopSection({ searchQuery = '' }: { searchQuery?: string }) {
  const router = useRouter()

  const openDetails = (id: number) => {
    router.push(`/shop/product/${id}`)
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const visibleProducts = normalizedQuery
    ? products.filter((product) => {
        const searchableText = `${product.name} ${product.price}`.toLowerCase()
        return searchableText.includes(normalizedQuery)
      })
    : products

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 pb-6 xl:grid-cols-2">
        {visibleProducts.map((product) => (
          <ProductRow key={product.id} product={product} onOpenDetails={openDetails} />
        ))}
      </div>

      {visibleProducts.length === 0 ? (
        <div className="rounded-md border border-dashed border-neutral-300 bg-white/70 p-6 text-center text-lg text-neutral-600">
          No products found.
        </div>
      ) : null}
    </div>
  )
}
