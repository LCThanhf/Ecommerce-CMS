'use client'

import { AdminDashboardLayout } from '@/features/admin/components/admin-dashboard-layout'
import { ProductListPage } from '@/features/admin/components/product/product-list-page'

export default function AdminProductsPage() {
  return (
    <AdminDashboardLayout>
      <ProductListPage />
    </AdminDashboardLayout>
  )
}
