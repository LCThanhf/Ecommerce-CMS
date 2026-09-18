'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, AlertTriangle, Truck, CheckCircle2, XCircle } from 'lucide-react'
import type { Order, OrderStatus } from '@/features/order/store/order.types'

interface CustomerOrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
}

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

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  Pending: {
    label: 'Chờ xác nhận',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  Processing: {
    label: 'Đang xử lý',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: AlertTriangle,
  },
  Shipping: {
    label: 'Đang giao hàng',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Truck,
  },
  Completed: {
    label: 'Hoàn thành',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  Cancelled: {
    label: 'Đã hủy',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
  },
}

export const CustomerOrderDetailModal: React.FC<CustomerOrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !order) return null

  const statusInfo = STATUS_CONFIG[order.status] || {
    label: order.status,
    bg: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    icon: Clock,
  }
  const StatusIcon = statusInfo.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg border border-neutral-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-neutral-900">
              Chi tiết đơn hàng: <span className="font-mono text-[#0F60FF]">#{order.orderCode}</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Đặt lúc: {formatDate(order.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition cursor-pointer"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Status badge */}
          <div className="flex items-center justify-between rounded-md bg-neutral-50 p-3.5 border border-neutral-200">
            <span className="text-sm font-medium text-neutral-700">Trạng thái đơn hàng:</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.bg}`}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {statusInfo.label}
            </span>
          </div>

          {/* Shipping info */}
          <div className="rounded-md border border-neutral-200 p-4 space-y-1.5 text-sm">
            <h4 className="font-semibold text-neutral-900 mb-2">Thông tin nhận hàng</h4>
            <p><span className="text-neutral-500">Người nhận: </span><span className="font-medium text-neutral-800">{order.recipientName}</span></p>
            <p><span className="text-neutral-500">Số điện thoại: </span><span className="font-medium text-neutral-800">{order.recipientPhone}</span></p>
            <p><span className="text-neutral-500">Địa chỉ giao: </span><span className="font-medium text-neutral-800">{order.shippingAddress}</span></p>
            <p><span className="text-neutral-500">Hình thức thanh toán: </span><span className="font-medium text-neutral-800">{order.paymentMethod || 'Thanh toán khi nhận hàng (COD)'}</span></p>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-2 text-sm">Danh sách sản phẩm</h4>
            <div className="border border-neutral-200 rounded-md divide-y divide-neutral-100 max-h-56 overflow-y-auto">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 text-sm gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-white">
                      {item.productImage ? (
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
                      <p className="font-medium text-neutral-900 truncate max-w-[260px]">{item.productName}</p>
                      <p className="text-xs text-neutral-500">{formatVND(item.unitPrice)} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-neutral-900 shrink-0">
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
              <span className="font-medium text-neutral-800">{formatVND(order.subTotal || 0)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Thuế (10%)</span>
              <span className="font-medium text-neutral-800">{formatVND(order.taxAmount || 0)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-neutral-900 border-t border-neutral-100 pt-2">
              <span>Tổng thanh toán</span>
              <span className="text-[#0F60FF]">{formatVND(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-neutral-200 px-6 py-3.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}
