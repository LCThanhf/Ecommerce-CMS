'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { orderApi } from '@/features/order/store/order.api'
import type { Order, OrderStatus } from '@/features/order/store/order.types'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import PaginationControls from '@/features/product/components/pagination-controls'
import { CustomerOrderDetailModal } from './customer-order-detail-modal'
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
} from 'lucide-react'

const ITEMS_PER_PAGE = 5

const formatVND = (value: number): string => {
  if (value === 0) return '0\u00a0VN\u0110'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0VN\u0110'
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  try {
    const normalizedStr =
      dateStr.endsWith('Z') || /[+-]\d{2}(:\d{2})?$/.test(dateStr)
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
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const data = await orderApi.getMyOrders()
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

  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE))
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return orders.slice(start, start + ITEMS_PER_PAGE)
  }, [orders, currentPage])

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
        <Button
          type="button"
          onClick={() => router.push('/shop?view=shop')}
          className="bg-[#0F60FF] hover:bg-[#0C53DF] text-white font-medium cursor-pointer shadow-sm gap-2"
        >
          <span>Khám phá sản phẩm</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col justify-between max-w-5xl mx-auto space-y-6 pb-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 pt-6">
          <div>
            <p className="text-base md:text-lg text-neutral-700">
              Tổng cộng {orders.length} đơn hàng đã đặt
            </p>
          </div>
        </div>

        {/* Order Cards List */}
        <div className="space-y-4">
          {paginatedOrders.map((order) => {
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
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4"
                    >
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
                    <span className="font-medium text-neutral-800">Giao đến:</span>{' '}
                    {order.recipientName} ({order.recipientPhone}) - {order.shippingAddress}
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-xs text-neutral-500 block">Tổng tiền</span>
                      <span className="text-base md:text-lg font-bold text-[#0F60FF]">
                        {formatVND(order.totalAmount)}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="cursor-pointer gap-1.5"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Chi tiết</span>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Reusable Customer Order Detail Modal */}
      <CustomerOrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  )
}

export default OrderHistorySection
