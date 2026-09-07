'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import {
  Search,
  Eye,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertTriangle,
  RotateCw,
  Filter,
} from 'lucide-react'
import {
  AdminTable,
  AdminTableHeader,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
} from '../ui/admin-table'
import { AdminPagination } from '../ui/admin-pagination'
import { AdminInput } from '../ui/admin-input'
import { orderApi } from '@/features/order/store/order.api'
import type { Order, OrderStatus } from '@/features/order/store/order.types'

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

const ALL_STATUSES: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipping',
  'Completed',
  'Cancelled',
]

export const OrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const data = await orderApi.getAllOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load admin orders', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    setIsUpdatingStatus(true)
    try {
      const updated = await orderApi.updateOrderStatus(orderId, newStatus)
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    } catch (err) {
      console.error('Failed to update order status', err)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Filter & Search
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        (order.orderCode && order.orderCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.recipientName && order.recipientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.recipientPhone && order.recipientPhone.includes(searchQuery))

      const matchStatus = statusFilter === 'ALL' || order.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [orders, searchQuery, statusFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize))
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredOrders.slice(start, start + pageSize)
  }, [filteredOrders, currentPage, pageSize])

  return (
    <div className="w-full space-y-6">
      {/* Top Controls: Search, Filter, Refresh */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-2">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <AdminInput
              placeholder="Tìm theo mã đơn, khách hàng, SĐT..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 pr-4 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              aria-label="Lọc theo trạng thái"
              className="h-9.5 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-[#0F60FF] focus:outline-hidden"
            >
              <option value="ALL">Tất cả trạng thái</option>
              {ALL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_CONFIG[status].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-xl shadow-2xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <AdminTable>
            <AdminTableHeader>
              <AdminTableHead className="w-36 font-semibold text-slate-700 py-3.5 pl-6">Mã đơn hàng</AdminTableHead>
              <AdminTableHead className="font-semibold text-slate-700 py-3.5">Khách hàng</AdminTableHead>
              <AdminTableHead className="font-semibold text-slate-700 py-3.5">Địa chỉ giao hàng</AdminTableHead>
              <AdminTableHead className="font-semibold text-slate-700 py-3.5">Ngày đặt</AdminTableHead>
              <AdminTableHead className="font-semibold text-slate-700 py-3.5 text-right">Tổng tiền</AdminTableHead>
              <AdminTableHead className="font-semibold text-slate-700 py-3.5 text-center">Trạng thái</AdminTableHead>
              <AdminTableHead className="w-24 font-semibold text-slate-700 py-3.5 pr-6 text-center">Thao tác</AdminTableHead>
            </AdminTableHeader>
            <AdminTableBody>
              {isLoading ? (
                <AdminTableRow>
                  <AdminTableCell colSpan={7} className="h-48 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0F60FF] border-t-transparent" />
                      <span>Đang tải danh sách đơn hàng...</span>
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              ) : paginatedOrders.length === 0 ? (
                <AdminTableRow>
                  <AdminTableCell colSpan={7} className="h-40 text-center text-slate-400">
                    Không tìm thấy đơn hàng nào phù hợp.
                  </AdminTableCell>
                </AdminTableRow>
              ) : (
                paginatedOrders.map((order) => {
                  const statusInfo = STATUS_CONFIG[order.status] || {
                    label: order.status,
                    bg: 'bg-slate-100 text-slate-700 border-slate-200',
                    icon: Clock,
                  }
                  const StatusIcon = statusInfo.icon

                  return (
                    <AdminTableRow
                      key={order.id || order.orderCode}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition"
                    >
                      {/* Mã đơn */}
                      <AdminTableCell className="pl-6 font-mono font-bold text-[#0F60FF] text-sm">
                        {order.orderCode}
                      </AdminTableCell>

                      {/* Khách hàng */}
                      <AdminTableCell className="text-slate-800 text-sm">
                        <div className="font-medium">{order.recipientName || 'Chưa cập nhật'}</div>
                        <div className="text-xs text-slate-400">{order.recipientPhone}</div>
                      </AdminTableCell>

                      {/* Địa chỉ */}
                      <AdminTableCell className="text-slate-600 text-sm max-w-xs truncate" title={order.shippingAddress}>
                        {order.shippingAddress || 'N/A'}
                      </AdminTableCell>

                      {/* Ngày đặt */}
                      <AdminTableCell className="text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </AdminTableCell>

                      {/* Tổng tiền */}
                      <AdminTableCell className="text-right font-semibold text-slate-900 text-sm">
                        {formatVND(order.totalAmount)}
                      </AdminTableCell>

                      {/* Trạng thái Dropdown */}
                      <AdminTableCell className="text-center">
                        <select
                          value={order.status}
                          aria-label={`Thay đổi trạng thái đơn hàng ${order.orderCode}`}
                          disabled={isUpdatingStatus}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-xs font-semibold rounded-full border px-2.5 py-1 outline-hidden cursor-pointer ${statusInfo.bg}`}
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {STATUS_CONFIG[st].label}
                            </option>
                          ))}
                        </select>
                      </AdminTableCell>

                      {/* Thao tác */}
                      <AdminTableCell className="pr-6 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                          title="Xem chi tiết đơn hàng"
                          aria-label="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </AdminTableCell>
                    </AdminTableRow>
                  )
                })
              )}
            </AdminTableBody>
          </AdminTable>
        </div>

        {/* Pagination */}
        <div className="border-t border-slate-100 px-6 py-4">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredOrders.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Đơn hàng: <span className="font-mono text-[#0F60FF]">{selectedOrder.orderCode}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ngày đặt: {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Order Status Controller */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-4 border border-slate-100">
                <span className="text-sm font-medium text-slate-700">Cập nhật trạng thái:</span>
                <select
                  value={selectedOrder.status}
                  aria-label="Cập nhật trạng thái đơn"
                  disabled={isUpdatingStatus}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-xs focus:border-[#0F60FF] focus:outline-hidden cursor-pointer"
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {STATUS_CONFIG[st].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient details */}
              <div className="rounded-lg border border-slate-100 p-4 space-y-2 text-sm bg-slate-50/50">
                <h4 className="font-semibold text-slate-900">Thông tin giao hàng</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <p><span className="text-slate-400">Người nhận:</span> {selectedOrder.recipientName}</p>
                  <p><span className="text-slate-400">Số điện thoại:</span> {selectedOrder.recipientPhone}</p>
                  <p className="sm:col-span-2"><span className="text-slate-400">Địa chỉ:</span> {selectedOrder.shippingAddress}</p>
                  <p className="sm:col-span-2"><span className="text-slate-400">Phương thức:</span> {selectedOrder.paymentMethod || 'COD'}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-2 text-sm">Sản phẩm trong đơn</h4>
                <div className="border border-slate-100 rounded-lg divide-y divide-slate-100">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-800">{item.productName}</p>
                        <p className="text-xs text-slate-400">{formatVND(item.unitPrice)} × {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {formatVND(item.subtotal || item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial summary */}
              <div className="space-y-1.5 text-sm border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-500">
                  <span>Tạm tính</span>
                  <span>{formatVND(selectedOrder.subTotal || 0)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Thuế VAT (10%)</span>
                  <span>{formatVND(selectedOrder.taxAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-100 pt-2">
                  <span>Tổng tiền</span>
                  <span className="text-[#0F60FF]">{formatVND(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 px-6 py-3.5">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg bg-slate-800 hover:bg-slate-900 px-5 py-2 text-sm font-medium text-white transition cursor-pointer"
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
