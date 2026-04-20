'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { LogOut, User } from 'lucide-react'
import avatarIcon from '@/app/assets/avatar.png'
import { logoutUser } from '@/features/auth/auth.slice'
import { resetProducts } from '@/features/product/product.slice'
import { clearSession } from '@/features/auth/auth.storage'
import type { AppDispatch } from '@/store/store'

type AvatarDropdownProps = {
  onProfileClick?: () => void
}

const AvatarDropdown = ({ onProfileClick }: AvatarDropdownProps) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleProfile = () => {
    setOpen(false)
    if (onProfileClick) {
      onProfileClick()
    } else {
      router.push('/shop?view=profile')
    }
  }

  const handleLogout = () => {
    setOpen(false)
    dispatch(resetProducts())
    dispatch(logoutUser())
    clearSession()
    router.push('/login')
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-13 w-13 items-center justify-center overflow-hidden rounded-full border border-sky-200 bg-white text-slate-600 md:h-15 md:w-15"
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Image src={avatarIcon} alt="Profile" className="h-full w-full rounded-full object-cover" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-44 border border-neutral-300 bg-white shadow-md">
          <button
            type="button"
            onClick={handleProfile}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-base text-neutral-900 transition hover:bg-neutral-100 md:text-lg"
          >
            <User className="h-4 w-4 shrink-0 text-neutral-600 md:h-5 md:w-5" />
            My Profile
          </button>
          <div className="border-t border-neutral-200" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-base text-red-600 transition hover:bg-neutral-100 md:text-lg"
          >
            <LogOut className="h-4 w-4 shrink-0 text-red-600 md:h-5 md:w-5" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

export default AvatarDropdown
