'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { AdminModal } from '@/features/admin/components/ui/admin-modal'
import { AdminInput } from '@/features/admin/components/ui/admin-input'
import { AdminLabel } from '@/features/admin/components/ui/admin-label'
import { AdminButton } from '@/features/admin/components/ui/admin-button'
import { AdminUser } from '@/features/admin/store/admin-user.slice'
import calendarIcon from '@/app/assets/calendar.svg'

interface UserEditModalProps {
  isOpen: boolean
  onClose: () => void
  user: AdminUser | null
  onUpdateUser: (user: AdminUser) => void
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [phone, setPhone] = useState('')
  const [avatar, setAvatar] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setDob(user.dob || '')
      setPhone(user.phone || '')
      setAvatar(user.avatar || '')
      setErrorMessage('')
    }
  }, [user, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!user) return

    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên người dùng.')
      return
    }
    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập email.')
      return
    }
    if (!dob.trim()) {
      setErrorMessage('Vui lòng nhập ngày sinh.')
      return
    }
    if (!phone.trim()) {
      setErrorMessage('Vui lòng nhập số điện thoại.')
      return
    }
    if (!avatar.trim()) {
      setErrorMessage('Vui lòng nhập link ảnh avatar.')
      return
    }

    const updatedUser: AdminUser = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      dob: dob.trim(),
      phone: phone.trim(),
      avatar: avatar.trim(),
    }

    onUpdateUser(updatedUser)
    onClose()
  }

  const modalFooter = (
    <>
      <AdminButton
        type="button"
        variant="outline"
        onClick={onClose}
        className="px-6 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium"
      >
        Hủy
      </AdminButton>
      <AdminButton
        type="button"
        variant="primary"
        onClick={() => {
          const formElement = document.getElementById('edit-user-form') as HTMLFormElement
          if (formElement) formElement.requestSubmit()
        }}
        className="px-6 bg-[#0F60FF] hover:bg-[#0C53DF] text-white font-medium"
      >
        Lưu
      </AdminButton>
    </>
  )

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa người dùng"
      footer={modalFooter}
    >
      <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Tên người dùng */}
        <div>
          <AdminLabel htmlFor="edit-user-name">
            Tên người dùng <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="edit-user-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên người dùng"
          />
        </div>

        {/* Email */}
        <div>
          <AdminLabel htmlFor="edit-user-email">
            Email <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="edit-user-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </div>

        {/* Ngày sinh */}
        <div>
          <AdminLabel htmlFor="edit-user-dob">
            Ngày sinh <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <div className="relative">
            <AdminInput
              id="edit-user-dob"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="YYYY/MM/DD"
              className="pr-10"
            />
            <Image
              src={calendarIcon}
              alt="Calendar"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 object-contain pointer-events-none"
            />
          </div>
        </div>

        {/* Số điện thoại */}
        <div>
          <AdminLabel htmlFor="edit-user-phone">
            Số điện thoại <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="edit-user-phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
          />
        </div>

        {/* Avatar */}
        <div>
          <AdminLabel htmlFor="edit-user-avatar">
            Avatar <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="edit-user-avatar"
            required
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Nhập link ảnh avatar"
          />
        </div>

        {/* Error message */}
        {errorMessage && (
          <p className="text-xs text-red-500 font-medium text-center">{errorMessage}</p>
        )}
      </form>
    </AdminModal>
  )
}
