'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'

interface AdminDashboardLayoutProps {
  title?: React.ReactNode
  children: React.ReactNode
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  title,
  children,
}) => {
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const sessionStr = localStorage.getItem('admin_session')
    if (!sessionStr) {
      router.replace('/admin/login')
      return
    }

    try {
      const session = JSON.parse(sessionStr)
      if (session.role !== 'Admin') {
        router.replace('/admin/login')
      } else {
        setIsAuthorized(true)
      }
    } catch (e) {
      router.replace('/admin/login')
    }
  }, [router])

  if (!isAuthorized) {
    return null // or a loading spinner
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      {/* Collapsible Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title={title} />
        <main className="flex-1 px-8 pb-12">{children}</main>
      </div>
    </div>
  )
}
