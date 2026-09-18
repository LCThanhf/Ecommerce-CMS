'use client'

import React from 'react'
import Image from 'next/image'
import type { CartItem } from '@/features/cart/store/cart.slice'
import { useTranslation } from '@/hooks/use-translation'
import { Loader2 } from 'lucide-react'

interface UserProfileData {
  username?: string
  phone?: string
  homeAddress?: string
  email?: string
}

interface OrderConfirmModalProps {
  isOpen: boolean
  items: CartItem[]
  subTotal: number
  tax: number
  total: number
  userProfile: UserProfileData
  isSubmitting: boolean
  error?: string | null
  onClose: () => void
  onConfirm: () => void
}

const formatVND = (value: number): string => {
  if (value === 0) return '0\u00a0VN\u0110'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0VN\u0110'
}

export const OrderConfirmModal: React.FC<OrderConfirmModalProps> = ({
  isOpen,
  items,
  subTotal,
  tax,
  total,
  userProfile,
  isSubmitting,
  error,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg border border-neutral-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h3 className="text-xl font-bold text-neutral-900 md:text-2xl">
            {t('confirm-order')}
          </h3>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          {/* Section 1: Customer / Recipient Info */}
          <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4 space-y-2.5">
            <h4 className="font-semibold text-neutral-900 text-base md:text-lg flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#0F60FF]" />
              {t('recipient-info')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm md:text-base text-neutral-700 pt-1">
              <div>
                <span className="font-medium text-neutral-900">{t('customer-name')} </span>
                <span>{userProfile.username || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-neutral-900">{t('phone')} </span>
                <span>{userProfile.phone || 'N/A'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-medium text-neutral-900">{t('shipping-address')} </span>
                <span>{userProfile.homeAddress || 'N/A'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-medium text-neutral-900">{t('payment-method')} </span>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                  {t('payment-cod')}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Items List */}
          <div>
            <h4 className="font-semibold text-neutral-900 text-base md:text-lg mb-3">
              {t('order-summary')} ({items.reduce((sum, i) => sum + i.qty, 0)} {t('items-in-bag')})
            </h4>
            <div className="divide-y divide-neutral-100 max-h-56 overflow-y-auto border border-neutral-200 rounded-md">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-neutral-100 bg-neutral-50">
                      {item.image && item.image.trim() !== '' ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-neutral-400">
                          Ảnh
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900">{item.name}</p>
                      <p className="text-xs text-neutral-500">
                        {item.priceFormatted} × {item.qty}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-neutral-900">
                    {formatVND(item.priceValue * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Cost Totals */}
          <div className="border-t border-neutral-200 pt-4 space-y-1.5 text-sm md:text-base">
            <div className="flex justify-between text-neutral-600">
              <span>{t('subtotal')}</span>
              <span>{formatVND(subTotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>{t('tax')} (10%)</span>
              <span>{formatVND(tax)}</span>
            </div>
            <div className="flex justify-between text-base md:text-lg font-bold text-neutral-900 pt-2 border-t border-neutral-100">
              <span>{t('total')}</span>
              <span className="text-[#0F60FF]">{formatVND(total)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm md:text-base font-medium text-neutral-700 hover:bg-neutral-100 transition disabled:opacity-50"
          >
            {t('back')}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-md bg-[#0F60FF] hover:bg-[#0C53DF] px-6 py-2.5 text-sm md:text-base font-medium text-white shadow-sm transition disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('order-submitting')}
              </>
            ) : (
              t('confirm-order')
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
