import React from 'react'
import Image from 'next/image'

import type { Product } from '@/features/product/store/product.slice'
import RatingStar from './rating-star'



export const ProductRow = ({ product, onOpenDetails }: { product: Product; onOpenDetails: (id: number) => void }) => {
  return (
    <button
      type="button"
      onClick={() => onOpenDetails(product.id)}
      className="flex w-fit gap-3 rounded-md px-1 py-2 text-left transition hover:bg-white/40 md:gap-4"
    >
      <div className="relative h-36 w-28 md:h-44 md:w-32 bg-white rounded-md border border-slate-100 flex items-center justify-center p-2 shadow-2xs">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 112px, 128px"
            className="rounded-sm object-contain p-2"
          />
        ) : (
          <span className="text-slate-400 text-xs font-medium text-center">Chưa có ảnh</span>
        )}
      </div>

      <div className="flex flex-col justify-center">
        <h3 className="text-lg leading-none font-semibold text-neutral-900 md:text-2xl">{product.name}</h3>
        <p className="mt-2 text-2xl leading-none font-extrabold text-neutral-900 md:mt-4 md:text-4xl">{product.price}</p>
        <div className="mt-2 flex items-center gap-1 text-amber-400">
          {Array.from({ length: Math.floor(product.rating || 0) + ((product.rating || 0) % 1 > 0.5 ? 1 : 0) }).map((_, index) => (
            <RatingStar key={index} className="h-10 w-10 shrink-0 md:h-14 md:w-14" />
          ))}
        </div>
      </div>
    </button>
  )
}

export default ProductRow
