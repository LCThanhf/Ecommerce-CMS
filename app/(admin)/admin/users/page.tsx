'use client'

import { AdminDashboardLayout } from '@/features/admin/components/admin-dashboard-layout'
import { UserListPage } from '@/features/user/components/user-list-page'

export default function AdminUsersPage() {
  return (
    <AdminDashboardLayout title="Danh sách người dùng">
      <UserListPage />
    </AdminDashboardLayout>
  )
}
