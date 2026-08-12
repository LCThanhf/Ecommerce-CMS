'use client'

import React from 'react'
import { AdminModal } from './admin-modal'
import { AdminButton } from './admin-button'

interface AdminConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  isDestructive = true,
}) => {
  const modalFooter = (
    <>
      <AdminButton
        type="button"
        variant="outline"
        onClick={onClose}
        className="px-6 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium"
      >
        {cancelText}
      </AdminButton>
      <AdminButton
        type="button"
        variant={isDestructive ? 'danger' : 'primary'}
        onClick={() => {
          onConfirm()
          onClose()
        }}
        className="px-6 font-medium"
      >
        {confirmText}
      </AdminButton>
    </>
  )

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={modalFooter}
      maxWidth="max-w-[400px]"
    >
      <div className="text-sm text-slate-600 font-medium leading-relaxed">
        {message}
      </div>
    </AdminModal>
  )
}
