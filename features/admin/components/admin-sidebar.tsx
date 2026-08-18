'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { Box, Users, LogOut } from 'lucide-react'
import { HicasLogo } from './hicas-logo'
import indentIcon from '@/app/assets/indent-decrease.svg'
import { logoutUser } from '@/features/auth/store/auth.slice'
import { resetProducts } from '@/features/product/store/product.slice'
import { clearSession } from '@/features/auth/store/auth.storage'
import { AdminConfirmModal } from './ui/admin-confirm-modal'

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)

  const navItems = [
    {
      label: 'Sản phẩm',
      href: '/admin/products',
      icon: Box,
    },
    {
      label: 'Người dùng',
      href: '/admin/users',
      icon: Users,
    },
  ]

  const handleLogoutConfirm = () => {
    dispatch(resetProducts())
    dispatch(logoutUser())
    clearSession()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_session')
    }
    router.push('/admin/login')
  }

  return (
    <aside
      className={`relative z-20 flex flex-col bg-white border-r border-slate-100 h-screen sticky top-0 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Top: Logo & Collapse Button */}
      <div
        className={`h-16 flex items-center px-4.5 border-b border-slate-50 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!isCollapsed && <HicasLogo imageClassName="h-7 w-auto animate-in fade-in duration-200" />}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-slate-600 transition p-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
          aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          <Image
            src={indentIcon}
            alt="Toggle Sidebar"
            className={`h-5 w-5 object-contain transition-transform duration-200 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 py-6 px-3 space-y-6">
        {/* Section Heading */}
        <div>
          <h2 className={`text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 select-none transition-all duration-300 whitespace-nowrap overflow-hidden ${
            isCollapsed ? 'h-0 opacity-0 mb-0' : 'h-4 opacity-100 mb-2.5'
          }`}>
            {pathname?.startsWith('/admin/users') ? 'Quản lý người dùng' : 'Quản lý sản phẩm'}
          </h2>

          {/* Menu Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname?.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-lg text-sm font-medium transition-all duration-300 select-none ${
                    isActive
                      ? 'bg-[#F3F4F8] text-slate-900 font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  } ${isCollapsed ? 'justify-center px-2 py-2.5 gap-0' : 'px-3.5 py-2.5 gap-3'}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer: Logout Button */}
      <div className="p-3 border-t border-slate-50">
        <button
          type="button"
          onClick={() => setIsLogoutConfirmOpen(true)}
          className={`flex items-center rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-300 select-none w-full cursor-pointer ${
            isCollapsed ? 'justify-center px-2 py-2.5 gap-0' : 'px-3.5 py-2.5 gap-3'
          }`}
          title={isCollapsed ? 'Đăng xuất' : undefined}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0 text-red-500" />
          <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
            isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}>
            Đăng xuất
          </span>
        </button>
      </div>

      {/* Custom Logout Confirmation Modal */}
      <AdminConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản lý?"
        confirmText="Đăng xuất"
        isDestructive={false}
      />
    </aside>
  )
}
