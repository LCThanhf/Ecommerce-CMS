'use client'

import dynamic from 'next/dynamic'
import { AdminDashboardLayout } from '@/features/admin/components/admin-dashboard-layout'

const ProductListPage = dynamic(
  () => import('@/features/admin/components/product/product-list-page').then((mod) => mod.ProductListPage),
  {
    ssr: false,
    loading: () => (
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 mb-6">
          <div className="h-8 w-72 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-8 w-24 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="bg-white rounded-xl shadow-2xs border border-slate-100 p-8 text-center text-slate-400">
          Đang tải danh sách sản phẩm...
        </div>
      </div>
    ),
  }
)

export default function AdminProductsPage() {
  return (
    <AdminDashboardLayout title="Danh sách sản phẩm">
      <ProductListPage />
    </AdminDashboardLayout>
  )
}

