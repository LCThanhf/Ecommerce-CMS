'use client'

import { AdminAuthLayout } from '@/features/admin/components/admin-auth-layout'
import { AdminSignupForm } from '@/features/admin/components/admin-signup-form'

export default function AdminSignupPage() {
  return (
    <AdminAuthLayout>
      <AdminSignupForm />
    </AdminAuthLayout>
  )
}
