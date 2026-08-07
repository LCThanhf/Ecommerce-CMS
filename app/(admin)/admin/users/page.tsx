'use client'

import { AdminDashboardLayout } from '@/features/admin/components/admin-dashboard-layout'

export default function AdminUsersPage() {
  return (
    <AdminDashboardLayout>
      <div className="w-full space-y-6">
        <h1 className="text-xl font-bold text-[#1E293B] tracking-tight">
          Quản lý người dùng (Users)
        </h1>
        <div className="bg-white rounded-xl shadow-2xs border border-slate-100 p-8 text-center text-slate-500 font-medium">
          Trang quản lý người dùng đang được phát triển.
        </div>
      </div>
    </AdminDashboardLayout>
  )
}
