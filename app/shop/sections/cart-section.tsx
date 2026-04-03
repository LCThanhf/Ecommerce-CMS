'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { removeItem as removeItemAction, updateQty as updateQtyAction } from '@/store/cartSlice'
import type { RootState, AppDispatch } from '@/store/store'
import galaxyA31 from '../../assets/samsung-galaxy-a31.png'

const formatVND = (value: number): string => {
  if (value === 0) return '0\u00a0VN\u0110'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0VN\u0110'
}

const CartSection = () => {
  const dispatch = useDispatch<AppDispatch>()
  const items = useSelector((state: RootState) => state.cart.items)
  const [confirmId, setConfirmId] = useState<number | null>(null)

  const updateQty = (id: number, delta: number) => {
    dispatch(updateQtyAction({ id, delta }))
  }

  const removeItem = (id: number) => {
    dispatch(removeItemAction(id))
    setConfirmId(null)
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const subTotal = items.reduce((sum, i) => sum + i.priceValue * i.qty, 0)
  const tax = Math.round(subTotal * 0.1)
  const total = subTotal + tax

  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xl text-neutral-500">No items in cart yet.</p>
      </div>
    )
  }

  return (
    <div className="pb-10">
      {/* Items count */}
      <div className="flex justify-end px-4 sm:px-6 py-3">
        <span className="text-lg text-neutral-700">{totalItems} Items in bag</span>
      </div>

      {/* Item list */}
      {items.map((item) => (
        <div key={item.id}>
          {/* Separator with X button centered on it */}
          <div className="relative border-t border-black">
            <button
              type="button"
              onClick={() => setConfirmId(item.id)}
              className="absolute right-0 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-300 text-lg font-bold leading-none text-neutral-700 hover:bg-neutral-400"
              aria-label="Remove item"
            >
              x
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-6 pr-4 sm:pr-14">
            {/* Product image */}
            <div className="h-40 w-36 self-center sm:self-auto sm:h-64 sm:w-56 shrink-0">
              <Image
                src={galaxyA31}
                alt={item.name}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
              <div className="flex-1">
                <p className="relative -top-2 text-lg font-bold text-neutral-900 md:text-xl">{item.name}</p>
                <p className="mt-5 max-w-lg text-pretty text-lg leading-7 text-neutral-600 md:text-xl">
                  {item.description}
                </p>
                <p className="mt-6 text-2xl font-bold text-neutral-900 md:text-3xl">
                  {item.priceFormatted}
                </p>
              </div>

              {/* Qty control */}
              <div className="flex shrink-0 items-center gap-6">
                <button
                  type="button"
                  onClick={() => updateQty(item.id, 1)}
                  className="flex h-7 w-7 items-center justify-center text-xl font-thin text-neutral-900 hover:text-neutral-600"
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span className="w-6 text-center text-xl text-neutral-900">{item.qty}</span>
                <button
                  type="button"
                  onClick={() => updateQty(item.id, -1)}
                  className="flex h-7 w-7 items-center justify-center text-xl font-thin text-neutral-900 hover:text-neutral-600"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="border-t border-black" />

      {/* Confirmation dialog */}
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-sm border border-neutral-300 bg-white px-8 py-7 shadow-xl">
            <p className="text-center text-lg font-bold text-neutral-900 md:text-xl">
              Xoá sản phẩm
            </p>
            <p className="mt-3 text-center text-base text-neutral-600 md:text-lg">
              Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng?
            </p>
            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-sm border border-neutral-400 py-2.5 text-base font-medium text-neutral-700 transition hover:bg-neutral-100 md:text-lg"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={() => removeItem(confirmId)}
                className="flex-1 rounded-sm bg-neutral-800 py-2.5 text-base font-medium text-white transition hover:bg-neutral-700 md:text-lg"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 flex flex-col items-end gap-4 px-3 sm:px-6 text-base sm:text-lg md:text-xl">
        <div className="flex items-baseline justify-end gap-1">
          <span className="w-28 text-right font-bold text-neutral-900">SubTotal</span>
          <span className="w-52 text-right text-neutral-900">{formatVND(subTotal)}</span>
        </div>
        <div className="flex items-baseline justify-end gap-1">
          <span className="w-28 text-right font-bold text-neutral-900">Tax</span>
          <span className="w-52 text-right text-neutral-900">{formatVND(tax)}</span>
        </div>
        <div className="flex items-baseline justify-end gap-1">
          <span className="w-28 text-right font-bold text-neutral-900">Total</span>
          <span className="w-52 text-right text-neutral-900">{formatVND(total)}</span>
        </div>
      </div>
    </div>
  )
}

export default CartSection
