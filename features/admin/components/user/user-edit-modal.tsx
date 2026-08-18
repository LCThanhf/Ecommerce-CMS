'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { AdminModal } from '@/features/admin/components/ui/admin-modal'
import { AdminInput } from '@/features/admin/components/ui/admin-input'
import { AdminLabel } from '@/features/admin/components/ui/admin-label'
import { AdminButton } from '@/features/admin/components/ui/admin-button'
import { AdminImageUpload } from '@/features/admin/components/ui/admin-image-upload'
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
  const [gender, setGender] = useState('')
  const [homeAddress, setHomeAddress] = useState('')
  const [workAddress, setWorkAddress] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const dateInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setDob(user.dob || '')
      setPhone(user.phone || '')
      setAvatar(user.avatar || '')
      setGender(user.gender || '')
      setHomeAddress(user.homeAddress || '')
      setWorkAddress(user.workAddress || '')
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
      setErrorMessage('Vui lòng tải lên ảnh avatar.')
      return
    }

    const updatedUser: AdminUser = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      dob: dob.trim(),
      phone: phone.trim(),
      avatar: avatar.trim(),
      gender: gender.trim(),
      homeAddress: homeAddress.trim(),
      workAddress: workAddress.trim(),
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
            <input
              ref={dateInputRef}
              type="date"
              className="absolute pointer-events-none opacity-0 w-0 h-0 bottom-0 left-0"
              onChange={(e) => {
                if (e.target.value) {
                  const formatted = e.target.value.replace(/-/g, '/')
                  setDob(formatted)
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const el = dateInputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null
                if (el) {
                  if (typeof el.showPicker === 'function') {
                    el.showPicker()
                  } else {
                    el.click()
                  }
                }
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition cursor-pointer"
              title="Mở lịch chọn ngày sinh"
            >
              <Image
                src={calendarIcon}
                alt="Calendar"
                className="h-4 w-4 object-contain"
              />
            </button>
          </div>
        </div>

        {/* Số điện thoại */}
        <div>
          <AdminLabel htmlFor="edit-user-phone">
            Số điện thoại <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="edit-user-phone"
            type="tel"
            inputMode="numeric"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="Nhập số điện thoại"
          />
        </div>

        {/* Giới tính */}
        <div>
          <AdminLabel htmlFor="edit-user-gender">Giới tính</AdminLabel>
          <select
            id="edit-user-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full h-11 px-3 border border-slate-200 rounded-md outline-none focus:border-[#0F60FF] focus:ring-1 focus:ring-[#0F60FF] transition bg-white text-[15px]"
          >
            <option value="">Chọn giới tính</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
            <option value="Other">Khác</option>
          </select>
        </div>

        {/* Địa chỉ nhà */}
        <div>
          <AdminLabel htmlFor="edit-user-home-address">Địa chỉ nhà</AdminLabel>
          <AdminInput
            id="edit-user-home-address"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            placeholder="Nhập địa chỉ nhà"
          />
        </div>

        {/* Nơi làm việc */}
        <div>
          <AdminLabel htmlFor="edit-user-work-address">Nơi làm việc</AdminLabel>
          <AdminInput
            id="edit-user-work-address"
            value={workAddress}
            onChange={(e) => setWorkAddress(e.target.value)}
            placeholder="Nhập nơi làm việc"
          />
        </div>

        {/* Avatar */}
        <div>
          <AdminLabel htmlFor="edit-user-avatar">
            Avatar <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminImageUpload
            id="edit-user-avatar"
            required
            value={avatar}
            onChange={(val) => setAvatar(val)}
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

