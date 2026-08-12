'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Box, Users } from 'lucide-react'
import { HicasLogo } from './hicas-logo'
import indentIcon from '@/app/assets/indent-decrease.svg'

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  const pathname = usePathname()

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

  return (
    <aside
      className={`relative z-20 flex flex-col bg-white border-r border-slate-100 min-h-screen transition-all duration-300 ${
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
    </aside>
  )
}
