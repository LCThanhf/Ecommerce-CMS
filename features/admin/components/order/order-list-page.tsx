'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Eye,
  RotateCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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
import { AdminButton } from '../ui/admin-button'
import { AdminInput } from '../ui/admin-input'
import { AdminSelect } from '../ui/admin-select'
import { OrderDetailModal } from './order-detail-modal'
import { orderApi } from '@/features/order/store/order.api'
import type { Order, OrderStatus } from '@/features/order/store/order.types'

type OrderSortField = 'orderCode' | 'recipientName' | 'createdAt' | 'totalAmount' | null
type OrderSortOrder = 'asc' | 'desc' | null

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

export const OrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Column Header Sorting State
  const [sortField, setSortField] = useState<OrderSortField>(null)
  const [sortOrder, setSortOrder] = useState<OrderSortOrder>(null)

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const data = await orderApi.getAllOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err: any) {
      if (err !== 'Unauthorized' && err?.message !== 'Unauthorized') {
        console.warn('Failed to load admin orders:', err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsMounted(true)
    loadOrders()
  }, [])

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    setIsUpdatingStatus(true)
    try {
      await orderApi.updateOrderStatus(orderId, newStatus)
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    } catch (err: any) {
      if (err !== 'Unauthorized' && err?.message !== 'Unauthorized') {
        console.warn('Failed to update order status:', err)
      }
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleSort = (field: 'orderCode' | 'recipientName' | 'createdAt' | 'totalAmount') => {
    setCurrentPage(1)
    if (sortField !== field) {
      setSortField(field)
      setSortOrder('asc')
    } else if (sortOrder === 'asc') {
      setSortOrder('desc')
    } else {
      setSortField(null)
      setSortOrder(null)
    }
  }

  const renderSortIcon = (field: 'orderCode' | 'recipientName' | 'createdAt' | 'totalAmount') => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-500 transition" />
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-[#0F60FF] font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 text-[#0F60FF] font-bold" />
    )
  }

  // Filter orders by search query and status
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = searchQuery.toLowerCase()
      const matchSearch =
        !query ||
        (order.orderCode && order.orderCode.toLowerCase().includes(query)) ||
        (order.recipientName && order.recipientName.toLowerCase().includes(query)) ||
        (order.recipientPhone && order.recipientPhone.includes(query))

      const matchStatus = statusFilter === 'ALL' || order.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [orders, searchQuery, statusFilter])

  // Sort orders based on active header sort
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      if (!sortField || !sortOrder) return 0

      if (sortField === 'orderCode') {
        const cmp = (a.orderCode || '').localeCompare(b.orderCode || '')
        return sortOrder === 'asc' ? cmp : -cmp
      }

      if (sortField === 'recipientName') {
        const cmp = (a.recipientName || '').localeCompare(b.recipientName || '', 'vi', {
          sensitivity: 'base',
        })
        return sortOrder === 'asc' ? cmp : -cmp
      }

      if (sortField === 'createdAt') {
        const timeA = new Date(a.createdAt || 0).getTime()
        const timeB = new Date(b.createdAt || 0).getTime()
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA
      }

      if (sortField === 'totalAmount') {
        const valA = a.totalAmount || 0
        const valB = b.totalAmount || 0
        return sortOrder === 'asc' ? valA - valB : valB - valA
      }

      return 0
    })
  }, [filteredOrders, sortField, sortOrder])

  // Pagination logic
  const totalItems = sortedOrders.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedOrders.slice(start, start + pageSize)
  }, [sortedOrders, currentPage, pageSize])

  if (!isMounted) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 mb-6">
          <div className="h-8 w-72 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-8 w-24 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="bg-white rounded-xl shadow-2xs border border-slate-100 p-8 text-center text-slate-400">
          Đang tải danh sách đơn hàng...
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Control Bar: Search, Status Filter & Refresh */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 mb-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Input Box */}
          <div className="relative w-full sm:w-72">
            <AdminInput
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Tìm kiếm"
              className="h-8 pl-3.5 pr-9 bg-white shadow-2xs text-xs font-medium border-slate-200"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Filter Dropdown */}
          <div className="w-full sm:w-auto">
            <AdminSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              aria-label="Lọc theo trạng thái"
              className="min-w-[145px] shadow-2xs !text-xs font-medium"
            >
              <option value="ALL">Tất cả trạng thái</option>
              {ALL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </AdminSelect>
          </div>
        </div>

        {/* Refresh Action Button */}
        <AdminButton
          type="button"
          variant="outline"
          onClick={loadOrders}
          disabled={isLoading}
          className="h-8 w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 px-3.5 text-xs font-medium inline-flex items-center justify-center gap-1.5 shadow-2xs border-slate-200"
        >
          <RotateCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Làm mới</span>
        </AdminButton>
      </div>

      {/* Order Data Table Container */}
      <div className="bg-white rounded-xl shadow-2xs border border-slate-100 overflow-hidden overflow-x-auto">
        <AdminTable className="min-w-[1000px]">
          <AdminTableHeader>
            {/* Mã đơn hàng */}
            <AdminTableHead className="w-[13%]">
              <button
                type="button"
                onClick={() => handleSort('orderCode')}
                className={`group inline-flex items-center gap-1.5 hover:text-slate-800 transition cursor-pointer select-none ${
                  sortField === 'orderCode' ? 'text-[#0F60FF] font-bold' : ''
                }`}
              >
                <span>MÃ ĐƠN HÀNG</span>
                {renderSortIcon('orderCode')}
              </button>
            </AdminTableHead>

            {/* Khách hàng */}
            <AdminTableHead className="w-[17%]">
              <span>KHÁCH HÀNG</span>
            </AdminTableHead>

            {/* Địa chỉ giao hàng */}
            <AdminTableHead className="w-[20%]">
              <span>ĐỊA CHỈ GIAO HÀNG</span>
            </AdminTableHead>

            {/* Ngày đặt */}
            <AdminTableHead className="w-[13%]">
              <button
                type="button"
                onClick={() => handleSort('createdAt')}
                className={`group inline-flex items-center gap-1.5 hover:text-slate-800 transition cursor-pointer select-none ${
                  sortField === 'createdAt' ? 'text-[#0F60FF] font-bold' : ''
                }`}
              >
                <span>NGÀY ĐẶT</span>
                {renderSortIcon('createdAt')}
              </button>
            </AdminTableHead>

            {/* Tổng tiền */}
            <AdminTableHead className="w-[12%]">
              <button
                type="button"
                onClick={() => handleSort('totalAmount')}
                className={`group inline-flex items-center gap-1.5 hover:text-slate-800 transition cursor-pointer select-none ${
                  sortField === 'totalAmount' ? 'text-[#0F60FF] font-bold' : ''
                }`}
              >
                <span>TỔNG TIỀN</span>
                {renderSortIcon('totalAmount')}
              </button>
            </AdminTableHead>

            {/* Trạng thái */}
            <AdminTableHead className="w-[15%]">
              <span>TRẠNG THÁI</span>
            </AdminTableHead>

            {/* Thao tác */}
            <AdminTableHead className="w-[10%] whitespace-nowrap">
              <div className="flex justify-center w-full">
                <span>HÀNH ĐỘNG</span>
              </div>
            </AdminTableHead>
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
                <AdminTableCell colSpan={7} className="text-center py-8 text-slate-400">
                  Không tìm thấy đơn hàng nào phù hợp.
                </AdminTableCell>
              </AdminTableRow>
            ) : (
              paginatedOrders.map((order) => (
                <AdminTableRow key={order.id || order.orderCode}>
                  {/* Mã đơn */}
                  <AdminTableCell className="font-mono font-bold text-[#0F60FF] text-[13px]">
                    {order.orderCode}
                  </AdminTableCell>

                  {/* Khách hàng */}
                  <AdminTableCell>
                    <div className="font-bold text-[#1E293B] text-[13px]">
                      {order.recipientName || 'Chưa cập nhật'}
                    </div>
                    <div className="text-slate-600 font-normal text-xs mt-0.5">{order.recipientPhone}</div>
                  </AdminTableCell>

                  {/* Địa chỉ */}
                  <AdminTableCell className="text-slate-600 font-normal max-w-[220px]">
                    <div className="line-clamp-1" title={order.shippingAddress}>
                      {order.shippingAddress || 'N/A'}
                    </div>
                  </AdminTableCell>

                  {/* Ngày đặt */}
                  <AdminTableCell className="text-slate-600 font-normal whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </AdminTableCell>

                  {/* Tổng tiền */}
                  <AdminTableCell className="font-bold text-[#1E293B] text-[13px] whitespace-nowrap">
                    {formatVND(order.totalAmount)}
                  </AdminTableCell>

                  {/* Trạng thái Dropdown */}
                  <AdminTableCell>
                    <div className="w-max">
                      <AdminSelect
                        sizeVariant="sm"
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        disabled={isUpdatingStatus}
                        className="min-w-[150px] shadow-2xs text-[13px] whitespace-nowrap"
                      >
                        {ALL_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </AdminSelect>
                    </div>
                  </AdminTableCell>

                  {/* Thao tác (Xem chi tiết) */}
                  <AdminTableCell className="text-center">
                    <div className="flex items-center justify-center w-full">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="hover:opacity-75 transition p-1 cursor-pointer text-slate-400 hover:text-[#0F60FF] flex items-center justify-center"
                        title="Xem chi tiết đơn hàng"
                        aria-label="Xem chi tiết"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              ))
            )}
          </AdminTableBody>
        </AdminTable>

        {/* Table Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
        />
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        isUpdatingStatus={isUpdatingStatus}
      />
    </div>
  )
}
