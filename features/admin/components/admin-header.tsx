'use client'

import React from 'react'
import Image from 'next/image'
import { Bell } from 'lucide-react'
import avatarImg from '@/app/assets/avatar.png'

export const AdminHeader: React.FC = () => {
  return (
    <header className="h-16 flex items-center justify-end px-8 bg-transparent">
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button
          type="button"
          className="relative text-slate-500 hover:text-slate-700 transition p-1.5 rounded-full hover:bg-slate-100/60 cursor-pointer"
          aria-label="Thông báo"
        >
          <Bell className="h-5 w-5 stroke-[1.75]" />
          <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
            4
          </span>
        </button>

        {/* User Avatar */}
        <div className="relative cursor-pointer">
          <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 shadow-xs">
            <Image
              src={avatarImg}
              alt="Admin Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Online status indicator */}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
      </div>
    </header>
  )
}
