'use client'

import React, { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { clearSession } from '@/features/auth/store/auth.storage'

export const UserSessionExpiredModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleSessionExpired = (e: any) => {
      if (!e.detail?.isAdmin) {
        setIsOpen(true)
      }
    }
    window.addEventListener('session-expired', handleSessionExpired)
    return () => window.removeEventListener('session-expired', handleSessionExpired)
  }, [])

  const handleConfirm = () => {
    setIsOpen(false)
    localStorage.removeItem('token')
    clearSession()
    window.location.href = '/login'
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Phiên đăng nhập đã hết hạn</AlertDialogTitle>
          <AlertDialogDescription>
            Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục thao tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleConfirm}>Đăng nhập lại</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
