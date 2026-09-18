'use client'

import dynamic from 'next/dynamic'
import { AdminDashboardLayout } from '@/features/admin/components/admin-dashboard-layout'

const OrderListPage = dynamic(
  () => import('@/features/admin/components/order/order-list-page').then((mod) => mod.OrderListPage),
  {
    ssr: false,
    loading: () => (
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 mb-6">
          <div className="h-8 w-72 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-8 w-24 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="bg-white rounded-xl shadow-2xs border border-slate-100 p-8 text-center text-slate-400">
          Đang tải danh sách đơn hàng...
        </div>
      </div>
    ),
  }
)

export default function AdminOrdersPage() {
  return (
    <AdminDashboardLayout title="Quản lý đơn hàng">
      <OrderListPage />
    </AdminDashboardLayout>
  )
}
