'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { AdminConfirmModal } from './ui/admin-confirm-modal'

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
  const [sessionExpired, setSessionExpired] = useState(false)

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

    const handleSessionExpired = (e: any) => {
      if (e.detail?.isAdmin) {
        setSessionExpired(true)
      }
    }
    window.addEventListener('session-expired', handleSessionExpired)
    return () => window.removeEventListener('session-expired', handleSessionExpired)
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

      <AdminConfirmModal
        isOpen={sessionExpired}
        onClose={() => {}} // Force confirm
        onConfirm={() => {
          setSessionExpired(false)
          localStorage.removeItem('admin_session')
          localStorage.removeItem('admin_token')
          window.location.href = '/admin/login'
        }}
        title="Phiên đăng nhập đã hết hạn"
        message="Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục thao tác."
        confirmText="Đăng nhập lại"
        hideCancel={true}
        isDestructive={false}
      />
    </div>
  )
}
