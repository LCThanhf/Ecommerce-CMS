'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { removeItem as removeItemAction, updateQty as updateQtyAction, clearCart } from '@/features/cart/store/cart.slice'
import { showToast, hideToast } from '@/features/toast/store/toast.slice'
import type { RootState, AppDispatch } from '@/store/store'
import { useTranslation } from '@/hooks/use-translation'
import { api } from '@/services/api'
import { orderApi } from '@/features/order/store/order.api'
import { OrderConfirmModal } from './order-confirm-modal'
import { Loader2, AlertCircle } from 'lucide-react'

const formatVND = (value: number): string => {
  if (value === 0) return '0\u00a0VN\u0110'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0VN\u0110'
}

const CartSection = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { t } = useTranslation()
  const hasHydrated = useSelector((state: RootState) => state.cart.hasHydrated)
  const items = useSelector((state: RootState) => state.cart.items)
  const user = useSelector((state: RootState) => state.auth.user)

  const [confirmId, setConfirmId] = useState<number | null>(null)
  
  // Checkout states
  const [isCheckingProfile, setIsCheckingProfile] = useState(false)
  const [showMissingInfoModal, setShowMissingInfoModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

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

  // Profile validation & Checkout initiation
  const handleProceedToCheckout = async () => {
    if (!user?.id) {
      router.push('/login')
      return
    }

    setIsCheckingProfile(true)
    setOrderError(null)

    try {
      // Fetch full account info from backend to check phone & homeAddress
      const profileData = await api.get<any>(`/accounts/${user.id}`)
      setUserProfile(profileData)

      const hasPhone = Boolean(profileData.phone && String(profileData.phone).trim().length > 0)
      const hasAddress = Boolean(profileData.homeAddress && String(profileData.homeAddress).trim().length > 0)

      if (!hasPhone || !hasAddress) {
        setShowMissingInfoModal(true)
      } else {
        setShowConfirmModal(true)
      }
    } catch (err) {
      console.error('Failed to verify profile info', err)
      // Fallback: If fetch fails or incomplete, prompt user to visit profile
      setShowMissingInfoModal(true)
    } finally {
      setIsCheckingProfile(false)
    }
  }

  // Confirm and Place Order
  const handleConfirmOrder = async () => {
    if (!userProfile) return
    setIsSubmittingOrder(true)
    setOrderError(null)

    try {
      await orderApi.createOrder({
        recipientName: userProfile.username || user?.username || '',
        recipientPhone: userProfile.phone || '',
        shippingAddress: userProfile.homeAddress || '',
        paymentMethod: 'COD',
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.qty,
          unitPrice: i.priceValue,
        })),
      })

      // Clear cart from Redux and localStorage
      dispatch(clearCart())
      setShowConfirmModal(false)

      // Show toast and navigate to orders view
      dispatch(showToast(t('order-success')))
      setTimeout(() => {
        dispatch(hideToast())
      }, 3000)

      router.push('/shop?view=orders')
    } catch (err: any) {
      console.error('Order creation failed', err)
      setOrderError(t('order-failed'))
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  if (!hasHydrated) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xl text-neutral-500">Đang tải giỏ hàng...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xl text-neutral-500">{t('no-items')}</p>
      </div>
    )
  }

  return (
    <div className="pb-10">
      {/* Items count */}
      <div className="flex justify-end px-4 sm:px-6 py-3">
        <span className="text-lg text-neutral-700">{totalItems} {t('items-in-bag')}</span>
      </div>

      {/* Item list */}
      {items.map((item) => (
        <div key={item.id}>
          {/* Separator with X button centered on it */}
          <div className="relative border-t border-black">
            <button
              type="button"
              onClick={() => setConfirmId(item.id)}
              className="absolute right-0 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-300 text-lg font-bold leading-none text-neutral-700 hover:bg-neutral-400 cursor-pointer"
              aria-label="Remove item"
            >
              x
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-6 pr-4 sm:pr-14">
            {/* Product image */}
            <button
              type="button"
              onClick={() => router.push(`/shop/product/${item.id}`)}
              className="relative h-40 w-36 self-center sm:self-auto sm:h-64 sm:w-56 shrink-0 cursor-pointer"
            >
              {item.image && item.image.trim() !== '' ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-white border border-slate-100 rounded-sm">
                  <span className="text-slate-400 text-xs font-medium text-center">Chưa có ảnh</span>
                </div>
              )}
            </button>

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
                  className="flex h-7 w-7 items-center justify-center text-xl font-thin text-neutral-900 hover:text-neutral-600 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span className="w-6 text-center text-xl text-neutral-900">{item.qty}</span>
                <button
                  type="button"
                  onClick={() => item.qty === 1 ? setConfirmId(item.id) : updateQty(item.id, -1)}
                  className="flex h-7 w-7 items-center justify-center text-xl font-thin text-neutral-900 hover:text-neutral-600 cursor-pointer"
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

      {/* Delete Confirmation dialog */}
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
                className="flex-1 rounded-sm border border-neutral-400 py-2.5 text-base font-medium text-neutral-700 transition hover:bg-neutral-100 md:text-lg cursor-pointer"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={() => removeItem(confirmId)}
                className="flex-1 rounded-sm bg-neutral-800 py-2.5 text-base font-medium text-white transition hover:bg-neutral-700 md:text-lg cursor-pointer"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Missing Profile Information Alert Modal */}
      {showMissingInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <h3 className="text-lg font-bold text-neutral-900 md:text-xl">
                {t('missing-info-title')}
              </h3>
            </div>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-6">
              {t('missing-info-desc')}
            </p>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowMissingInfoModal(false)}
                className="rounded-md border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
              >
                {t('back')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMissingInfoModal(false)
                  router.push('/shop?view=profile')
                }}
                className="rounded-md bg-[#0F60FF] hover:bg-[#0C53DF] px-5 py-2 text-sm font-medium text-white shadow-sm transition cursor-pointer"
              >
                {t('go-to-profile')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {showConfirmModal && (
        <OrderConfirmModal
          isOpen={showConfirmModal}
          items={items}
          subTotal={subTotal}
          tax={tax}
          total={total}
          userProfile={userProfile || {}}
          isSubmitting={isSubmittingOrder}
          error={orderError}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmOrder}
        />
      )}

      {/* Summary & Checkout Action */}
      <div className="mt-8 flex flex-col items-end gap-4 px-3 sm:px-6 text-base sm:text-lg md:text-xl">
        <div className="flex items-baseline justify-end gap-1">
          <span className="w-28 text-right font-bold text-neutral-900">{t('subtotal')}</span>
          <span className="w-52 text-right text-neutral-900">{formatVND(subTotal)}</span>
        </div>
        <div className="flex items-baseline justify-end gap-1">
          <span className="w-28 text-right font-bold text-neutral-900">{t('tax')}</span>
          <span className="w-52 text-right text-neutral-900">{formatVND(tax)}</span>
        </div>
        <div className="flex items-baseline justify-end gap-1">
          <span className="w-28 text-right font-bold text-neutral-900">{t('total')}</span>
          <span className="w-52 text-right text-neutral-900">{formatVND(total)}</span>
        </div>

        {/* Proceed to Checkout Button */}
        <div className="mt-4 flex justify-end w-full sm:w-auto">
          <button
            type="button"
            onClick={handleProceedToCheckout}
            disabled={isCheckingProfile}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0F60FF] hover:bg-[#0C53DF] text-white font-semibold rounded-md shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-base md:text-lg"
          >
            {isCheckingProfile ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{t('loading')}</span>
              </>
            ) : (
              <span>{t('place-order')}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartSection
