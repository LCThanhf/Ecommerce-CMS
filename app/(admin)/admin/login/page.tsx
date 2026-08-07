'use client'

import { AdminAuthLayout } from '@/features/admin/components/admin-auth-layout'
import { AdminLoginForm } from '@/features/admin/components/admin-login-form'

export default function AdminLoginPage() {
  return (
    <AdminAuthLayout>
      <AdminLoginForm />
    </AdminAuthLayout>
  )
}
