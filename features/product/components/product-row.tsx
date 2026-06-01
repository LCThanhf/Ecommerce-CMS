import React from 'react'
import Image from 'next/image'
import galaxyA31 from '@/app/assets/samsung-galaxy-a31.png'
import type { Product } from '@/features/product/store/product.slice'
import RatingStar from './rating-star'

const PhoneThumbnail = () => {
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

export const ProductRow = ({ product, onOpenDetails }: { product: Product; onOpenDetails: (id: number) => void }) => {
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

export default ProductRow
