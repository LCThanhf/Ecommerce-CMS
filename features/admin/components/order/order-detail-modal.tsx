'use client'

import React from 'react'
import Image from 'next/image'
import { AdminModal } from '../ui/admin-modal'
import { AdminButton } from '../ui/admin-button'
import { AdminSelect } from '../ui/admin-select'
import { AdminBadge, AdminBadgeVariant } from '../ui/admin-badge'
import type { Order, OrderStatus } from '@/features/order/store/order.types'

interface OrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  onUpdateStatus: (orderId: number, status: OrderStatus) => Promise<void>
  isUpdatingStatus: boolean
}

const ALL_STATUSES: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipping',
  'Completed',
  'Cancelled',
]

const STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: 'Chờ xác nhận',
  Processing: 'Đang xử lý',
  Shipping: 'Đang giao hàng',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã hủy',
}

const STATUS_BADGE_VARIANTS: Record<OrderStatus, AdminBadgeVariant> = {
  Pending: 'pending',
  Processing: 'processing',
  Shipping: 'shipping',
  Completed: 'completed',
  Cancelled: 'cancelled',
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

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  isUpdatingStatus,
}) => {
  if (!order) return null

  const modalFooter = (
    <AdminButton
      type="button"
      variant="outline"
      onClick={onClose}
      className="h-8 px-5 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-medium"
    >
      Đóng
    </AdminButton>
  )

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Đơn hàng: #${order.orderCode}`}
      footer={modalFooter}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Status management block */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-3.5 border border-slate-100 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Trạng thái hiện tại:</span>
            <AdminBadge variant={STATUS_BADGE_VARIANTS[order.status] || 'neutral'}>
              {STATUS_LABELS[order.status] || order.status}
            </AdminBadge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Thay đổi:</span>
            <div className="w-40">
              <AdminSelect
                sizeVariant="sm"
                value={order.status}
                disabled={isUpdatingStatus}
                onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                aria-label="Cập nhật trạng thái đơn"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {STATUS_LABELS[st]}
                  </option>
                ))}
              </AdminSelect>
            </div>
          </div>
        </div>

        {/* Recipient details card */}
        <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-2xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Thông tin nhận hàng
            </h4>
            <span className="text-slate-400 text-[11px]">
              Ngày đặt: {formatDate(order.createdAt)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1">
            <p>
              <span className="text-slate-400">Người nhận: </span>
              <span className="font-medium text-slate-900">{order.recipientName || 'Chưa cập nhật'}</span>
            </p>
            <p>
              <span className="text-slate-400">Số điện thoại: </span>
              <span className="font-medium text-slate-900">{order.recipientPhone || 'N/A'}</span>
            </p>
            <p className="sm:col-span-2">
              <span className="text-slate-400">Địa chỉ: </span>
              <span className="font-medium text-slate-900">{order.shippingAddress || 'N/A'}</span>
            </p>
            <p className="sm:col-span-2">
              <span className="text-slate-400">Phương thức thanh toán: </span>
              <span className="font-medium text-slate-900">{order.paymentMethod || 'Thanh toán khi nhận hàng (COD)'}</span>
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-2xs">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5 pb-2 border-b border-slate-100">
            Sản phẩm trong đơn ({order.items?.length || 0})
          </h4>
          <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto pr-1">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-9 w-9 shrink-0 rounded-[4px] bg-slate-100 overflow-hidden border border-slate-100 flex items-center justify-center text-slate-400 text-[10px]">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>IMG</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate max-w-[280px]">
                      {item.productName}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {formatVND(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-slate-900 shrink-0">
                  {formatVND(item.subtotal || item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-2xs space-y-1.5">
          <div className="flex justify-between text-slate-500 text-xs">
            <span>Tạm tính</span>
            <span className="font-medium text-slate-700">{formatVND(order.subTotal || 0)}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-xs">
            <span>Thuế VAT (10%)</span>
            <span className="font-medium text-slate-700">{formatVND(order.taxAmount || 0)}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-900 text-sm border-t border-slate-100 pt-2 mt-1">
            <span>Tổng tiền</span>
            <span className="text-[#0F60FF]">{formatVND(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </AdminModal>
  )
}
