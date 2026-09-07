'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { orderApi } from '@/features/order/store/order.api'
import type { Order, OrderStatus } from '@/features/order/store/order.types'
import { useTranslation } from '@/hooks/use-translation'
import { Package, Clock, CheckCircle2, Truck, XCircle, AlertTriangle, ArrowRight, Eye } from 'lucide-react'

const formatVND = (value: number): string => {
  if (value === 0) return '0\u00a0VN\u0110'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0VN\u0110'
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  try {
    const normalizedStr = dateStr.endsWith('Z') || /[+-]\d{2}(:\d{2})?$/.test(dateStr)
      ? dateStr
      : `${dateStr}Z`
    const d = new Date(normalizedStr)
    return d.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'Pending':
      return {
        label: 'Chờ xác nhận',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: Clock,
      }
    case 'Processing':
      return {
        label: 'Đang xử lý',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: AlertTriangle,
      }
    case 'Shipping':
      return {
        label: 'Đang giao hàng',
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: Truck,
      }
    case 'Completed':
      return {
        label: 'Hoàn thành',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle2,
      }
    case 'Cancelled':
      return {
        label: 'Đã hủy',
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: XCircle,
      }
    default:
      return {
        label: status,
        bg: 'bg-neutral-100 text-neutral-700 border-neutral-200',
        icon: Clock,
      }
  }
}

const OrderHistorySection: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const data = await orderApi.getMyOrders()
        // Sort newest first
        const sorted = (Array.isArray(data) ? data : []).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setOrders(sorted)
      } catch (err) {
        console.error('Failed to fetch order history', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0F60FF] border-t-transparent" />
        <p className="text-neutral-500 text-base">{t('loading')}</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-[#0F60FF] mb-5">
          <Package className="h-10 w-10" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">
          {t('no-orders')}
        </h3>
        <p className="text-neutral-500 max-w-md text-base mb-6">
          Bạn chưa thực hiện đơn đặt hàng nào. Hãy khám phá ngay các sản phẩm hấp dẫn của chúng tôi!
        </p>
        <button
          type="button"
          onClick={() => router.push('/shop?view=shop')}
          className="inline-flex items-center gap-2 rounded-md bg-[#0F60FF] hover:bg-[#0C53DF] px-6 py-3 text-white font-medium transition cursor-pointer shadow-sm"
        >
          <span>Khám phá sản phẩm</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="pb-16 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
            {t('order-history')}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Tổng cộng {orders.length} đơn hàng đã đặt
          </p>
        </div>
      </div>

      {/* Order Cards List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const statusBadge = getStatusBadge(order.status)
          const StatusIcon = statusBadge.icon

          return (
            <div
              key={order.id || order.orderCode}
              className="rounded-lg border border-neutral-200 bg-white shadow-xs overflow-hidden transition hover:border-neutral-300"
            >
              {/* Order Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/70 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-neutral-900 text-sm md:text-base">
                    {t('order-code')}:{' '}
                    <span className="font-mono text-[#0F60FF] tracking-wider font-bold">
                      {order.orderCode}
                    </span>
                  </span>
                  <span className="text-xs text-neutral-400">|</span>
                  <span className="text-xs md:text-sm text-neutral-500">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge.bg}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {statusBadge.label}
                  </span>
                </div>
              </div>

              {/* Order Card Items Preview */}
              <div className="px-5 py-4 divide-y divide-neutral-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-white">
                        {item.productImage && item.productImage.trim() !== '' ? (
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-neutral-400">
                            Ảnh
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-medium text-neutral-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs md:text-sm text-neutral-500">
                          {formatVND(item.unitPrice)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium text-sm md:text-base text-neutral-900 shrink-0">
                      {formatVND(item.subtotal || item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Card Footer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-neutral-100 bg-neutral-50/40 px-5 py-3">
                <div className="text-xs md:text-sm text-neutral-600">
                  <span className="font-medium text-neutral-800">Giao đến:</span> {order.recipientName} ({order.recipientPhone}) - {order.shippingAddress}
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-xs text-neutral-500 block">Tổng tiền</span>
                    <span className="text-base md:text-lg font-bold text-[#0F60FF]">
                      {formatVND(order.totalAmount)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3.5 py-1.5 text-xs md:text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Chi tiết</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg border border-neutral-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-neutral-900">
                  Chi tiết đơn hàng: <span className="font-mono text-[#0F60FF]">{selectedOrder.orderCode}</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Đặt lúc: {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between rounded-md bg-neutral-50 p-3.5 border border-neutral-200">
                <span className="text-sm font-medium text-neutral-700">Trạng thái đơn hàng:</span>
                {(() => {
                  const badge = getStatusBadge(selectedOrder.status)
                  const Icon = badge.icon
                  return (
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${badge.bg}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {badge.label}
                    </span>
                  )
                })()}
              </div>

              {/* Shipping info */}
              <div className="rounded-md border border-neutral-200 p-4 space-y-1.5 text-sm">
                <h4 className="font-semibold text-neutral-900 mb-2">Thông tin nhận hàng</h4>
                <p><span className="text-neutral-500">Người nhận:</span> {selectedOrder.recipientName}</p>
                <p><span className="text-neutral-500">Số điện thoại:</span> {selectedOrder.recipientPhone}</p>
                <p><span className="text-neutral-500">Địa chỉ giao:</span> {selectedOrder.shippingAddress}</p>
                <p><span className="text-neutral-500">Hình thức thanh toán:</span> {selectedOrder.paymentMethod || 'Thanh toán khi nhận hàng (COD)'}</p>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-neutral-900 mb-2 text-sm">Danh sách sản phẩm</h4>
                <div className="border border-neutral-200 rounded-md divide-y divide-neutral-100">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 text-sm">
                      <div>
                        <p className="font-medium text-neutral-900">{item.productName}</p>
                        <p className="text-xs text-neutral-500">{formatVND(item.unitPrice)} × {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-neutral-900">
                        {formatVND(item.subtotal || item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost calculation */}
              <div className="space-y-1.5 text-sm border-t border-neutral-200 pt-3">
                <div className="flex justify-between text-neutral-600">
                  <span>Tạm tính</span>
                  <span>{formatVND(selectedOrder.subTotal || 0)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Thuế (10%)</span>
                  <span>{formatVND(selectedOrder.taxAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-900 border-t border-neutral-100 pt-2">
                  <span>Tổng thanh toán</span>
                  <span className="text-[#0F60FF]">{formatVND(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-neutral-200 px-6 py-3.5">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-md bg-neutral-800 hover:bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderHistorySection
