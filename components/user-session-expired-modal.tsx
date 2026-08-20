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
    window.location.href = '/login'
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Phiên đăng nhập đã hết hạn</AlertDialogTitle>
          <AlertDialogDescription>
            Phiên đăng nhập của bạn đã hết hạn để đảm bảo an toàn. Vui lòng xác nhận để quay về trang đăng nhập.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleConfirm}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
